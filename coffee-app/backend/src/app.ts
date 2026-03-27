import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { corsMiddleware, optionsHandler } from "./middleware/cors.ts";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.ts";
import routes from "./routes/index.ts";
import { logger } from "./utils/logger.ts";

dotenv.config();

export const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.options("*", optionsHandler);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use((req, _res, next) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);
