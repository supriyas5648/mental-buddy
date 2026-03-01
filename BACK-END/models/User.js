//this is a Node.js module that handles user management in a database 

const bcrypt = require("bcrypt");
//bcrypt is a library to help you hash passwords.
//- This ensures passwords are not stored in plain text, which is critical for security.

//will make this modules available to other files
module.exports = {
  async create(db, user) {
    // Validate required fields (password is optional if googleId is provided)
    if (!user.name || !user.email || (!user.password && !user.googleId)) {
      throw new Error("Name, email and either password or googleId are required");
    }

    // Hash password if present
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    // Set created date
    user.createdAt = new Date();

    return db.collection("users").insertOne(user);
  },

  async findByEmail(db, email) {
    return db.collection("users").findOne({ email });
  },

  async findByGoogleId(db, googleId) {
    return db.collection("users").findOne({ googleId });
  },

  // Find user by ID
  async findById(db, userId) {
    const { ObjectId } = require("mongodb");
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }
};
