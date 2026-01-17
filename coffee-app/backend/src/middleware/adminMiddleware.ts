import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: string;
      email: string;
      role: string;
    };

    if (!decoded.role || !decoded.role.includes("ADMIN")) {
      res
        .status(403)
        .json({ success: false, message: "Admin access required" });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
