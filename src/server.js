import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5500")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include health checks and server-to-server calls.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ClassPilot AI Backend"
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ClassPilot backend is running",
    data: {
      service: "classpilot-backend",
      status: "ok"
    }
  });
});

// Readiness is separate from liveness: it verifies the configured database connection.
app.get("/api/health/ready", async (req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({
      success: false,
      message: "Database is not configured"
    });
  }

  try {
    await prisma.$queryRaw\`SELECT 1\`;
    return res.status(200).json({
      success: true,
      message: "Backend and database are ready"
    });
  } catch (error) {
    console.error("Database readiness check failed:", error.message);
    return res.status(503).json({
      success: false,
      message: "Database is unavailable"
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err.message === "Origin is not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Request origin is not allowed"
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body"
    });
  }

  console.error("Server error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

const PORT = Number(process.env.PORT) || 3000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`ClassPilot backend running on port ${PORT}`);
});

async function shutdown(signal) {
  console.log(`Received ${signal}; shutting down gracefully`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
