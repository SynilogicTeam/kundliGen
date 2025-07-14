import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

// @desc    Protect admin routes
// @access  Private
export const protectAdmin = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get admin from token
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, admin not found",
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
}; 