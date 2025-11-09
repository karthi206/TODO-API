const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("✅ To-Do API is live and running successfully on Render!");
});

// Routes
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI || process.env.MONGO_URL || process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.error("❌ MongoDB URI missing!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT} (Render Ready)`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
