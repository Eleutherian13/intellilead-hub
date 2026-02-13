import express from "express";
import mongoose from "mongoose";
import os from "os";

const router = express.Router();

// Basic health check
router.get("/health", async (req, res) => {
  const healthcheck = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  };

  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    healthcheck.database = {
      status: dbState === 1 ? "connected" : "disconnected",
      state: getMongooseState(dbState),
    };

    // Check memory usage
    const memUsage = process.memoryUsage();
    healthcheck.memory = {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
    };

    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.status = "ERROR";
    healthcheck.error = error.message;
    res.status(503).json(healthcheck);
  }
});

// Detailed health check with system info
router.get("/health/detailed", async (req, res) => {
  try {
    const health = {
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "IntelliLead Hub API",
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB`,
        freeMemory: `${Math.round(os.freemem() / 1024 / 1024 / 1024)} GB`,
        uptime: `${Math.round(os.uptime() / 3600)} hours`,
      },

      process: {
        pid: process.pid,
        uptime: `${Math.round(process.uptime())} seconds`,
        nodeVersion: process.version,
        memoryUsage: {
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
        },
      },

      database: {
        status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        state: getMongooseState(mongoose.connection.readyState),
        host: mongoose.connection.host || "unknown",
        name: mongoose.connection.name || "unknown",
      },
    };

    res.status(200).json(health);
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// Readiness probe (for Kubernetes/container orchestration)
router.get("/ready", async (req, res) => {
  try {
    // Check if database is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        ready: false,
        reason: "Database not connected",
      });
    }

    res.status(200).json({
      ready: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      reason: error.message,
    });
  }
});

// Liveness probe (for Kubernetes/container orchestration)
router.get("/live", (req, res) => {
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString(),
  });
});

// Helper function to get mongoose connection state
function getMongooseState(state) {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return states[state] || "unknown";
}

export default router;
