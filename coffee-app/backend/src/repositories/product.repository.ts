import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";

export const productRepository = {
  create: (data: Prisma.ProductCreateInput) =>
    prisma.product.create({ data }),

  findById: (id: string) =>
    prisma.product.findFirst({ where: { id, deletedAt: null } }),

  findByName: (name: string) =>
    prisma.product.findFirst({ where: { name, deletedAt: null } }),

  list: async (page: number, limit: number) => {
    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where: { deletedAt: null } }),
    ]);

    return { items, total };
  },

  update: (id: string, data: Prisma.ProductUpdateInput) =>
    prisma.product.update({ where: { id }, data }),

  softDelete: (id: string) =>
    prisma.product.update({ where: { id }, data: { deletedAt: new Date() } }),
};
