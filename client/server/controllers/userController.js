import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generateToken } from "../Middleware/jwt.js";
import { getConfig } from "../server.js";
import createTransporter from "../Middleware/nodeMailer.js";

dotenv.config();


// Generate 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send Email with dynamic config
const sendEmail = async (to, subject, html) => {
  try {
    const config = await getConfig();
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: config.smtpUser || process.env.EMAIL_USER,  
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

// @desc    Register user and send OTP
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }

    // Generate 4-digit OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      registrationOtp: otp,
      registrationOtpExpires: otpExpires,
    });

    if (user) {
      // Get config for email settings
      const config = await getConfig();
      
      // Send OTP email
      const emailHtml = `
        <h2>Welcome to ${config.companyName || 'KundliGen'}!</h2>
        <p>Your verification OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 30 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <p>Best regards,<br>${config.companyName || 'KundliGen Team'}</p>
      `;

      const emailSent = await sendEmail(user.email, `Verify Your Account - ${config.companyName || 'KundliGen'}`, emailHtml);

      if (emailSent) {
        res.status(201).json({
          success: true,
          message: "Registration successful! Please check your email for OTP verification.",
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            address: user.address,
            isEmailVerified: user.isEmailVerified,
          },
        });
      } else {
        // Delete user if email sending fails
        await User.findByIdAndDelete(user._id);
        res.status(500).json({
          success: false,
          message: "Registration failed. Please try again.",
        });
      }
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Verify registration OTP
// @route   POST /api/users/verify-registration-otp
// @access  Public
export const verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      registrationOtp: otp,
      registrationOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Update user
    user.isEmailVerified = true;
    user.registrationOtp = null;
    user.registrationOtpExpires = null;
    await user.save();

    // Generate token using imported function
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Email verified successfully! You can now login.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        isEmailVerified: user.isEmailVerified,
        token,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Resend registration OTP
// @route   POST /api/users/resend-registration-otp
// @access  Public
export const resendRegistrationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    user.registrationOtp = otp;
    user.registrationOtpExpires = otpExpires;
    await user.save();

    // Send OTP email
    const emailHtml = `
      <h2>KundliGen - New Verification OTP</h2>
      <p>Your new verification OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 30 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    const emailSent = await sendEmail(user.email, "New Verification OTP - KundliGen", emailHtml);

    if (emailSent) {
      res.json({
        success: true,
        message: "New OTP sent to your email successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if password matches
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    // Generate token using imported function
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        isEmailVerified: user.isEmailVerified,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Forgot password - send OTP
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const config = await getConfig();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate 4-digit OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpires;
    await user.save();

    // Send OTP email with config
    const emailHtml = `
      <h2>Password Reset - ${config.companyName || 'KundliGen'}</h2>
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 30 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>${config.companyName || 'KundliGen Team'}</p>
    `;

    const emailSent = await sendEmail(user.email, `Password Reset OTP - ${config.companyName || 'KundliGen'}`, emailHtml);

    if (emailSent) {
      res.json({
        success: true,
        message: "OTP sent to your email successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Verify password reset OTP (without resetting password)
// @route   POST /api/users/verify-reset-otp
// @access  Public
export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Don't clear OTP yet - it will be cleared when password is actually reset
    res.json({
      success: true,
      message: "OTP verified successfully. You can now set your new password.",
    });
  } catch (error) {
    console.error("Reset OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/users/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Resend password reset OTP
// @route   POST /api/users/resend-reset-otp
// @access  Public
export const resendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpires;
    await user.save();

    // Send OTP email
    const emailHtml = `
      <h2>KundliGen - New Password Reset OTP</h2>
      <p>Your new password reset OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 30 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    const emailSent = await sendEmail(user.email, "New Password Reset OTP - KundliGen", emailHtml);

    if (emailSent) {
      res.json({
        success: true,
        message: "New OTP sent to your email successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }
  } catch (error) {
    console.error("Resend reset OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Change password (authenticated user)
// @route   POST /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, dateOfBirth, address, location } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if phone is already taken by another user
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone, _id: { $ne: userId } });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already taken",
        });
      }
    }

    // Update user
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.address = address || user.address;
    
    // Update location if provided
    if (location) {
      user.location = {
        type: 'Point',
        coordinates: location.coordinates || [0, 0],
        formattedAddress: location.formattedAddress || '',
        placeId: location.placeId || ''
      };
    }
    
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        location: user.location,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
