import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, price, category, isAvailable } = req.body;

    if (!name || !price || !category) {
      res.status(400).json({
        success: false,
        message: "Name, price, and category required",
      });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        category,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category, isAvailable } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
    });

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    console.error("Update product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === "P2025") {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
