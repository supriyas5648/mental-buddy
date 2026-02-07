//this is the main server file for a Node.js application using Express framework
//we need to set up the server, middleware, and routes here

// import dotenv from "dotenv";
// dotenv.config();
// //for Api key

require("dotenv").config(); // Load environment variables
const express = require("express"); //recepsionist framework
const cors = require("cors"); //security for outsider requests


const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express(); //create my app server
//middleware  

//👉 Rules that run before any request
app.use(cors()); //Allows your frontend (HTML/JS) to talk to backend.
app.use(express.json());//Allows server to read JSON data sent from frontend.


app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/chat", chatRoutes);

app.listen(5000, () => console.log("Server running on 5000"));