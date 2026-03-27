import { Prisma } from "@prisma/client";
import { productRepository } from "../repositories/product.repository.ts";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema.ts";
import { AppError } from "../utils/errorHandler.ts";

export const productService = {
  createProduct: async (
    input: CreateProductInput,
    imageUrl?: string,
  ) => {
    const existing = await productRepository.findByName(input.name);
    if (existing) {
      throw new AppError(409, "Product name already exists", true);
    }

    const product = await productRepository.create({
      name: input.name,
      description: input.description || undefined,
      price: new Prisma.Decimal(input.price),
      stock: input.stock ?? 0,
      imageUrl: imageUrl ?? input.imageUrl,
      roastLevel: input.roastLevel || undefined,
      grind: input.grind || undefined,
      size: input.size || undefined,
    });

    return product;
  },

  listProducts: async (page: number, limit: number) => {
    const { items, total } = await productRepository.list(page, limit);
    return {
      items,
      meta: {
        page,
        limit,
        total,
      },
    };
  },

  getProductById: async (id: string) => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError(404, "Product not found", true);
    }
    return product;
  },

  updateProduct: async (
    id: string,
    input: UpdateProductInput,
    imageUrl?: string,
  ) => {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new AppError(404, "Product not found", true);
    }

    if (input.name && input.name !== existing.name) {
      const duplicate = await productRepository.findByName(input.name);
      if (duplicate && duplicate.id !== id) {
        throw new AppError(409, "Product name already exists", true);
      }
    }

    const data: Prisma.ProductUpdateInput = {
      ...input,
      description: input.description ?? existing.description,
      price: input.price !== undefined ? new Prisma.Decimal(input.price) : existing.price,
      stock: input.stock !== undefined ? input.stock : existing.stock,
      imageUrl: imageUrl ?? input.imageUrl ?? existing.imageUrl,
      roastLevel: input.roastLevel ?? existing.roastLevel,
      grind: input.grind ?? existing.grind,
      size: input.size ?? existing.size,
    };

    const updated = await productRepository.update(id, data);
    return updated;
  },

  softDeleteProduct: async (id: string) => {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new AppError(404, "Product not found", true);
    }
    await productRepository.softDelete(id);
    return { id };
  },
};
