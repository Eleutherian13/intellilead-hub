import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import connectDB from "./config/db.js";
import config from "./config/config.js";
import errorHandler from "./middleware/errorHandler.js";

// Route imports
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
  console.log("Client connected:", socket.id);
  socket.on("join", (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined room`);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make io accessible in routes
app.set("io", io);

// ─── Middleware ──────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { message: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

// ─── API Routes ─────────────────────────────────────────────
app.get("/api", (req, res) => {
  res.json({
    message: "Lead Intel API is running",
    version: "1.0.0",
    endpoints: [
      "GET  /api/dashboard",
      "GET  /api/leads",
      "GET  /api/companies",
      "GET  /api/sources",
      "GET  /api/notifications",
      "GET  /api/analytics",
    ],
  });
});

app.use("/api/leads", leadRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/sources", sourceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handler
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);

  // Start crawl scheduler in production / when DB is available
  if (config.nodeEnv !== "test") {
    try {
      startCrawlScheduler();
    } catch (e) {
      console.warn("Crawl scheduler not started:", e.message);
    }
  }
});
