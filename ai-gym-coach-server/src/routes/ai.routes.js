import express from "express";

import GeneratedPlan from "../models/GeneratedPlan.js";
import Profile from "../models/Profile.js";
import { generateAiPlan } from "../services/aiPlan.service.js";
import { calculateFitnessPlan } from "../services/fitness.service.js";
import { createHttpError } from "../utils/httpError.js";

const router = express.Router();

router.post("/plans/generate", async (req, res, next) => {
  try {
    const { profileId, profile: profilePayload, saveProfile = false } = req.body;
    let profile = null;

    if (profileId) {
      profile = await Profile.findById(profileId);

      if (!profile) {
        throw createHttpError(404, "Profile not found");
      }
    } else if (saveProfile) {
      profile = await Profile.create(normalizeProfilePayload(profilePayload || req.body));
    } else {
      profile = normalizeProfilePayload(profilePayload || req.body);
    }

    const calculatedPlan = calculateFitnessPlan(profile);
    const aiResult = await generateAiPlan({ profile, calculatedPlan });
    let savedPlan = null;

    if (profile?._id) {
      savedPlan = await GeneratedPlan.create({
        profile: profile._id,
        provider: "openai",
        model: aiResult.model,
        calculatedPlan,
        generatedPlan: aiResult.plan,
      });
    }

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

router.get("/plans/:profileId/latest", async (req, res, next) => {
  try {
    const generatedPlan = await GeneratedPlan.findOne({
      profile: req.params.profileId,
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
