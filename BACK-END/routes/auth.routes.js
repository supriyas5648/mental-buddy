const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connectDB, getDB } = require("../db");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  const db = await connectDB();
  const { email, password } = req.body;

  console.log("EMAIL:", email);
  console.log("password", password);
  
  const user = await User.findByEmail(db, email);
  if (!user) return res.status(401).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("PASSWORD MATCH:", isMatch);
  if (!isMatch) return res.status(401).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { userId: user._id },
   "MENTAL_BUDDY_SECRET_KEY",
    { expiresIn: "1d" }
  );

  res.json({ token });
});

module.exports = router;
