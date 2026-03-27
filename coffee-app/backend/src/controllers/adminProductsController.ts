import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, products });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, roastLevel, grind, size, imageUrl, stock } =
      req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || undefined,
        price: new Prisma.Decimal(parseFloat(price)),
        roastLevel,
        grind,
        size,
        imageUrl,
        stock: stock !== undefined ? parseInt(stock) : 0,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, roastLevel, grind, size, imageUrl, stock } =
      req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: new Prisma.Decimal(parseFloat(price)) }),
        ...(roastLevel && { roastLevel }),
        ...(grind && { grind }),
        ...(size && { size }),
        ...(imageUrl && { imageUrl }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
      },
    });

    return res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    console.error("Update product error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return res.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    console.error("Delete product error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
