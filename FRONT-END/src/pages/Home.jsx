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
import FriendlyButton from "../components/FriendlyButton";

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
        // fallback to default
      }
    };
    loadProfile();
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <header className="navbar" style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px #ffe0ec33" }}>
        <div className="nav-left">
          <img src={logo} alt="Mental Buddy Logo" style={{ borderRadius: 12, boxShadow: "0 2px 8px #ffe0ec33" }} />
        </div>
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
      <section className="hero" style={{ background: "linear-gradient(120deg, #ffe0ec 0%, #e0f7fa 100%)" }}>
        <div className="hero-grid">
          <div className="hero-left">
            <span className="tag" style={{ background: "#ffe0ec", color: "#d72660", borderRadius: 16, padding: "4px 16px", fontWeight: 600 }}>AI Mental Wellness Companion</span>
            <h1 className="friendly" style={{ fontSize: 48, marginBottom: 16, color: "#d72660", lineHeight: 1.1 }}>
              Hey, you’re not alone here.
            </h1>
            <p style={{ maxWidth: 420, marginBottom: 24, color: "#3a3a3a", fontSize: 20 }}>
              This is your safe space to talk, reflect, and feel understood. Your feelings matter. 💛
            </p>
            <div className="input-box" onClick={() => navigate('/chat')} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #ffe0ec33" }}>
              <input
                type="text"
                placeholder="Tell me how you're feeling today..."
                readOnly
                style={{ cursor: "pointer", background: "transparent", border: "none", fontSize: 18, color: "#d72660" }}
                className="friendly"
              />
              <button className="mic-btn" style={{ fontSize: 22, background: "none", border: "none", cursor: "pointer" }}>🎤</button>
            </div>
            <div style={{ marginTop: 24 }}>
              <FriendlyButton onClick={() => navigate('/chat')} style={{ fontSize: 20, padding: "14px 36px" }}>
                Talk to your Buddy
              </FriendlyButton>
            </div>
          </div>
          <div className="hero-right" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              src={buddyImg}
              alt="Mental Buddy Avatar"
              style={{ borderRadius: "50%", boxShadow: "0 8px 32px #ffe0ec55", width: 320, height: 320, objectFit: "cover", animation: "avatar-breathing 3s ease-in-out infinite" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
