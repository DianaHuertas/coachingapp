const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Back Squat"
    sets: { type: Number, default: 3 },
    reps: { type: String, default: "8" }, // string so it can be "8-10"
    restSeconds: { type: Number, default: 90 },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const workoutTemplateSchema = new mongoose.Schema(
  {
    coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    exercises: { type: [exerciseSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutTemplate", workoutTemplateSchema);
