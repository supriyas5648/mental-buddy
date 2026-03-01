//this is a Node.js module that handles user profiles in a database 

const { ObjectId } = require("mongodb");

//will make this modules available to other files
module.exports = {
  async create(db, userId, profileData = {}) {
    // Create a new profile with user ID and basic information
    const profile = {
      userId: new ObjectId(userId),
      name: profileData.name || "",
      bio: profileData.bio || "",
      age: profileData.age || null,
      location: profileData.location || "",
      avatar: profileData.avatar || "",
      preferences: profileData.preferences || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return db.collection("profiles").insertOne(profile);
  },

  async findByUserId(db, userId) {
    return db.collection("profiles").findOne({ userId: new ObjectId(userId) });
  },

  async update(db, userId, updateData) {
    updateData.updatedAt = new Date();
    return db.collection("profiles").updateOne(
      { userId: new ObjectId(userId) },
      { $set: updateData },
      { upsert: true }
    );
  }
};
