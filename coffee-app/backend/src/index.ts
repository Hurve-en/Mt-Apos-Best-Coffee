import dotenv from "dotenv";
import { Prisma } from "@prisma/client";
import { app } from "./app.ts";
import { prisma } from "./config/prisma.ts";
import { logger } from "./utils/logger.ts";

// Load .env variables before anything else
dotenv.config();
const PORT = process.env.PORT || 3000; // default stays 3000 to match the frontend dev server

async function startServer(): Promise<void> {
  try {
    // Verify we can reach the database
    await prisma.$connect();
    logger.success("Database connected successfully");

    // Seed a minimal catalog so menu/order flows work on a fresh install
    const productCount = await prisma.product.count();
    if (productCount === 0) {
      const baseImage =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%238B4513'/%3E%3C/svg%3E";

      await prisma.product.createMany({
        data: [
          {
            name: "Mt. Apo Arabica 250g",
            description:
              "100% Premium Arabica from Mt. Apo. Medium roast with balanced flavor.",
            price: new Prisma.Decimal(399),
            roastLevel: "Medium",
            grind: "Whole Beans",
            size: "250g",
            imageUrl: baseImage,
            stock: 50,
          },
          {
            name: "Mt. Apo Arabica 500g",
            description:
              "Premium medium roast Arabica beans sourced from Mt. Apo.",
            price: new Prisma.Decimal(689),
            roastLevel: "Medium",
            grind: "Ground",
            size: "500g",
            imageUrl: baseImage,
            stock: 40,
          },
          {
            name: "Mt. Apo Dark Roast 250g",
            description: "Bold dark roast profile for espresso and strong brews.",
            price: new Prisma.Decimal(429),
            roastLevel: "Dark",
            grind: "Espresso",
            size: "250g",
            imageUrl: baseImage,
            stock: 35,
          },
          {
            name: "Mt. Apo Light Roast 250g",
            description: "Crisp and bright light roast with floral notes.",
            price: new Prisma.Decimal(379),
            roastLevel: "Light",
            grind: "Whole Beans",
            size: "250g",
            imageUrl: baseImage,
            stock: 45,
          },
        ],
      });

      logger.info("Catalog was empty, seeded default products");
    }

    // Start listening for requests
    app.listen(PORT, () => {
      logger.success(`Server running on port ${PORT}`);
      logger.info(`API URL: http://localhost:${PORT}/api`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

// Close connections cleanly on shutdown signals
process.on("SIGTERM", async () => {
  logger.warn("SIGTERM signal received: closing HTTP server");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.warn("SIGINT signal received: closing HTTP server");
  await prisma.$disconnect();
  process.exit(0);
});

// Boot the application
startServer();
