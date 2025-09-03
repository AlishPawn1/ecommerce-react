import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "./sendEmail.js";
import { v2 as cloudinary } from "cloudinary";

// Function to create a JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Generate 6-digit code
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Route for user registration
const registerUser = async (req, res) => {
  const { name, email, password, address, number } = req.body;

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Validate inputs
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }
    if (!address || address.trim().split(" ").length < 2) {
      return res.status(400).json({
        success: false,
        message: "Address must contain at least 2 words",
      });
    }
    if (!/^(9[876]\d{8})$/.test(number)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits starting with 98, 97, or 96",
      });
    }

    // Check image uploaded (multer puts single file in req.file)
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "users",
    });

    if (!result.secure_url) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to upload image" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification code
    const code = generateVerificationCode();

    // Create new user document
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      address,
      number,
      image: result.secure_url,
      verificationCode: code,
      verificationCodeExpires: Date.now() + 30 * 60 * 1000, // expires in 30 minutes
    });

    const user = await newUser.save();

    // Prepare verification email
    const frontendUrls = process.env.FRONTEND_URLS.split(",").map((url) =>
      url.trim().replace(/\/+$/, ""),
    );
    const baseUrl = frontendUrls[0];
    const verificationLink = `${baseUrl}/email-verify?email=${encodeURIComponent(email)}&code=${code}`;
    console.log("Verification Link:", verificationLink);

    const emailSubject = "Verify Your Email Address";
    const emailMessage = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .button { padding: 10px 20px; background-color: #007bff; color: white !important; text-decoration: none; border-radius: 5px; }
            .heading { color: #333; }
            .message { font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="heading">Welcome to Our E-commerce Store!</h2>
            <p class="message">Please verify your email by clicking the link below or entering the code manually:</p>
            <p><strong>Verification Code:</strong> ${code}</p>
            <p><a href="${verificationLink}" class="button">Verify Email</a></p>
            <p>This code expires in 30 minutes.</p>
          </div>
        </body>
      </html>
    `;
    await sendEmail(email, emailSubject, emailMessage);

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route to get authenticated user's profile
const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(
      decoded.id,
      "name email number address image isVerified",
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Other functions remain unchanged
const loginUser = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const { email, password } = req.body;
    console.log("Received login data:", { email, password });
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Please verify your email first" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.status(200).json({
      success: true,
      token,
      userId: user._id,
      userName: user.name,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.query;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.verificationCodeExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code expired" });
    }
    if (user.verificationCode !== code) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.verificationCodeExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code expired" });
    }
    if (user.verificationCode !== code) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }
    console.log("Admin login attempt:", { email });
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }
    // Include both email and password in the token payload for adminAuth middleware
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET);
    console.log("Generated token:", token);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });
    }
    const code = generateVerificationCode();
    user.verificationCode = code;
    user.verificationCodeExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    const frontendUrls = process.env.FRONTEND_URLS.split(",").map((url) =>
      url.trim().replace(/\/+$/, ""),
    );
    const baseUrl = frontendUrls[0];
    const verificationLink = `${baseUrl}/email-verify?email=${encodeURIComponent(email)}&code=${code}`;
    console.log("Resend Verification Link:", verificationLink);

    const emailSubject = "Verify Your Email Address";
    const emailMessage = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .button { padding: 10px 20px; background-color: #007bff; color: white !important; text-decoration: none; border-radius: 5px; }
            .heading { color: #333; }
            .message { font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="heading">Welcome to Our E-commerce Store!</h2>
            <p class="message">Please verify your email by clicking the link below or entering the code manually:</p>
            <p><strong>Verification Code:</strong> ${code}</p>
            <p><a href="${verificationLink}" class="button">Verify Email</a></p>
            <p>This code expires in 30 minutes.</p>
          </div>
        </body>
      </html>
    `;
    await sendEmail(email, emailSubject, emailMessage);
    res
      .status(200)
      .json({ success: true, message: "Verification code resent" });
  } catch (error) {
    console.error("Error in resendCode:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching all users...");
    const users = await userModel.find(
      {},
      "name email number address image isVerified",
    );
    console.log("Users fetched:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { name, number, address, password } = req.body;

    if (name) user.name = name;
    if (number) user.number = number;
    if (address) user.address = address;

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        folder: "users",
      });

      if (!result.secure_url) {
        return res
          .status(400)
          .json({ success: false, message: "Failed to upload image" });
      }

      user.image = result.secure_url;
    }

    await user.save();

    // Remove sensitive info before sending response
    const userResponse = {
      name: user.name,
      email: user.email,
      number: user.number,
      address: user.address,
      image: user.image,
      isVerified: user.isVerified,
    };

    res.status(200).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found with this email" });
    }

    // Generate a random reset token (hex string)
    const resetToken = crypto.randomBytes(32).toString("hex");
    // Set token expiration 1 hour from now
    const resetTokenExpiry = Date.now() + 3600000;

    // Save token and expiry on user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Construct reset URL for frontend
    const frontendUrls = (process.env.FRONTEND_URLS || "http://localhost:5173")
      .split(",")
      .map((url) => url.trim().replace(/\/+$/, ""));
    const baseUrl = frontendUrls[0];
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Email message content
    const message = `
      <h3>Password Reset Request</h3>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    // Send reset email
    await sendEmail(email, "Password Reset Request", message);

    console.log(`Password reset email sent: ${resetUrl}`);

    res.status(200).json({
      success: true,
      message: "Password reset email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing forgot password.",
    });
  }
};

// Reset Password: Validate token + expiry, update password
const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  console.log("Reset password request:", {
    token,
    email,
    passwordProvided: !!password,
  });

  try {
    if (!token || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Token, email and new password are required",
      });
    }

    // Find user with matching email and reset token AND token not expired
    const user = await userModel.findOne({ email });

    // Debug logs for token and expiry in DB
    console.log("Stored reset token:", user?.resetPasswordToken);
    console.log("Stored token expiry:", user?.resetPasswordExpires);
    console.log("Current time:", Date.now());

    // Check user exists, token matches, and token is not expired
    if (
      !user ||
      user.resetPasswordToken !== token ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while resetting password",
    });
  }
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  verifyCode,
  resendCode,
  adminLogin,
  getAllUsers,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};
