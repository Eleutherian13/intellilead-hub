import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import config from "./config/config.js";
import { swaggerSpec } from "./config/swagger.js";
import logger from "./utils/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import { sanitize } from "./middleware/validation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import healthRoutes from "./routes/health.js";
import leadRoutes from "./routes/leads.js";
import companyRoutes from "./routes/companies.js";
import sourceRoutes from "./routes/sources.js";
import notificationRoutes from "./routes/notifications.js";
import dashboardRoutes from "./routes/dashboard.js";
import analyticsRoutes from "./routes/analytics.js";

// Services
import { startCrawlScheduler } from "./jobs/crawlScheduler.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);
const PORT = config.port;

// Socket.io setup
const io = new SocketIOServer(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  socket.on("join", (userId) => {
    socket.join(`user:${userId}`);
    logger.info(`User ${userId} joined room`);
  });
  socket.on("disconnect", () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io accessible in routes
app.set("io", io);

// ─── Middleware ──────────────────────────────────────────────
// Security
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:8080",
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Security - NoSQL injection protection
app.use(mongoSanitize());
app.use(sanitize);

// Compression
app.use(compression());

// Logging
app.use(morgan("combined", { stream: logger.stream }));

// Serve static files (production build)
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientPath));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// ─── API Documentation ──────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ─── API Routes ─────────────────────────────────────────────
/**
 * @swagger
 * /api:
 *   get:
 *     summary: API information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API information
 */
app.get("/api", (req, res) => {
  res.json({
    message: "IntelliLead Hub API is running",
    version: "1.0.0",
    environment: config.nodeEnv,
    documentation: "/api-docs",
    endpoints: [
      "GET  /api/health",
      "GET  /api/dashboard",
      "GET  /api/leads",
      "GET  /api/companies",
      "GET  /api/sources",
      "GET  /api/notifications",
      "GET  /api/analytics",
    ],
  });
});

app.use("/api", healthRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/sources", sourceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);

// Serve client in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
  });
}

// Error handler
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────
const server = httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  logger.info(`❤️  Health Check: http://localhost:${PORT}/api/health`);

  // Start crawl scheduler in production / when DB is available
  if (config.nodeEnv !== "test") {
    try {
      startCrawlScheduler();
      logger.info("⏰ Crawl scheduler started");
    } catch (e) {
      logger.warn("Crawl scheduler not started:", e.message);
    }
  }
});

// ─── Graceful Shutdown ──────────────────────────────────────
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      // Close database connection
      await mongoose.connection.close();
      logger.info("Database connection closed");

      // Close Socket.IO connections
      io.close(() => {
        logger.info("Socket.IO closed");
      });

      logger.info("Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown:", error);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});
