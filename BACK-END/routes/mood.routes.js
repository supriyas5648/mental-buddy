const express = require("express");
const { connectDB } = require("../db");
const authMiddleware = require("../middleware/auth.middleware");
const Mood = require("../models/Mood");

const router = express.Router();

// GET /api/mood/today - Get today's mood (MUST be before generic GET route)
router.get("/today", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = await connectDB();
    const todayMood = await Mood.getMoodByDate(db, userId, new Date());

    if (todayMood) {
      res.json({ data: todayMood });
    } else {
      res.json({ data: null });
    }
  } catch (error) {
    console.error("Error fetching today's mood:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST /api/mood - Save or update today's mood
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { mood, note } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!mood) {
      return res.status(400).json({ msg: "Mood is required" });
    }

    const validMoods = ["happy", "sad", "anxious", "calm", "angry"];
    if (!validMoods.includes(mood.toLowerCase())) {
      return res.status(400).json({ msg: "Invalid mood value" });
    }

    const db = await connectDB();
    const result = await Mood.saveMood(db, userId, {
      mood: mood.toLowerCase(),
      note: note || ""
    });

    res.status(201).json({ msg: "Mood saved successfully", data: result });
  } catch (error) {
    console.error("Error saving mood:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/mood - Get all mood entries for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = await connectDB();
    const moods = await Mood.getMoodsByUser(db, userId);

    res.json({ data: moods });
  } catch (error) {
    console.error("Error fetching moods:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
