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
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    scheduledDate: {
      type: String,
      trim: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    sessionIndex: {
      type: Number,
      min: 0,
      default: 0,
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
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    sets: {
      type: [setSchema],
      default: [],
    },
    exercises: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

workoutLogSchema.index(
  { user: 1, scheduledDate: 1 },
  { unique: true, partialFilterExpression: { user: { $exists: true } } }
);

const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);

export default WorkoutLog;
