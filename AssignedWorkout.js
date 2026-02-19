const mongoose = require("mongoose");

const assignedWorkoutSchema = new mongoose.Schema(
  {
    coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    template: { type: mongoose.Schema.Types.ObjectId, ref: "WorkoutTemplate", required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    
    status: { 
        type: String, 
        enum: ["assigned","in_progress", "completed"], 
        default: "assigned" 
    },

    clientNotes: { type: String, default: "" },
    rating:{
        type: Number,
        min: 1,
        max: 5          
    },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignedWorkout", assignedWorkoutSchema);
