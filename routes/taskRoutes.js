const express = require("express");
const router = express.Router();
// require model using the actual file name to avoid case-sensitivity issues on some OSes
const Task = require("../models/task");

// ✅ Get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// ✅ Get task by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Task ID missing" });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error("❌ Get by ID Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ➕ Add new task
router.post("/", async (req, res) => {
  try {
    const { title, completed } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const newTask = new Task({ title, completed });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("❌ Create Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✏️ Update a task by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    if (!id) return res.status(400).json({ message: "Task ID missing" });

    const update = {};
    if (typeof title !== 'undefined') update.title = title;
    if (typeof completed !== 'undefined') update.completed = completed;

    if (Object.keys(update).length === 0)
      return res.status(400).json({ message: "No valid fields to update" });

    const updatedTask = await Task.findByIdAndUpdate(id, update, { new: true });

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    res.json(updatedTask);
  } catch (err) {
    console.error("❌ Update Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Allow update via body when client sends { id, completed }
// This prevents a 404 when clients send JSON but forget to include the id in the URL
router.put("/", async (req, res) => {
  try {
    const { id, completed } = req.body;
    const { title } = req.body;

    if (!id) return res.status(400).json({ message: "Task ID missing in body" });

    const update = {};
    if (typeof title !== 'undefined') update.title = title;
    if (typeof completed !== 'undefined') update.completed = completed;

    if (Object.keys(update).length === 0)
      return res.status(400).json({ message: "No valid fields to update" });

    const updatedTask = await Task.findByIdAndUpdate(id, update, { new: true });

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    res.json(updatedTask);
  } catch (err) {
    console.error("❌ Update (body) Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ❌ Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Task ID missing" });

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
