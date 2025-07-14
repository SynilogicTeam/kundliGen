import nodemailer from "nodemailer";
import { getConfig } from "../server.js";

const createTransporter = async () => {
    const config = await getConfig();
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.smtpUser || process.env.EMAIL_USER,
        pass: config.smtpPassword || process.env.EMAIL_PASS,
      },
    });
  };
  
export default createTransporter;