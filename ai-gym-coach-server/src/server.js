import dotenv from "dotenv";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { getJwtSecret } from "./middleware/requireAuth.js";

dotenv.config();

const port = process.env.PORT || 4000;

async function startServer() {
  await connectDatabase(process.env.MONGODB_URI);
  const httpServer = createServer(app);
  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
  const io = new Server(httpServer, {
    cors: { origin: allowedOrigins, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const payload = jwt.verify(socket.handshake.auth?.token || "", getJwtSecret());
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error("Authentication required"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.data.userId}`);
  });

  app.set("io", io);

  httpServer.listen(port, () => {
    console.log(`AI Gym Coach API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

function normalizeOrigin(value) {
  const origin = String(value || "").trim();
  if (!origin) return "";

  try {
    return new URL(origin).origin;
  } catch {
    return origin.replace(/\/+$/, "");
  }
}
