import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate the user based on the JWT token.
 * This function checks for the presence of a valid token in the Authorization header.
 * If the token is valid, it adds the user ID to the request body.
 * Otherwise, it sends a 401 Unauthorized response.
 */
const authUser = async (req, res, next) => {
    // Extract the Authorization header
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Please login again.' });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the JWT secret from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user ID to the request body for later use in the route
        req.body.userId = decoded.id;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        // Log the error for debugging purposes
        console.error('JWT Error:', error);

        // Send a 401 Unauthorized response if token is invalid or expired
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authUser;
