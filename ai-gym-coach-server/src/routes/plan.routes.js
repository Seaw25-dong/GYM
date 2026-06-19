import express from "express";

import Profile from "../models/Profile.js";
import { calculateFitnessPlan } from "../services/fitness.service.js";
import { createHttpError } from "../utils/httpError.js";

const router = express.Router();

router.post("/calculate", (req, res, next) => {
  try {
    const plan = calculateFitnessPlan(req.body);
    res.json({ success: true, data: { plan } });
  } catch (error) {
    next(error);
  }
});

router.get("/:profileId", async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.profileId);

    if (!profile) {
      throw createHttpError(404, "Profile not found");
    }

    res.json({
      success: true,
      data: {
        profile,
        plan: calculateFitnessPlan(profile),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:profileId/nutrition", async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.profileId);

    if (!profile) {
      throw createHttpError(404, "Profile not found");
    }

    const plan = calculateFitnessPlan(profile);

    res.json({
      success: true,
      data: {
        targetCalories: plan.targetCalories,
        macros: plan.macros,
        mealPlan: plan.mealPlan,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:profileId/workouts", async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.profileId);

    if (!profile) {
      throw createHttpError(404, "Profile not found");
    }

    const plan = calculateFitnessPlan(profile);

    res.json({
      success: true,
      data: {
        workoutSplit: plan.workoutSplit,
        workouts: plan.workouts,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
