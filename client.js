const express = require("express");
const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const AssignedWorkout = require("../models/AssignedWorkout");

const router = express.Router();

// GET all workouts assigned to the logged-in client
router.get("/workouts", auth, requireRole("client"), async (req, res) => {
  try {
    const workouts = await AssignedWorkout.find({ client: req.user.userId })
      .populate("template", "title exercises")
      .sort({ date: 1 });

    res.json({ workouts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Client updates workout status + optional notes
// Example body: { "status": "completed", "clientNotes": "Felt great" }
router.patch("/workouts/:id", auth, requireRole("client"), async (req, res) => {
  try {
    const { status, clientNotes, rating } = req.body;

    const workout = await AssignedWorkout.findOne({
      _id: req.params.id,
      client: req.user.userId,
    });

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    // ✅ update fields if provided
    if (status !== undefined) workout.status = status;
    if (clientNotes !== undefined) workout.clientNotes = clientNotes;
    if (rating !== undefined) workout.rating = rating;

    // ✅ only set completedAt when marking completed
    if (status === "completed") {
      workout.completedAt = new Date();
    }

    await workout.save();

    res.json({
      message: "Workout updated",
      workout,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test route
router.get("/me", auth, requireRole("client"), (req, res) => {
  res.json({ message: "Client route ok", user: req.user });
});

module.exports = router;
