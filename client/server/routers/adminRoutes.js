import express from "express";
import {
  createAdmin,
  getAdmin,
  updateAdmin,
  loginAdmin,
  getAllAdmins,
  deleteAdmin,
  logoutAdmin
} from "../controllers/adminController.js";
import { protectAdmin } from "../Middleware/adminAuthMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", loginAdmin);

// Protected routes
router.post("/logout", logoutAdmin);

// Admin CRUD routes
router.route("/")
  .post(createAdmin)
  .get(getAdmin);

router.route("/all")
  .get(getAllAdmins);

router.route("/:id")
  .put(updateAdmin)
  .delete(deleteAdmin);

export default router;