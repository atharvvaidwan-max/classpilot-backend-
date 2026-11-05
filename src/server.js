
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5500",
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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ClassPilot backend running on port ${PORT}`);
});
