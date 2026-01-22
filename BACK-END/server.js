const express = require("express"); //recepsionist framework
const cors = require("cors"); //security for outsider requests

const app = express(); //create my app server
//middleware  
//👉 Rules that run before any request
app.use(cors()); //Allows your frontend (HTML/JS) to talk to backend.
app.use(express.json());//Allows server to read JSON data sent from frontend.

// TEST ROUTE
// app.post("/analyze", (req, res) => { //gives backend the data from frontend and gets a response
//     const text = req.body.text; //get text from frontend

//     let result = "Low stress";  //default result

//     if (text.includes("sad") || text.includes("tired") || text.includes("empty")) {
//         result = "Moderate depression risk";
//     }

//     res.json({
//         mood: result,
//         score: Math.random().toFixed(2)
//     });
// });

//import routes
app.use("/login", loginRoutes);
app.use("/profile", profileRoutes);

app.listen(5000);