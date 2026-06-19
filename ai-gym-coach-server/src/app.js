import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import aiRoutes from "./routes/ai.routes.js";
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";
import planRoutes from "./routes/plan.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/tracking", trackingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
