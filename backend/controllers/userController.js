import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { sendEmail } from './sendEmail.js';

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
        const { email, password } = req.body;

        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "Please verify your email first" });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Create a token
        const token = createToken(user._id);

        // Send the token, userId, and userName in the response
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

// Route for user registration
// Register user function
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password strength (minimum 8 characters)
        if (!password || password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification code
        const code = generateVerificationCode();

        // Create a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            verificationCode: code,
            verificationCodeExpires: Date.now() + 30 * 60 * 1000, // Code expires in 30 minutes
        });

        // Save user to the database
        const user = await newUser.save();

        // Construct the verification link
        const verificationLink = `${process.env.BACKEND_URL}/api/user/verify?email=${encodeURIComponent(email)}&code=${code}`;

        // Email content with HTML styling
        const emailSubject = 'Verify Your Email Address';
        const emailMessage = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .button {
              padding: 10px 20px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            }
            .heading {
              color: #333;
            }
            .message {
              font-size: 16px;
            }
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

        // Send the verification email using SendGrid
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

        // Redirect to frontend login page with success message
        res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
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

        const verificationLink = `${process.env.BACKEND_URL}/api/user/verify?email=${encodeURIComponent(email)}&code=${code}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email Address",
            html: `
          <h2>Welcome to Our E-commerce Store!</h2>
          <p>Please verify your email by clicking the link below or entering the code manually:</p>
          <p><strong>Verification Code:</strong> ${code}</p>
          <p>This code expires in 30 minutes.</p>
        `
        };
        // <p><a href="${verificationLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a></p>

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Verification code resent" });
    } catch (error) {
        console.error("Error in resendCode:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { registerUser, loginUser, verifyEmail, verifyCode, resendCode, adminLogin };
