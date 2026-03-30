import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const navigate = useNavigate();

  // STATE: Form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // STATE: Error and loading states
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // HANDLE FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true);

    try {
      // SEND SIGNUP REQUEST TO BACKEND
      const res = await axios.post(`${API_BASE_URL}/auth/signup`, {
        name,
        email,
        password,
        confirmPassword,
      });

      // STORE JWT TOKEN IN LOCALSTORAGE
      localStorage.setItem("token", res.data.token);
      
      // OPTIONAL: Store user info for future use
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // REDIRECT TO HOME PAGE
      navigate("/home");
    } catch (err) {
      // HANDLE ERRORS
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Signup failed. Please try again.");
      }
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        {/* LOGO */}
        <div className="logo">
          <div className="logo-mark" aria-hidden>🧠</div>
        </div>

        {/* TITLE */}
        <h2 className="signup-title">Create Account</h2>
        <div className="signup-sub">Join Mental Buddy to get started</div>

        {/* SIGNUP FORM */}
        <form onSubmit={handleSubmit}>
          {/* NAME FIELD */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              className="form-control"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* EMAIL FIELD */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="form-control"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD FIELD */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="form-control"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* CONFIRM PASSWORD FIELD */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              className="form-control"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            className="submit-btn" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* ERROR MESSAGE DISPLAY */}
        {error && <div className="error">{error}</div>}

        {/* LINK TO LOGIN PAGE */}
        <div className="small-link">
          Already have an account?{" "}
          <span 
            style={{ color: "#5b6bff", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
