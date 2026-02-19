const express = require("express");
const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/me", auth, requireRole("coach"), (req, res) => {
  res.json({ message: "Coach route ok", user: req.user });
});
router.get("/clients", auth, requireRole("coach"), async (req, res) => {
  try {
    const clients = await User.find({
      role: "client",
      coach: req.user.userId,
    }).select("_id email role createdAt");

    res.json({ clients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
// Create a client
router.post("/create-client", auth, requireRole("coach"), async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await User.create({
      email,
      password: hashedPassword,
      role: "client",
      coach: req.user.userId,
    });

    res.status(201).json({
      message: "Client created",
      clientId: client._id,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});