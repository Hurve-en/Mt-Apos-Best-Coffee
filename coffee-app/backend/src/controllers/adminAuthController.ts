import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Email and password required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    if (!user.role || !user.role.includes("ADMIN")) {
      res.status(403).json({ success: false, message: "Admin access only" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Admin login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAdminStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalPrice: true },
    });
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
