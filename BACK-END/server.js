//this is the main server file for a Node.js application using Express framework
//we need to set up the server, middleware, and routes here


require("dotenv").config(); // Load environment variables
const express = require("express"); //recepsionist framework
const cors = require("cors"); //security for outsider requests
//  console.log("JWT SECRET:", process.env.JWT_SECRET);


const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const chatRoutes = require("./routes/chat.routes");
const moodRoutes = require("./routes/mood.routes");
const depressionRoutes = require("./routes/depression.routes");
const { connectDB } = require("./db");

const app = express(); //create my app server
//middleware  

//👉 Rules that run before any request
app.use(cors()); //Allows your frontend (HTML/JS) to talk to backend.
// app.use(express.json());//Allows server to read JSON data sent from frontend.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/depression", depressionRoutes);

// Connect to MongoDB once before starting the server
(async () => {
	try {
		await connectDB();
		const port = process.env.PORT || 5000;
		app.listen(port, () => console.log(`Server running on ${port}`));
	} catch (err) {
		console.error("Failed to connect to DB, server not started:", err);
		process.exit(1);
	}
})();