import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
