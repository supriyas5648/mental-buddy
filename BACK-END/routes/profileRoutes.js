const express = require("express");
const router = express.Router();
const connectDB = require("../db");

router.get("/:email", async (req, res) => {
  try {
    const db = await connectDB();
    const profiles = db.collection("profiles");

    const user = await profiles.findOne({
      email: req.params.email
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
