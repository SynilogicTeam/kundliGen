import Admin from "../models/admin.js";
import { generateToken } from "../Middleware/jwt.js";

// @desc    Create new admin
// @route   POST /api/admin
// @access  Private (only super admin)
export const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email or username already exists"
      });
    }

    // Create new admin
    const admin = await Admin.create({
      username,
      email,
      password
    });

    if (admin) {
      res.status(201).json({
        success: true,
        message: "Admin created successfully",
        data: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          isActive: admin.isActive,
          createdAt: admin.createdAt
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid admin data"
      });
    }
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin
// @access  Private
export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    
    if (admin) {
      res.status(200).json({
        success: true,
        data: admin
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }
  } catch (error) {
    console.error("Get admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Update admin
// @route   PUT /api/admin/:id
// @access  Private
export const updateAdmin = async (req, res) => {
  try {
    const { username, email, isActive } = req.body;
    const adminId = req.params.id;

    // Check if admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Check if email/username already exists (if being updated)
    if (email && email !== admin.email) {
      const emailExists = await Admin.findOne({ email, _id: { $ne: adminId } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
    }

    if (username && username !== admin.username) {
      const usernameExists = await Admin.findOne({ username, _id: { $ne: adminId } });
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: "Username already exists"
        });
      }
    }

    // Update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      {
        username: username || admin.username,
        email: email || admin.email,
        isActive: isActive !== undefined ? isActive : admin.isActive
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: updatedAdmin
    });
  } catch (error) {
    console.error("Update admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated"
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    // Update last login and save token to database
    admin.lastLogin = new Date();
    admin.token = token;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
        token
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Admin logout
// @route   POST /api/admin/logout
// @access  Private
export const logoutAdmin = async (req, res) => {
  try {
    // Clear token from database
    req.admin.token = null;
    await req.admin.save();

    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Get all admins (for super admin)
// @route   GET /api/admin/all
// @access  Private
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}).select("-password").sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    console.error("Get all admins error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admin/:id
// @access  Private
export const deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;

    // Check if admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Prevent self-deletion
    if (adminId === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account"
      });
    }

    await Admin.findByIdAndDelete(adminId);

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully"
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}; 