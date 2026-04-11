import "../styles/contact.css";
import { Link } from "react-router-dom";
import logo from "../assets/app_logo.jpg";

function Contact() {
  return (
    <>
      {/* NAVBAR */}
      <header className="navbar" style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px #e6f9ec33" }}>
        <div className="nav-left">
          <img src={logo} alt="Mental Buddy Logo" style={{ borderRadius: 12, boxShadow: "0 2px 8px #e6f9ec33" }} />
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

      {/* CONTACT SECTION */}
      <section className="contact-section">
        <div className="contact-container">
          <h1 className="contact-title">Contact Us</h1>
          
          <div className="contact-card">
            <div className="email-section">
              <span className="email-icon">📧</span>
              <p className="email">88661supriyak@gmail.com</p>
            </div>

            <p className="description">
              We would love to hear your suggestions, feedback, or any concerns you may have. Your thoughts help us improve and serve you better.
            </p>

            <p className="friendly-message">
              Feel free to reach out anytime!
            </p>

            <div className="contact-divider"></div>

            <p className="message-hint">
              Whether you have a question about Mental Buddy, want to share your experience, or simply need to connect, we're here for you.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
