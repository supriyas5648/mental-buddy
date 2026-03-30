// homepage now fetches profile preferences on mount
// the buddy selection determines which asset (female-frnd/male-frnd)
// is displayed in the hero section instead of the static avatar
import "../styles/homepage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/app_logo.jpg";
import femaleBuddy from "../assets/female-frnd.png";
import maleBuddy from "../assets/male-frnd.png";
import { Link, useNavigate } from "react-router-dom";

// const API_BASE_URL = "https://mental-buddy-st06.onrender.com/api";
const API_BASE_URL = import.meta.env.VITE_API_URL;

function Home() {
  const navigate = useNavigate();
  const [buddyImg, setBuddyImg] = useState(femaleBuddy);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const pref = res.data.preferences;
        if (pref && pref.buddy === "male") {
          setBuddyImg(maleBuddy);
        } else {
          setBuddyImg(femaleBuddy);
        }
      } catch (err) {
        console.error("Failed to load profile in Home:", err);
      }
    };
    loadProfile();
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Mental Buddy Logo" />
        </div>

        {/* 🔧 CHANGED: wrapped nav in flex container */}
        <nav className="nav-right">
          <Link to="/home">Home</Link>
          <Link to="/progress">Progress</Link>
          <Link to="/depression-test">Depression Test</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/MoodEntry">Mood Entry</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        {/* 🔧 CHANGED: grid container */}
        <div className="hero-grid">
          <div className="hero-left">
            <span className="tag">AI Mental Wellness Companion</span>

            <h1>
              Your Digital <br /> Mental Wellness Buddy
            </h1>

            <p>
              A confidential AI companion to help you reflect, track emotions,
              and build healthier mental habits.
            </p>

            <div className="input-box" onClick={() => navigate('/chat')}>
              <input
                type="text"
                placeholder="Tell me how you're feeling today..."
                readOnly
                style={{ cursor: "pointer" }}
              />
              <button className="mic-btn">🎤</button>
            </div>

            <button className="start-btn" onClick={() => navigate('/chat')}>Talk to Mental Buddy</button>
          </div>

          <div className="hero-right">
            <img src={buddyImg} alt="Mental Buddy Avatar" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
