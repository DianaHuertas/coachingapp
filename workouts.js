const express = require("express");
const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const WorkoutTemplate = require("../models/WorkoutTemplate");
const AssignedWorkout = require("../models/AssignedWorkout");
const User = require("../models/User");

const router = express.Router();

// Coach: create template
router.post("/templates", auth, requireRole("coach"), async (req, res) => {
  try {
    const { title, exercises } = req.body;

    const template = await WorkoutTemplate.create({
      coach: req.user.userId,
      title,
      exercises: exercises || [],
    });

    res.status(201).json({ template });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Coach: list my templates
router.get("/templates", auth, requireRole("coach"), async (req, res) => {
  const templates = await WorkoutTemplate.find({ coach: req.user.userId }).sort({ createdAt: -1 });
  res.json({ templates });
});

// Coach: assign template to client for date
router.post("/assign", auth, requireRole("coach"), async (req, res) => {
  try {
    const { clientId, templateId, date } = req.body;

    // verify client belongs to coach
    const client = await User.findOne({ _id: clientId, role: "client", coach: req.user.userId });
    if (!client) return res.status(403).json({ error: "Client not found for this coach" });

    const assigned = await AssignedWorkout.create({
      coach: req.user.userId,
      client: clientId,
      template: templateId,
      date,
    });

    res.status(201).json({ assigned });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
