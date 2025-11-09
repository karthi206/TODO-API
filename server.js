// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables early

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

// ✅ Root route (for Render homepage)
app.get("/", (req, res) => {
  res.send("✅ To-Do API is live and running successfully on Render!");
});

// ✅ Determine MongoDB URI
const MONGO_URI =
  process.env.MONGO_URI || process.env.MONGO_URL || process.env.DATABASE_URL;

if (!MONGO_URI || typeof MONGO_URI !== "string") {
  console.error(
    "❌ Missing or invalid MongoDB URI. Set MONGO_URI in .env or environment variable."
  );
  process.exit(1); // Stop the server if DB URI is missing
}

// ✅ Connect to MongoDB and start the server
mongoose
  .connect(String(MONGO_URI), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
