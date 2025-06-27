import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

/**
 * Middleware to authenticate the user based on the JWT token.
 * Adds the full user object to req.user.
 */
const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Please login again.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user; // ✅ Set user on request
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        console.error('JWT Error:', error);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authUser;
