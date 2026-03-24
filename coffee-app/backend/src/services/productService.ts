import { prisma } from "../index.ts";
import { IProduct, IProductInput } from "../types/product.ts";

export const productService = {
  // Return every product in the catalog
  getAllProducts: async (): Promise<IProduct[]> => {
    const products = await prisma.product.findMany();
    return products as unknown as IProduct[];
  },

  // Look up a single product by its id
  getProductById: async (id: number): Promise<IProduct | null> => {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product as unknown as IProduct;
  },

  // Create a new product (admin only)
  createProduct: async (data: IProductInput): Promise<IProduct> => {
    const product = await prisma.product.create({
      data,
    });
    return product as unknown as IProduct;
  },

  // Update an existing product (admin only)
  updateProduct: async (
    id: number,
    data: Partial<IProductInput>,
  ): Promise<IProduct> => {
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    return product as unknown as IProduct;
  },

  // Remove a product from the catalog (admin only)
  deleteProduct: async (id: number): Promise<IProduct> => {
    const product = await prisma.product.delete({
      where: { id },
    });
    return product as unknown as IProduct;
  },
};
