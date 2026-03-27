import fs from "fs";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";
import type { Request } from "express";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const mimeToExtension = (mime: string, originalName: string): string => {
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  const fallback = path.extname(originalName);
  return fallback || ".bin";
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const ext = mimeToExtension(file.mimetype, file.originalname);
    cb(null, `${randomUUID()}-${timestamp}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  _req: Request,
  file,
  cb,
) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only jpeg, png, and webp images are allowed"));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const getUploadPath = (filename: string): string =>
  path.join("/uploads", filename);
