import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        // 1. Get token from Authorization header (Bearer <token>)
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
        }

        const token = authHeader.split(' ')[1]; // Extract token after "Bearer "

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check if decoded email & password match admin credentials
        if (
            decoded.email !== process.env.ADMIN_EMAIL ||
            decoded.password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({ success: false, message: "Not Authorized. Invalid Token." });
        }

        next(); // Proceed if everything is valid
    } catch (error) {
        console.error("Admin Auth Error:", error);
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

export default adminAuth