import express from "express";

import { requireAuth } from "../middleware/requireAuth.js";
import Profile from "../models/Profile.js";
import { calculateFitnessPlan } from "../services/fitness.service.js";
import { createHttpError } from "../utils/httpError.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const profiles = await Profile.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: profiles });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = normalizeProfilePayload(req.body);
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { ...payload, user: req.user._id },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    const plan = calculateFitnessPlan(profile);

    res.status(201).json({ success: true, data: { profile, plan } });
  } catch (error) {
    next(formatMongooseError(error));
  }
});

router.get("/:profileId", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.profileId, user: req.user._id });

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

router.put("/:profileId", async (req, res, next) => {
  try {
    const payload = normalizeProfilePayload(req.body);
    const profile = await Profile.findOneAndUpdate({ _id: req.params.profileId, user: req.user._id }, payload, {
      new: true,
      runValidators: true,
    });

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
    next(formatMongooseError(error));
  }
});

router.delete("/:profileId", async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndDelete({ _id: req.params.profileId, user: req.user._id });

    if (!profile) {
      throw createHttpError(404, "Profile not found");
    }

    res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    next(error);
  }
});

function normalizeProfilePayload(payload) {
  return {
    displayName: payload.displayName || "Athlete",
    age: Number(payload.age),
    sex: payload.sex,
    height: Number(payload.height),
    weight: Number(payload.weight),
    bodyFat: payload.bodyFat === "" || payload.bodyFat == null ? null : Number(payload.bodyFat),
    activity: payload.activity,
    gymDays: Number(payload.gymDays),
    trainingDays: Array.isArray(payload.trainingDays) ? payload.trainingDays.map(Number) : [],
    sportDays: Number(payload.sportDays),
    experience: payload.experience,
    goal: payload.goal,
  };
}

function formatMongooseError(error) {
  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((item) => item.message);
    return createHttpError(400, "Invalid profile payload", details);
  }

  return error;
}

export default router;
