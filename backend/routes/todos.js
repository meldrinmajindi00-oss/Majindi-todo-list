const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();

// READ - Get all to-do items
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Failed to load to-dos." });
  }
});

// CREATE - Add a new to-do item
router.post("/", async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const todo = await Todo.create({ title });
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE - Edit title and/or completed status
router.patch("/:id", async (req, res) => {
  try {
    const update = {};

    if (typeof req.body.title === "string") {
      const title = req.body.title.trim();
      if (!title) {
        return res.status(400).json({ message: "Title cannot be empty." });
      }
      update.title = title;
    }

    if (typeof req.body.completed === "boolean") {
      update.completed = req.body.completed;
    }

    const todo = await Todo.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: "Failed to update to-do." });
  }
});

// DELETE - Remove a to-do item
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    res.json({ message: "Todo deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete to-do." });
  }
});

module.exports = router;
