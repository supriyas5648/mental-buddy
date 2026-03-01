const express = require("express");
const { connectDB } = require("../db");
const auth = require("../middleware/auth.middleware");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const db = await connectDB();
    const userId = new ObjectId(req.user.userId);
    const profile = await db.collection("profiles").findOne({ userId });
    res.json(profile || {});
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ msg: "Error fetching profile" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const db = await connectDB();
    const userId = new ObjectId(req.user.userId);
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await db.collection("profiles").updateOne(
      { userId },
      { $set: updateData },
      { upsert: true }
    );
    res.json({ msg: "Profile saved" });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ msg: "Error updating profile" });
  }
});

module.exports = router;
