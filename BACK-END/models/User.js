//this is a Node.js module that handles user management in a database 

const bcrypt = require("bcrypt");
//bcrypt is a library to help you hash passwords.
//- This ensures passwords are not stored in plain text, which is critical for security.

//will make this modules available to other files
module.exports = {
  async create(db, user) {
    user.password = await bcrypt.hash(user.password, 10);
    return db.collection("users").insertOne(user);
  },

  async findByEmail(db, email) {
    return db.collection("users").findOne({ email });
  }
};
