const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables as early as possible
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);


// Determine MongoDB URI from common env names
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || process.env.DATABASE_URL;

// Log the resolved value for debugging (do not log in production)
console.log("Resolved MONGO_URI:", typeof MONGO_URI === 'string' ? MONGO_URI : MONGO_URI);

if (!MONGO_URI || typeof MONGO_URI !== "string") {
  console.error("❌ Missing or invalid MongoDB URI. Set MONGO_URI in .env or as an environment variable.");
  // Exit with non-zero code so process managers know it failed
  process.exit(1);
}

// Connect to MongoDB, then start the server only after successful connection
mongoose
  .connect(String(MONGO_URI), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });
