import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorHandler.ts";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

const getTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
};

export const requireAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      throw new AppError(401, "Authentication token is required", true);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError(500, "JWT_SECRET is not configured", false);
    }

    const decoded = jwt.verify(token, secret) as {
      id: number;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError(401, "Token has expired", true));
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, "Invalid token", true));
      return;
    }
    next(error);
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    next(new AppError(401, "Authentication required", true));
    return;
  }

  if ((req.user.role || "").toLowerCase() !== "admin") {
    next(new AppError(403, "Admin access required", true));
    return;
  }

  next();
};
