import "../styles/homepage.css";
import logo from "../assets/app_logo.jpg";
import avatar from "../assets/female-avatar.png";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
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
          <Link to="/profile">Progress</Link>
          <Link to="/chat-history">Chat History</Link>
          <Link to="/depression-test">Depression Test</Link>
          <Link to="/contact">Contact</Link>
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
            <img src={avatar} alt="Mental Buddy Avatar" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
