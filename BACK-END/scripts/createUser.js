console.log("🚀 createUser.js started");

const { connectDB } = require("../db");
const User = require("../models/User");

console.log("User module:", User);

async function createUser() {
  try {
    const db = await connectDB();

    const user = {
      email: "test@test.com",
      password: "123456" // plain password (hashed inside model)
    };

    await User.create(db, user);

    console.log("✅ Test user created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating user:", err);
    process.exit(1);
  }
}

createUser();
