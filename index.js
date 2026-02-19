const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

//MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));


app.get("/", (req, res) => res.send("Coaching API running"));

// Routes
const dashboardRoute = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoute);

const healthRoute = require("./routes/health");
app.use("/api/health", healthRoute);

const coachRoutes = require("./routes/coach");
app.use("/api/coach", coachRoutes);

const clientRoutes = require("./routes/client");
app.use("/api/client", clientRoutes);

const workoutRoutes = require("./routes/workouts");
app.use("/api/workouts", workoutRoutes);


const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on http://localhost:5000");

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

});
