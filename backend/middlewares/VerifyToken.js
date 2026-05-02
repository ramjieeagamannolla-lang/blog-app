import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Get token from cookies
      const token = req.cookies?.token;

      // No token found
      if (!token) {
        return res.status(401).json({
          message: "Please login first"
        });
      }

      // Verify token
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      // Check role authorization
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({
          message: "You are not authorized"
        });
      }

      // Attach user to request
      req.user = decodedToken;

      next();
    } catch (err) {
      // IMPORTANT: return response properly
      return res.status(401).json({
        message: "Invalid or expired token",
        error: err.message
      });
    }
  };
};