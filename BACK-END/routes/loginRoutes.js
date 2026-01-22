const express = require("express");
const router = express.Router();
const connectDB = require("../db");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await connectDB();
    const profiles = db.collection("profiles");

    const user = await profiles.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      email: user.email
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
