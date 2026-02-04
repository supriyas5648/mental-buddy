//this is the main server file for a Node.js application using Express framework
//we need to set up the server, middleware, and routes here


const express = require("express"); //recepsionist framework
const cors = require("cors"); //security for outsider requests


const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");

const app = express(); //create my app server
//middleware  

//👉 Rules that run before any request
app.use(cors()); //Allows your frontend (HTML/JS) to talk to backend.
app.use(express.json());//Allows server to read JSON data sent from frontend.


app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.listen(5000, () => console.log("Server running on 5000"));