import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/depression.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const questions = [
  "How often do you feel sad or low?",
  "Do you feel a lack of interest in daily activities?",
  "How is your sleep pattern?",
  "Do you feel tired or low on energy?",
  "Do you find it hard to concentrate?",
  "Do you feel hopeless about the future?",
  "Do you feel anxious or stressed frequently?"
];

const options = ["Never", "Sometimes", "Often", "Always"];

function DepressionTest() {
  const [answers, setAnswers] = useState({});
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({ ...prev, [`q${questionIndex + 1}`]: value }));
  };

  const isFormValid = () => {
    return questions.every((_, index) => answers[`q${index + 1}`]);
  };

  // Handle form submission
  const handleAnalyzeText = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError("Please answer all questions.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const combinedInput = questions.map((q, i) => `Q${i + 1}: ${answers[`q${i + 1}`]}`).join('\n') + `\nAdditional: ${text}`;

    try {
      // grab token stored after login
      const token = localStorage.getItem("token");
      // Send POST request to backend
      const response = await axios.post(
        `${API_BASE_URL}/depression/analyze-text`,
        { text: combinedInput },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("Depression analysis response", response.data);
      // Display the result
      setResult(response.data);
      setAnswers({});
      setText("");
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
          Answer the following questions to get personalized insights about your emotional state.
        </p>

        <form onSubmit={handleAnalyzeText}>
          {questions.map((question, index) => (
            <div key={index} className="question-section" style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>{index + 1}. {question}</h3>
              <div className="options" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {options.map(option => (
                  <label key={option} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <input
                      type="radio"
                      name={`q${index + 1}`}
                      value={option}
                      checked={answers[`q${index + 1}`] === option}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      disabled={loading}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Optional Textarea */}
          <div className="question-section" style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>Optional: Describe anything else you'd like to share</h3>
            <textarea
              className="depression-textarea"
              placeholder="Write how you feel... (optional)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="4"
              disabled={loading}
            />
          </div>

          {/* Error message */}
          {error && <p className="error-message">{error}</p>}

          {/* Submit button */}
          <button
            type="submit"
            className="depression-test-btn"
            disabled={loading || !isFormValid()}
          >
            {loading ? "Analyzing..." : "Submit Test"}
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
