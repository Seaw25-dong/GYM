import mongoose from "mongoose";

const generatedPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      index: true,
      default: null,
    },
    provider: {
      type: String,
      default: "openai",
    },
    model: {
      type: String,
      required: true,
    },
    calculatedPlan: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    generatedPlan: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const GeneratedPlan = mongoose.model("GeneratedPlan", generatedPlanSchema);

export default GeneratedPlan;
