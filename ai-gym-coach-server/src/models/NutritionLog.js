import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  grams: { type: Number, min: 0, required: true },
  calories: { type: Number, min: 0, default: 0 },
  protein: { type: Number, min: 0, default: 0 },
}, { _id: false });
const mealSchema = new mongoose.Schema({
  mealIndex: { type: Number, required: true, min: 0 },
  name: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  foods: { type: [foodSchema], default: [] },
}, { _id: false });
const nutritionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  meals: { type: [mealSchema], default: [] },
}, { timestamps: true, versionKey: false });
nutritionLogSchema.index({ user: 1, date: 1 }, { unique: true });
export default mongoose.model("NutritionLog", nutritionLogSchema);
