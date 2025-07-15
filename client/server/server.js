import express from "express";
import cors from "cors";
import userRouter from "./routers/userRouter.js";
import { db } from "./config/db.js";
import dotenv from "dotenv";
import adminRoutes from "./routers/adminRoutes.js";
import configRoutes from "./routers/configRoutes.js";
import reportRoutes from "./routers/reportRoutes.js";
import Config from "./models/Config.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

dotenv.config();

db();

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 5000;

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create necessary directories
const uploadsDir = path.join(__dirname, '../public/uploads');
const publicImagesDir = path.join(__dirname, '../public/images');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Global Config Helper Function
export const getConfig = async () => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config();
      await config.save();
    }
    return config;
  } catch (error) {
    console.error('Error fetching config:', error);
    // Return default config if database error
    return new Config();
  }
};

// Make config available globally
app.locals.getConfig = getConfig;

// Middleware
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use("/api/users", userRouter);
app.use("/api/auth/admin", adminRoutes);
app.use("/api/config", configRoutes);
app.use("/api/reports", reportRoutes);

app.use(express.static(path.join(__dirname, '../dist')));
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
