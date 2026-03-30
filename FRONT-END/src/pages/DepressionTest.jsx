import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/depression.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function DepressionTest() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleAnalyzeText = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // grab token stored after login
      const token = localStorage.getItem("token");
      // Send POST request to backend
      const response = await axios.post(
        `${API_BASE_URL}/depression/analyze-text`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("Depression analysis response", response.data);
      // Display the result
      setResult(response.data);
      setText(""); // Clear textarea after successful submission
    } catch (err) {
      console.error("Error analyzing text:", err);
      setError(
        err.response?.data?.msg ||
          "Failed to analyze text. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="depression-test-container">
      <div className="depression-test-card">
        <h1>Depression Test</h1>
        <p className="description">
          Share how you're feeling, and we'll provide some insights about your
          emotional state.
        </p>

        <form onSubmit={handleAnalyzeText}>
          {/* Textarea for user input */}
          <textarea
            className="depression-textarea"
            placeholder="Write how you feel... (e.g., 'I feel tired, lonely and hopeless these days,everything you feel is valid and you are not alone.')"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="8"
            disabled={loading}
          />

          {/* Error message */}
          {error && <p className="error-message">{error}</p>}

          {/* Submit button */}
          <button
            type="submit"
            className="depression-test-btn"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Depression Test"}
          </button>
        </form>

        {/* Result section */}
        {result && (
          <div className="result-section">
            <h2>Analysis Result</h2>

            {/* progress bar */}
            <div className="progress-bar-wrapper">
              <div
                className="progress-bar"
                style={{ width: `${result?.depression_percentage || 0}%` }}
              />
              <span className="progress-label">
                {result?.depression_percentage ?? 0}%
              </span>
            </div>

            <p>
              Severity: <strong>{result?.severity}</strong>
            </p>
            <p className="explanation">{result?.explanation || ""}</p>

            {/* Info message */}
            {(result?.depression_percentage || 0) >= 50 && (
              <p className="info-message">
                💡 If you're experiencing persistent feelings of depression,
                please consider reaching out to a mental health professional.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// previous helper not needed but kept for compatibility
function getResultClass(result) {
  if (typeof result === "string" && result.includes("depression")) {
    return "warning";
  }
  return "normal";
}

export default DepressionTest;
