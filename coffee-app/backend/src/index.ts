import express from "express";
import type { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { corsMiddleware, optionsHandler } from "./middleware/cors.ts";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.ts";
import routes from "./routes/index.ts";
import { logger } from "./utils/logger.ts";

// Load .env variables before anything else
dotenv.config();
console.log("env PORT after dotenv:", process.env.PORT);

// Shared Prisma client for database work
export const prisma = new PrismaClient();

// Create Express server instance
const app = express();
const PORT = process.env.PORT || 3000; // default stays 3000 to match the frontend dev server

// Middleware stack
app.use(helmet());

app.use(corsMiddleware);
app.options("*", optionsHandler);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
});

// Basic routes
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Main API router
app.use("/api", routes);

// Catch unknown routes
app.use(notFoundHandler);

// Surface errors in a consistent shape
app.use(globalErrorHandler);

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
            price: 399,
            roastLevel: "Medium",
            grind: "Whole Beans",
            size: "250g",
            image: baseImage,
            stock: 50,
          },
          {
            name: "Mt. Apo Arabica 500g",
            description:
              "Premium medium roast Arabica beans sourced from Mt. Apo.",
            price: 689,
            roastLevel: "Medium",
            grind: "Ground",
            size: "500g",
            image: baseImage,
            stock: 40,
          },
          {
            name: "Mt. Apo Dark Roast 250g",
            description: "Bold dark roast profile for espresso and strong brews.",
            price: 429,
            roastLevel: "Dark",
            grind: "Espresso",
            size: "250g",
            image: baseImage,
            stock: 35,
          },
          {
            name: "Mt. Apo Light Roast 250g",
            description: "Crisp and bright light roast with floral notes.",
            price: 379,
            roastLevel: "Light",
            grind: "Whole Beans",
            size: "250g",
            image: baseImage,
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
