const express = require("express");
const { connectDB } = require("../db");
const authMiddleware = require("../middleware/auth.middleware");
const Mood = require("../models/Mood");
const aiService = require("../services/ai.service");

const router = express.Router();

// POST /api/depression/analyze-text - Analyze text for depression indicators
// requires authentication so we can optionally fetch recent mood entries
router.post("/analyze-text", authMiddleware, async (req, res) => {
  try {
    let { text } = req.body;
    const userId = req.user.userId;
    const db = await connectDB();

    // if no user text supplied, attempt to pull the last 7 mood notes
    if (!text || !text.trim()) {
      const allMoods = await Mood.getMoodsByUser(db, userId);
      const recent = allMoods.slice(-7); // last seven entries
      const notes = recent
        .map((m) => m.note)
        .filter(Boolean)
        .join("\n");

      if (!notes) {
        return res
          .status(400)
          .json({ msg: "No text provided and no recent mood notes available" });
      }

      text = `User did not submit freeform text. Here are their last ${
        recent.length
      } mood notes:\n${notes}`;
    }

    // delegate depression-specific work to ai.service helper
    const analysis = await aiService.analyzeDepression(text);
    res.json(analysis);
  } catch (error) {
    console.error("Error analyzing text:", error);
    res.status(500).json({ msg: "Server error while analyzing text" });
  }
});

module.exports = router;
