import { Router } from "express";
import authRoutes from "./auth.ts";
import userRoutes from "./users.ts";
import productRoutes from "./products.ts";
import orderRoutes from "./orders.ts";
import productRoutes from "./products";

// Then add this line with your other routes:
router.use("/products", productRoutes);

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

export default router;
