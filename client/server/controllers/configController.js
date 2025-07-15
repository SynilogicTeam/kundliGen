import Config from '../models/Config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get configuration
export const getConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config();
      await config.save();
    }
    res.json(config);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
};

// Update configuration
export const updateConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config();
    }
    
    // Update config with request body
    Object.assign(config, req.body);
    await config.save();
    
    res.json(config);
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
};

// Upload image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const filename = `${imageId}_${req.file.originalname}`;
    
    // Create images directory if it doesn't exist
    const imagesDir = path.join(__dirname, '../../public/images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Move file to images directory with new name
    const oldPath = req.file.path;
    const newPath = path.join(imagesDir, filename);
    fs.renameSync(oldPath, newPath);

    // Create the full image URL with protocol and host
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/images/${filename}`;

    // Update the companyLogo in the database
    let config = await Config.findOne();
    if (!config) {
      config = new Config();
    }
    config.companyLogo = imageUrl;
    await config.save();

    // Return success response
    res.json({
      success: true,
      imageId: imageId,
      filename: filename,
      url: imageUrl,
      message: 'Image uploaded and company logo updated successfully'
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    
    // Find the image file
    const imagesDir = path.join(__dirname, '../../public/images');
    const files = fs.readdirSync(imagesDir);
    const imageFile = files.find(file => file.startsWith(imageId + '_'));
    
    if (!imageFile) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete the file
    const filePath = path.join(imagesDir, imageFile);
    fs.unlinkSync(filePath);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

// Get uploaded images
export const getUploadedImages = async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, '../../public/images');
    
    if (!fs.existsSync(imagesDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(imagesDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => {
        const imageId = file.split('_')[0];
        return {
          id: imageId,
          filename: file,
          url: `/images/${file}`,
          uploadedAt: fs.statSync(path.join(imagesDir, file)).mtime.toISOString()
        };
      });

    res.json(images);
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};
