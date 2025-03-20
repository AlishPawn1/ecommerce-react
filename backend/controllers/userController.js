import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { response } from "express";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ success: false, message: "User doesn't exist" }); // Set status 401
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            return res.status(200).json({ success: true, token });  // Use 200 for success
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" }); // Set status 401
        }

    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(500).json({ success: false, message: "Server error" }); // Use 500 for server error
    }
};

// route for user register
const registerUser = async (req, res) => {
    console.log("Incoming Request:", req.body);
    try {
        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (!password || password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        return res.json({ success: true, token });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.json({ success: false, message: error.message });
    }
};

// route for admin login
const adminLogin = async (req, res) => {

    try {
        const {email, password} = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success: true, token})
        } else{
            res.json({sucess: false, message: "Invalid Credentials"})
        }
    } catch (error) {
        console.error("Error in adminLogin:", error);
        return res.json({ success: false, message: error.message });
    }

};

export { loginUser, registerUser, adminLogin };
