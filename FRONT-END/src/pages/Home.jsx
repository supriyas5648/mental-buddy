import "../styles/homepage.css";
import logo from "../assets/app_logo.jpg";
import avatar from "../assets/female-avatar.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Mental Buddy Logo" />
        </div>

         <div className="nav-right">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/profile">Progress</Link>
          <Link to="/chat-history">Chat History</Link>
          <Link to="/depression-test">Depression Test</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-left">
            <span className="tag">AI Mental Wellness Companion</span>

            <h1>
              Your Digital <br /> Mental Wellness Buddy
            </h1>

            <p>
              A confidential AI companion to help you reflect, track emotions,
              and build healthier mental habits.
            </p>

            <div className="input-box">
              <input
                type="text"
                placeholder="Tell me how you're feeling today..."
              />
              <button className="mic-btn">🎤</button>
            </div>

            <button className="start-btn">Talk to Mental Buddy</button>
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
