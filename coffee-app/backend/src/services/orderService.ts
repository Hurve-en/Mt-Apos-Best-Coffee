import { prisma } from "../config/prisma.ts";
import { AppError } from "../utils/errorHandler.ts";
import type { IOrder, IOrderInput } from "../types/order.ts";

export const orderService = {
  // Create an order and decrement stock
  createOrder: async (userId: number, data: IOrderInput): Promise<IOrder> => {
    if (!data.items || data.items.length === 0) {
      throw new AppError(400, "Order must contain at least one item", true);
    }

    const productIds = [
      ...new Set(data.items.map((item) => String(item.productId))),
    ];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, deletedAt: null },
      select: { id: true, price: true, stock: true },
    });

    if (products.length !== productIds.length) {
      throw new AppError(400, "One or more products are invalid", true);
    }

    const productById = new Map(products.map((product) => [product.id, product]));

    const normalizedItems = data.items.map((item) => {
      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new AppError(400, "Quantity must be greater than 0", true);
      }

      const product = productById.get(item.productId);
      if (!product) {
        throw new AppError(400, "One or more products are invalid", true);
      }

      if (product.stock < quantity) {
        throw new AppError(400, `Insufficient stock for product ${item.productId}`, true);
      }

      return {
        productId: item.productId,
        quantity,
        price: Number(product.price),
      };
    });

    const total = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await prisma.$transaction(async (tx) => {
      for (const item of normalizedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          userId,
          total,
          status: "pending",
          items: {
            create: normalizedItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return order as unknown as IOrder;
  },

  // Fetch a single order with its items
  getOrderById: async (id: number): Promise<IOrder | null> => {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return order as unknown as IOrder;
  },

  // Fetch orders belonging to one user
  getUserOrders: async (userId: number): Promise<IOrder[]> => {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders as unknown as IOrder[];
  },

  // Fetch every order (admin view)
  getAllOrders: async (): Promise<IOrder[]> => {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders as unknown as IOrder[];
  },

  // Move an order to a new status
  updateOrderStatus: async (id: number, status: string): Promise<IOrder> => {
    const normalizedStatus = status.toLowerCase();
    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(normalizedStatus)) {
      throw new AppError(400, `Invalid status: ${status}`, true);
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: normalizedStatus },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return order as unknown as IOrder;
  },

  // Mark an order as cancelled when allowed
  cancelOrder: async (id: number): Promise<IOrder> => {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new AppError(404, "Order not found", true);
    }

    if (order.status === "delivered" || order.status === "cancelled") {
      throw new AppError(
        400,
        `Cannot cancel order with status ${order.status}`,
        true,
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: "cancelled" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updated as unknown as IOrder;
  },
};
