//MongoDB Mood model for tracking daily mood entries
const { ObjectId } = require("mongodb");

module.exports = {
  async saveMood(db, userId, moodData) {
    // Get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if mood already exists for today
    const existingMood = await db.collection("moods").findOne({
      userId: new ObjectId(userId),
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingMood) {
      // Update existing mood for today
      await db.collection("moods").updateOne(
        { _id: existingMood._id },
        {
          $set: {
            mood: moodData.mood,
            note: moodData.note || "",
            updatedAt: new Date()
          }
        }
      );
      return { ...existingMood, mood: moodData.mood, note: moodData.note || "" };
    }

    // Create new mood entry for today
    const result = await db.collection("moods").insertOne({
      userId: new ObjectId(userId),
      mood: moodData.mood,
      note: moodData.note || "",
      date: today,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return {
      _id: result.insertedId,
      userId: new ObjectId(userId),
      mood: moodData.mood,
      note: moodData.note || "",
      date: today,
      createdAt: new Date()
    };
  },

  async getMoodsByUser(db, userId) {
    return db.collection("moods")
      .find({ userId: new ObjectId(userId) })
      .sort({ date: 1 }) // ascending order (oldest first)
      .toArray();
  },

  async getMoodByDate(db, userId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return db.collection("moods").findOne({
      userId: new ObjectId(userId),
      date: { $gte: startOfDay, $lte: endOfDay }
    });
  }
};
