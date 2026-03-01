import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  // STATE: Form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // STATE: Error and loading states
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load Google Sign-In Script
  useEffect(() => {
    // Dynamically load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });
        // Render Google Sign-In button
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    };

    return () => {
      // Clean up script if component unmounts
      document.head.removeChild(script);
    };
  }, []);

  // HANDLE FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true);

    try {
      // SEND LOGIN REQUEST TO BACKEND
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
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
        setError("Login failed. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // HANDLE GOOGLE SIGN-IN
  const handleGoogleSignIn = async (response) => {
    setError(""); // Clear previous errors
    setIsLoading(true);

    try {
      // Decode the JWT token from Google
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const googleUser = JSON.parse(jsonPayload);

      // Send Google user data to backend
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.sub, // Google's unique user ID
      });

      // STORE JWT TOKEN IN LOCALSTORAGE
      localStorage.setItem("token", res.data.token);
      
      // STORE USER INFO
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // REDIRECT TO HOME PAGE
      navigate("/home");
    } catch (err) {
      // HANDLE ERRORS
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Google sign-in failed. Please try again.");
      }
      console.error("Google sign-in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* LOGO */}
        <div className="logo">
          <div className="logo-mark" aria-hidden>🧠</div>
        </div>

        {/* TITLE */}
        <h2 className="login-title">Welcome back</h2>
        <div className="login-sub">Sign in to continue to Mental Buddy</div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>
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
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            className="submit-btn" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="divider">
          <span>or</span>
        </div>

        {/* GOOGLE SIGN-IN BUTTON */}
        <div id="google-signin-button" className="google-signin-container"></div>

        {/* ERROR MESSAGE DISPLAY */}
        {error && <div className="error">{error}</div>}

        {/* LINK TO SIGNUP PAGE */}
        <div className="small-link">
          Don't have an account?{" "}
          <span 
            style={{ color: "#5b6bff", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
