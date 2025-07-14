import express from 'express';
import { getConfig, updateConfig } from '../controllers/configController.js';

const router = express.Router();

// Get configuration
router.get('/', getConfig);

// Update configuration
router.put('/', updateConfig);

export default router;
