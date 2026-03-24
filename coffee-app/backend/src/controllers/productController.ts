// Product CRUD handlers
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all products
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Get a single product by id
export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// Create a product (Admin only)
export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description, price, roastLevel, grind, size, image, stock } =
      req.body;

    // Ensure all required fields are present
    if (
      !name ||
      !description ||
      !price ||
      !roastLevel ||
      !grind ||
      !size ||
      !image
    ) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    // Avoid duplicates by name
    const existingProduct = await prisma.product.findUnique({
      where: { name },
    });

    if (existingProduct) {
      res.status(409).json({
        success: false,
        message: "Product already exists",
      });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        roastLevel,
        grind,
        size,
        image,
        stock: parseInt(stock) || 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// Update a product (Admin only)
export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, roastLevel, grind, size, image, stock } =
      req.body;

    // Confirm the product exists before updating
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    // Prevent name collisions when renaming
    if (name && name !== existingProduct.name) {
      const duplicateProduct = await prisma.product.findUnique({
        where: { name },
      });
      if (duplicateProduct) {
        res.status(409).json({
          success: false,
          message: "Product name already exists",
        });
        return;
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(roastLevel && { roastLevel }),
        ...(grind && { grind }),
        ...(size && { size }),
        ...(image && { image }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Delete a product (Admin only)
export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Confirm the product exists before deletion
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: { id: parseInt(id) },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
