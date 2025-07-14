import express from "express";
import {
  registerUser,
  loginUser,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  resendResetOTP,
  changePassword,
  getProfile,
  updateProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-registration-otp", verifyRegistrationOTP);
router.post("/resend-registration-otp", resendRegistrationOTP);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.post("/resend-reset-otp", resendResetOTP);

// Protected routes
router.post("/change-password", protect, changePassword);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin routes (protected)
router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;