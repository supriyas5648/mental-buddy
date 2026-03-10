// // insertProfile();

// console.log("PROFILE FILE STARTED");
// const connectDB = require("./db");

// const { MongoClient } = require("mongodb");

// const uri = "mongodb+srv://mentalBuddyUser:97141Supriya%40@mental-buddy-cluster.vx6xyvq.mongodb.net/?appName=mental-buddy-cluster";

// async function run() {
//   console.log("RUN STARTED");

//   const client = new MongoClient(uri);
//   await client.connect();

//   console.log("CONNECTED TO DB");

//   const db = client.db("mentalBuddyDB");
//   const profiles = db.collection("profiles");

//   const result = await profiles.insertOne({
//     name: "Test User",
//     mood: "neutral",
//     createdAt: new Date()
//   });

//   console.log("PROFILE STORED:", result.insertedId);

//   await client.close();
// }

// run().catch(console.error);
const connectDB = require("./db"); //getting connectDB function from db.js

async function storeProfile() {
  const db = await connectDB(); //connectDb fnc is in db.js
  const profiles = db.collection("profiles");//profile naam ki collection use krna hai

  const result = await profiles.insertOne({ //entry add krna hai
    name: "Test User",
    mood: "neutral",
    createdAt: new Date()
  });

  console.log("PROFILE STORED:", result.insertedId);
}

storeProfile().catch(console.error);
