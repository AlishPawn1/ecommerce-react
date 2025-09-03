import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader); // Debug log
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided. Please log in." });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted token:", token); // Debug log

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded payload:", decoded); // Debug log

    // Check if decoded email & password match admin credentials
    if (
      decoded.email !== process.env.ADMIN_EMAIL ||
      decoded.password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid credentials.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

export default adminAuth;
