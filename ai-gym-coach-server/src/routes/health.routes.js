import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

export default router;
