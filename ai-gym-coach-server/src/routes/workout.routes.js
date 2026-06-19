import express from "express";

import Profile from "../models/Profile.js";
import WorkoutLog from "../models/WorkoutLog.js";
import { createHttpError } from "../utils/httpError.js";

const router = express.Router();

router.get("/:profileId/logs", async (req, res, next) => {
  try {
    const logs = await WorkoutLog.find({ profile: req.params.profileId }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
});

router.post("/:profileId/logs", async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.profileId);

    if (!profile) {
      throw createHttpError(404, "Profile not found");
    }

    const log = await WorkoutLog.create({
      profile: profile._id,
      workoutName: req.body.workoutName,
      notes: req.body.notes || "",
      sets: normalizeSets(req.body.sets || []),
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(formatMongooseError(error));
  }
});

function normalizeSets(sets) {
  return sets.map((set) => ({
    exerciseName: set.exerciseName,
    weight: Number(set.weight),
    reps: Number(set.reps),
    completedAt: set.completedAt ? new Date(set.completedAt) : new Date(),
  }));
}

function formatMongooseError(error) {
  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((item) => item.message);
    return createHttpError(400, "Invalid workout log payload", details);
  }

  return error;
}

export default router;
