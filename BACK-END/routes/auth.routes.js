const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connectDB, getDB } = require("../db");
const User = require("../models/User");
const Profile = require("../models/Profile");

const router = express.Router();

// ============ SIGNUP ROUTE ============
router.post("/signup", async (req, res) => {
  try {
    const db = await connectDB();
    const { name, email, password, confirmPassword } = req.body;

    // INPUT VALIDATION: Check all required fields are provided
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Validate that passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Please enter a valid email" });
    }

    // CHECK IF EMAIL ALREADY EXISTS
    const existingUser = await User.findByEmail(db, email);
    if (existingUser) {
      return res.status(409).json({ msg: "Email already registered" });
    }

    // CREATE NEW USER WITH HASHED PASSWORD
    const newUser = { name, email, password };
    const result = await User.create(db, newUser);

    // CREATE PROFILE FOR NEW USER
    await Profile.create(db, result.insertedId, { name });

    // GENERATE JWT TOKEN
    const token = jwt.sign(
      { userId: result.insertedId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // SUCCESS RESPONSE
    res.status(201).json({
      msg: "User created successfully",
      token,
      user: { id: result.insertedId, name, email }
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error during signup" });
  }
});

// ============ LOGIN ROUTE ============
router.post("/login", async (req, res) => {
  try {
    const db = await connectDB();
    const { email, password } = req.body;

    // VALIDATION: Check required fields
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // FIND USER BY EMAIL
    const user = await User.findByEmail(db, email);
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("PASSWORD MATCH:", isMatch);
  if (!isMatch) return res.status(401).json({ msg: "Invalid user or wrong password" });

    // GENERATE JWT TOKEN
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // SUCCESS RESPONSE
    res.json({
      msg: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error during login" });
  }
});



// ============ GOOGLE LOGIN ROUTE ============
router.post("/google", async (req, res) => {
  try {
    const db = await connectDB();
    const { name, email, googleId } = req.body;

    if (!email || !googleId || !name) {
      return res.status(400).json({ msg: "Name, email and googleId are required" });
    }

    // try to find existing user by googleId or email
    let user = await User.findByGoogleId(db, googleId);
    if (!user) {
      user = await User.findByEmail(db, email);
    }

    if (user) {
      // existing user, generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.json({ msg: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
    }

    // create new user
    const newUserObj = { name, email, googleId };
    const result = await User.create(db, newUserObj);
    const token = jwt.sign({ userId: result.insertedId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ msg: "User created successfully", token, user: { id: result.insertedId, name, email } });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ msg: "Server error during Google authentication" });
  }
});

module.exports = router;
