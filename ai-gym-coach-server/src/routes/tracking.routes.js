import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import NutritionLog from "../models/NutritionLog.js";
import ProgressEntry from "../models/ProgressEntry.js";
import WorkoutLog from "../models/WorkoutLog.js";
import { createHttpError } from "../utils/httpError.js";

const router = express.Router();
router.use(requireAuth);

router.get("/progress", async (req, res, next) => {
  try {
    const entries = await ProgressEntry.find({ user: req.user._id }).sort({ date: 1 });
    const workouts = await WorkoutLog.find({ user: req.user._id, completed: true }).sort({ scheduledDate: 1 });
    const prs = {};
    workouts.forEach((log) => log.sets.forEach((set) => {
      const estimated1Rm = Math.round(set.weight * (1 + set.reps / 30) * 10) / 10;
      prs[set.exerciseName] = Math.max(prs[set.exerciseName] || 0, estimated1Rm);
    }));
    res.json({ success: true, data: { entries, prs } });
  } catch (error) { next(error); }
});

router.put("/progress/:date", async (req, res, next) => {
  try {
    validateDate(req.params.date);
    const payload = normalizeProgress(req.body);
    const entry = await ProgressEntry.findOneAndUpdate(
      { user: req.user._id, date: req.params.date },
      { ...payload, user: req.user._id, date: req.params.date },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, data: entry });
  } catch (error) { next(error); }
});

router.get("/nutrition/:date", async (req, res, next) => {
  try { validateDate(req.params.date); const log = await NutritionLog.findOne({ user: req.user._id, date: req.params.date }); res.json({ success: true, data: log || { date: req.params.date, meals: [] } }); }
  catch (error) { next(error); }
});

router.put("/nutrition/:date", async (req, res, next) => {
  try {
    validateDate(req.params.date);
    const log = await NutritionLog.findOneAndUpdate(
      { user: req.user._id, date: req.params.date },
      { user: req.user._id, date: req.params.date, meals: req.body.meals || [] },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, data: log });
  } catch (error) { next(error); }
});

function validateDate(date) { if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw createHttpError(400, "Ngày không hợp lệ"); }
function normalizeProgress(body) {
  const nullable = (value) => value === "" || value == null ? null : Number(value);
  const photoUrl = String(body.photoUrl || "");
  if (photoUrl.length > 900000) throw createHttpError(400, "Ảnh vượt quá giới hạn");
  return { weight: Number(body.weight), bodyFat: nullable(body.bodyFat), waist: nullable(body.waist), chest: nullable(body.chest), arm: nullable(body.arm), thigh: nullable(body.thigh), photoUrl, notes: String(body.notes || "") };
}
export default router;
