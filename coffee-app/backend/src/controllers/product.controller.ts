import type { NextFunction, Response } from "express";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema.ts";
import { productService } from "../services/product.service.ts";
import { AppError } from "../utils/errorHandler.ts";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.ts";
import { getUploadPath } from "../config/multer.config.ts";

const normalizeOptional = (value?: string) =>
  value === "" ? undefined : value;

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const payload = createProductSchema.parse(req.body);

    if (!req.file) {
      throw new AppError(400, "Product image is required", true);
    }

    const imageUrl = getUploadPath(req.file.filename);
    const product = await productService.createProduct(
      {
        ...payload,
        description: normalizeOptional(payload.description),
        roastLevel: normalizeOptional(payload.roastLevel),
        grind: normalizeOptional(payload.grind),
        size: normalizeOptional(payload.size),
      },
      imageUrl,
    );

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const listProducts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const { items, meta } = await productService.listProducts(page, limit);
    res.status(200).json({ success: true, data: items, meta });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const payload = updateProductSchema.parse(req.body);
    const normalizedPayload = {
      ...payload,
      description: normalizeOptional(payload.description),
      roastLevel: normalizeOptional(payload.roastLevel),
      grind: normalizeOptional(payload.grind),
      size: normalizeOptional(payload.size),
    };

    const imageUrl = req.file ? getUploadPath(req.file.filename) : undefined;
    const product = await productService.updateProduct(
      req.params.id,
      normalizedPayload,
      imageUrl,
    );

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await productService.softDeleteProduct(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
