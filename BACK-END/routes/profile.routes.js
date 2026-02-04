const express = require("express");
const connectDB = require("../db");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const db = await connectDB();
  const profile = await db.collection("profiles").findOne({ userId: req.user.userId });
  res.json(profile || {});
});

router.post("/", auth, async (req, res) => {
  const db = await connectDB();
  await db.collection("profiles").updateOne(
    { userId: req.user.userId },
    { $set: req.body },
    { upsert: true }
  );
  res.json({ msg: "Profile saved" });
});

module.exports = router;
