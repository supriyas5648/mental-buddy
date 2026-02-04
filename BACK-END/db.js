
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mentalBuddyUser:97141Supriya%40@mental-buddy-cluster.vx6xyvq.mongodb.net/?appName=mental-buddy-cluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//----->ytest connection to DB<------//
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

//----->export the DB connection<------//
let db;
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("mentalBuddyDB"); // your database name
    console.log("MongoDB connected");
  }
  return db; //reuse connection
}

function getDB() {
  return client.db("mentalBuddyDB");
}

module.exports = {connectDB, getDB }; // i am allowing other files to use these functions
