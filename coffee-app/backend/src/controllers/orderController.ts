import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.ts";
import { orderService } from "../services/orderService.ts";
import { logger } from "../utils/logger.ts";
import { AppError } from "../utils/errorHandler.ts";

export const orderController = {
  // Create a new order for the current user
  createOrder: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      const { items } = req.body;

      if (!items || items.length === 0) {
        res.status(400).json({ message: "Items are required" });
        return;
      }

      const normalizedItems = (items as any[]).map((item) => ({
        productId: String(item.productId),
        quantity: Number(item.quantity),
        price: Number(item.price),
      }));

      const order = await orderService.createOrder(Number(req.user.id), {
        items: normalizedItems,
      });

      logger.success("Order created", {
        orderId: order.id,
        userId: req.user.id,
      });

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
      });
    } catch (error) {
      logger.error("Create order error", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  },

  // Get a single order by id
  getOrderById: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(Number(id));

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      // Only owners or admins can view the order
      if (req.user?.role?.toLowerCase() !== "admin" && order.userId !== req.user?.id) {
        res.status(403).json({ message: "Not authorized" });
        return;
      }

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      logger.error("Get order error", error);
      res.status(500).json({ message: "Failed to get order" });
    }
  },

  // Get all orders for the current user
  getUserOrders: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      const orders = await orderService.getUserOrders(Number(req.user.id));
      res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      logger.error("Get user orders error", error);
      res.status(500).json({ message: "Failed to get orders" });
    }
  },

  // Get every order (admin)
  getAllOrders: async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      logger.error("Get all orders error", error);
      res.status(500).json({ message: "Failed to get orders" });
    }
  },

  // Change an order's status (admin)
  updateOrderStatus: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ message: "Status is required" });
        return;
      }

      const order = await orderService.updateOrderStatus(Number(id), status);

      logger.success("Order status updated", { orderId: id, status });

      res.status(200).json({
        success: true,
        message: "Order status updated",
        order,
      });
    } catch (error) {
      logger.error("Update order status error", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Failed to update order" });
    }
  },

  // Cancel an order when allowed
  cancelOrder: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await orderService.cancelOrder(Number(id));

      logger.success("Order cancelled", { orderId: id });

      res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        order,
      });
    } catch (error) {
      logger.error("Cancel order error", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to cancel order" });
      }
    }
  },
};
