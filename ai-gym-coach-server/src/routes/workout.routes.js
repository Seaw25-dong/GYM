import express from "express";

import { requireAuth } from "../middleware/requireAuth.js";
import WorkoutLog from "../models/WorkoutLog.js";
import { createHttpError } from "../utils/httpError.js";

const router = express.Router();
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

router.use(requireAuth);

router.get("/logs", async (req, res, next) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user._id }).sort({ scheduledDate: 1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
});

router.put("/logs/:scheduledDate", async (req, res, next) => {
  try {
    const { scheduledDate } = req.params;
    if (!datePattern.test(scheduledDate)) {
      throw createHttpError(400, "Ngày tập không hợp lệ");
    }

    const completed = Boolean(req.body.completed);
    const log = await WorkoutLog.findOneAndUpdate(
      { user: req.user._id, scheduledDate },
      {
        user: req.user._id,
        scheduledDate,
        sessionIndex: Math.max(0, Number(req.body.sessionIndex) || 0),
        workoutName: String(req.body.workoutName || "Buổi tập").trim(),
        notes: String(req.body.notes || "").trim(),
        sets: normalizeSets(req.body.sets || []),
        exercises: Array.isArray(req.body.exercises) ? req.body.exercises : [],
        completed,
        completedAt: completed ? new Date() : null,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    req.app.get("io")?.to(`user:${req.user._id}`).emit("workout:updated", log);
    res.json({ success: true, data: log });
  } catch (error) {
    next(formatMongooseError(error));
  }
});

function normalizeSets(sets) {
  return sets.map((set) => ({
    exerciseName: String(set.exerciseName || "").trim(),
    weight: Math.max(0, Number(set.weight) || 0),
    reps: Math.max(1, Number(set.reps) || 1),
    completedAt: set.completedAt ? new Date(set.completedAt) : new Date(),
  }));
}

function formatMongooseError(error) {
  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((item) => item.message);
    return createHttpError(400, "Dữ liệu buổi tập không hợp lệ", details);
  }
  return error;
}

export default router;
