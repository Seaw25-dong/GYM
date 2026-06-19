import express from "express";

import { requireAuth } from "../middleware/requireAuth.js";
import GeneratedPlan from "../models/GeneratedPlan.js";
import Profile from "../models/Profile.js";
import ProgressEntry from "../models/ProgressEntry.js";
import NutritionLog from "../models/NutritionLog.js";
import WorkoutLog from "../models/WorkoutLog.js";
import { generateAiPlan } from "../services/aiPlan.service.js";
import { calculateFitnessPlan } from "../services/fitness.service.js";
import { createHttpError } from "../utils/httpError.js";

const router = express.Router();

router.use(requireAuth);

router.get("/plans/current", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      res.json({
        success: true,
        data: { profile: null, calculatedPlan: null, generatedPlan: null },
      });
      return;
    }

    const savedPlan = await GeneratedPlan.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    const isPlanCurrent = Boolean(
      savedPlan && savedPlan.createdAt.getTime() >= profile.updatedAt.getTime()
    );
    res.json({
      success: true,
      data: {
        profile,
        calculatedPlan: isPlanCurrent ? savedPlan.calculatedPlan : calculateFitnessPlan(profile),
        generatedPlan: isPlanCurrent ? savedPlan.generatedPlan : null,
        planMeta: isPlanCurrent
          ? { provider: savedPlan.provider, model: savedPlan.model, createdAt: savedPlan.createdAt }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/plans/generate", async (req, res, next) => {
  try {
    const normalizedProfile = normalizeProfilePayload(req.body.profile || req.body);
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        ...normalizedProfile,
        user: req.user._id,
        displayName: req.user.username || normalizedProfile.displayName,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    const calculatedPlan = calculateFitnessPlan(profile);
    const aiResult = await generateAiPlan({ profile, calculatedPlan });
    const savedPlan = await GeneratedPlan.create({
      user: req.user._id,
      profile: profile._id,
      provider: "openai",
      model: aiResult.model,
      calculatedPlan,
      generatedPlan: aiResult.plan,
    });

    res.status(201).json({
      success: true,
      data: {
        profile,
        calculatedPlan,
        generatedPlan: aiResult.plan,
        savedPlan,
        provider: "openai",
        model: aiResult.model,
        responseId: aiResult.rawResponseId,
      },
    });
  } catch (error) {
    next(formatMongooseError(error));
  }
});

router.post("/plans/adjust", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) throw createHttpError(404, "Chưa có profile");
    const [progress, workouts, nutrition] = await Promise.all([
      ProgressEntry.find({ user: req.user._id }).sort({ date: -1 }).limit(14).lean(),
      WorkoutLog.find({ user: req.user._id }).sort({ scheduledDate: -1 }).limit(14).lean(),
      NutritionLog.find({ user: req.user._id }).sort({ date: -1 }).limit(14).lean(),
    ]);
    const calculatedPlan = calculateFitnessPlan(profile);
    const aiResult = await generateAiPlan({ profile, calculatedPlan, history: { progress, workouts, nutrition }, adjustmentMode: true });
    const savedPlan = await GeneratedPlan.create({ user: req.user._id, profile: profile._id, provider: "openai", model: aiResult.model, calculatedPlan, generatedPlan: aiResult.plan });
    res.status(201).json({ success: true, data: { generatedPlan: aiResult.plan, savedPlan } });
  } catch (error) { next(error); }
});

router.get("/plans/:profileId/latest", async (req, res, next) => {
  try {
    const generatedPlan = await GeneratedPlan.findOne({
      profile: req.params.profileId,
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (!generatedPlan) {
      throw createHttpError(404, "Generated plan not found");
    }

    res.json({ success: true, data: generatedPlan });
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
    return createHttpError(400, "Invalid payload", details);
  }

  return error;
}

export default router;
