import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./utils/db.js";
import { initializeSocket } from "./utils/socket.js";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import notificationRoute from "./routes/notification.route.js";

// ===========================
// Load Environment Variables
// ===========================
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.local" });
}

// ===========================
// Debug Environment Variables
// ===========================
console.log("==================================");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("==================================");

const app = express();
const httpServer = createServer(app);

// ===========================
// Initialize Socket.io
// ===========================
const io = initializeSocket(httpServer);

// ===========================
// Middleware
// ===========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===========================
// CORS Configuration
// ===========================
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));

// ===========================
// API Routes
// ===========================
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/notification", notificationRoute);

// ===========================
// Start Server
// ===========================
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected Successfully");

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server + Socket.io running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
