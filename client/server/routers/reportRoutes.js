import express from 'express';
import {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
  toggleReportStatus,
  getActiveReports,
  bulkUpdateReports
} from '../controllers/reportController.js';
import { protectAdmin } from '../Middleware/adminAuthMiddleware.js';

const router = express.Router();


router.get('/active', getActiveReports); // Get active reports for public use
// CRUD operations
router.post('/', protectAdmin, createReport); // Create new report
router.get('/', getAllReports); // Get all reports with filtering and pagination
router.get('/:id', getReportById); // Get single report by ID
router.put('/:id', protectAdmin, updateReport); // Update report
router.delete('/:id', protectAdmin, deleteReport); // Delete report

// Additional operations
router.patch('/:id/toggle-status', protectAdmin, toggleReportStatus); // Toggle active status
router.put('/bulk/update', protectAdmin, bulkUpdateReports); // Bulk update reports

export default router;
