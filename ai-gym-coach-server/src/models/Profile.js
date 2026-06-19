import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      trim: true,
      default: "Athlete",
    },
    age: {
      type: Number,
      min: 13,
      max: 100,
      required: true,
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    height: {
      type: Number,
      min: 100,
      max: 250,
      required: true,
    },
    weight: {
      type: Number,
      min: 30,
      max: 300,
      required: true,
    },
    bodyFat: {
      type: Number,
      min: 3,
      max: 70,
      default: null,
    },
    activity: {
      type: String,
      enum: ["sedentary", "light", "moderate", "very"],
      required: true,
    },
    gymDays: {
      type: Number,
      min: 0,
      max: 7,
      required: true,
    },
    sportDays: {
      type: Number,
      min: 0,
      max: 7,
      required: true,
    },
    experience: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    goal: {
      type: String,
      enum: ["fat_loss", "muscle_gain", "recomp"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
