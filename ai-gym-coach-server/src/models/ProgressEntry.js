import mongoose from "mongoose";

const progressEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  weight: { type: Number, min: 20, max: 400, required: true },
  bodyFat: { type: Number, min: 2, max: 80, default: null },
  waist: { type: Number, min: 20, max: 300, default: null },
  chest: { type: Number, min: 20, max: 300, default: null },
  arm: { type: Number, min: 10, max: 150, default: null },
  thigh: { type: Number, min: 10, max: 200, default: null },
  photoUrl: { type: String, default: "" },
  notes: { type: String, trim: true, maxlength: 1000, default: "" },
}, { timestamps: true, versionKey: false });

progressEntrySchema.index({ user: 1, date: 1 }, { unique: true });
export default mongoose.model("ProgressEntry", progressEntrySchema);
