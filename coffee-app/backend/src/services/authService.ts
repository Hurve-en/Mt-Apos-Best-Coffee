import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/errorHandler.ts";
import type { ITokenPayload } from "../types/user.ts";

export const authService = {
  // Hash a plaintext password
  hashPassword: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  // Validate a password against its hash
  comparePassword: async (
    password: string,
    hashedPassword: string,
  ): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  },

  // Issue a short-lived access token
  generateToken: (payload: ITokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "15m",
    });
  },

  // Issue a longer-lived refresh token
  generateRefreshToken: (payload: ITokenPayload): string => {
    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret",
      {
        expiresIn: "7d",
      },
    );
  },

  // Decode and validate an access token
  verifyToken: (token: string): ITokenPayload => {
    try {
      return jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      ) as ITokenPayload;
    } catch (error) {
      throw new AppError(401, "Invalid or expired token", true);
    }
  },

  // Decode and validate a refresh token
  verifyRefreshToken: (token: string): ITokenPayload => {
    try {
      return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || "your-refresh-secret",
      ) as ITokenPayload;
    } catch (error) {
      throw new AppError(401, "Invalid or expired refresh token", true);
    }
  },
};
