import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
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

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Create a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Send the token, userId, and userName in the response
        res.status(200).json({
            success: true,
            token,
            userId: user._id,
            userName: user.name, // Include the user's name in the response
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: "Login failed" });
    }
};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Validate email format and password strength
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password (at least 8 characters)" });
        }

        // Hash the user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        const user = await newUser.save();

        // Create a token for the new user
        const token = createToken(user._id);

        // Send the token in the response
        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the provided credentials match the admin credentials
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
            res.status(200).json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error in adminLogin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Export the functions
export { loginUser, registerUser, adminLogin };