import mongoose from "mongoose";

const setSchema = new mongoose.Schema(
  {
    exerciseName: {
      type: String,
      trim: true,
      required: true,
    },
    weight: {
      type: Number,
      min: 0,
      required: true,
    },
    reps: {
      type: Number,
      min: 1,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const workoutLogSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      index: true,
    },
    workoutName: {
      type: String,
      trim: true,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    sets: {
      type: [setSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);

export default WorkoutLog;
