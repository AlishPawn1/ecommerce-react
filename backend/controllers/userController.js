import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from './sendEmail.js';
import { v2 as cloudinary } from "cloudinary";


// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Generate 6-digit code
const generateVerificationCode = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const { email, password } = req.body;
    console.log('Received login data:', { email, password }); // Debug log
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: 'Please verify your email first' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const token = createToken(user._id);
    res.status(200).json({
      success: true,
      token,
      userId: user._id,
      userName: user.name,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  const { name, email, password, address, number } = req.body;
  let imageUrl = '';

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Validate inputs
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }
    if (address.trim().split(' ').length < 1) {
      return res.status(400).json({ success: false, message: "Address must contain at least 2 words." });
    }
    if (!/^(9[876]\d{8})$/.test(number)) {
      return res.status(400).json({ success: false, message: "Phone number must be 10 digits starting with 98, 97, or 96." });
    }

    // Handle image upload to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'users',
      });
      imageUrl = result.secure_url;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification code
    const code = generateVerificationCode();

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      address,
      number,
      image: imageUrl, // Store Cloudinary URL
      verificationCode: code,
      verificationCodeExpires: Date.now() + 30 * 60 * 1000,
    });

    const user = await newUser.save();

    // Send verification email
    const frontendUrls = process.env.FRONTEND_URLS.split(',').map(url => url.trim().replace(/\/+$/, ''));
    const baseUrl = frontendUrls[0]; // Always use the first URL
    const verificationLink = `${baseUrl}/email-verify?email=${encodeURIComponent(email)}&code=${code}`;
    console.log("Verification Link:", verificationLink);

    const emailSubject = 'Verify Your Email Address';
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
      message: 'Registration successful! Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route for email verification via link
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.query;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Verification code expired" });
        }
        if (user.verificationCode !== code) {
            return res.status(400).json({ success: false, message: "Invalid verification code" });
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();
        res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Route for email verification via manual code
const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Verification code expired" });
        }
        if (user.verificationCode !== code) {
            return res.status(400).json({ success: false, message: "Invalid verification code" });
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();
        res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error in adminLogin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const resendCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "Email already verified" });
        }
        const code = generateVerificationCode();
        user.verificationCode = code;
        user.verificationCodeExpires = Date.now() + 30 * 60 * 1000;
        await user.save();
        
        const frontendUrls = process.env.FRONTEND_URLS.split(',').map(url => url.trim().replace(/\/+$/, ''));
        const baseUrl = frontendUrls[0]; // Always use the first URL
        const verificationLink = `${baseUrl}/email-verify?email=${encodeURIComponent(email)}&code=${code}`;
        console.log("Resend Verification Link:", verificationLink);

        const emailSubject = 'Verify Your Email Address';
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
        res.status(200).json({ success: true, message: "Verification code resent" });
    } catch (error) {
        console.error("Error in resendCode:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getAllUsers = async (req, res) => {
  try {
    console.log('Fetching all users...');
    const users = await userModel.find({}, 'name email number address image isVerified');
    console.log('Users fetched:', users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// New deleteUser function
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { registerUser, loginUser, verifyEmail, verifyCode, resendCode, adminLogin, getAllUsers, deleteUser };