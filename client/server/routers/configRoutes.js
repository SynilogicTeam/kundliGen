import express from 'express';
import multer from 'multer';
import path from 'path';
import { protectAdmin } from '../Middleware/adminAuthMiddleware.js';
import { getConfig, updateConfig, uploadImage, deleteImage, getUploadedImages } from '../controllers/configController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if it's an image file by mimetype
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      // Also check file extension as fallback
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg'];
      const fileExtension = path.extname(file.originalname).toLowerCase();
      if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed. Supported formats: JPG, JPEG, PNG, GIF, WebP, BMP, TIFF, SVG'), false);
      }
    }
  }
});

// Get configuration
router.get('/', getConfig);

// Update configuration
router.put('/', protectAdmin, updateConfig);

// Upload image
router.post('/upload-image', protectAdmin, upload.single('image'), uploadImage);

// Delete image
router.delete('/delete-image/:imageId', protectAdmin, deleteImage);

// Get uploaded images
router.get('/images', getUploadedImages);

export default router;
