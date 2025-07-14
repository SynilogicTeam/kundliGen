import express from "express";
import cors from "cors";
import userRouter from "./routers/userRouter.js";
import { db } from "./config/db.js";
import dotenv from "dotenv";
import adminRoutes from "./routers/adminRoutes.js";
import configRoutes from "./routers/configRoutes.js";
import reportRoutes from "./routers/reportRoutes.js";
import Config from "./models/Config.js";

dotenv.config();

db();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/auth/admin", adminRoutes);
app.use("/api/config", configRoutes);
app.use("/api/reports", reportRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
