import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";
import { AppError } from "../utils/errorHandler.ts";
import { logger } from "../utils/logger.ts";

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: "Route not found" });
};

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof MulterError) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof Error) {
    logger.error(err.message, err.stack);
    const message = process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message;
    res.status(500).json({ success: false, message });
    return;
  }

  res.status(500).json({ success: false, message: "Internal Server Error" });
};
