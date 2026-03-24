import { Router } from "express";
import { orderController } from "../controllers/orderController.ts";
import { authMiddleware, adminMiddleware } from "../middleware/auth.ts";

const router = Router();

// Routes for authenticated customers
router.post("/", authMiddleware, orderController.createOrder);
router.get("/my-orders", authMiddleware, orderController.getUserOrders);
router.get("/:id", authMiddleware, orderController.getOrderById);
router.patch("/:id/cancel", authMiddleware, orderController.cancelOrder);

// Routes reserved for admins
router.get("/", authMiddleware, adminMiddleware, orderController.getAllOrders);
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus,
);

export default router;
