import { useState, useEffect } from "react";
import { moodAPI } from "../services/api";
import "../styles/mood.css";

function MoodEntry() {
  const moodOptions = [
    { value: "happy", label: "Happy", emoji: "😊" },
    { value: "sad", label: "Sad", emoji: "😔" },
    { value: "anxious", label: "Anxious", emoji: "😟" },
    { value: "calm", label: "Calm", emoji: "😌" },
    { value: "angry", label: "Angry", emoji: "😡" }
  ];

  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Check if user already has a mood entry for today
  useEffect(() => {
    const loadTodayMood = async () => {
      try {
        const response = await moodAPI.getTodayMood();
        if (response.data && response.data.mood) {
          setSelectedMood(response.data.mood);
          setNote(response.data.note || "");
          setHasSubmitted(true);
        }
      } catch (err) {
        console.log("No mood entry found for today");
      }
    };

    loadTodayMood();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!selectedMood) {
      setError("Please select a mood");
      return;
    }

    setLoading(true);

    try {
      const response = await moodAPI.saveMood(selectedMood, note);
      setMessage(hasSubmitted ? "Mood updated successfully! 🎉" : "Mood saved successfully! 🎉");
      setHasSubmitted(true);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.msg || "Failed to save mood. Please try again.");
      console.error("Save mood error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mood-entry-container">
      <div className="mood-entry-card">
        <h1 className="mood-title">How are you feeling today?</h1>
        <p className="mood-subtitle">Your mental health matters. Track your mood daily.</p>

        <form onSubmit={handleSubmit} className="mood-form">
          {/* Mood Selector */}
          <div className="mood-selector">
            <label className="mood-selector-label">Select Your Mood</label>
            <div className="mood-options">
              {moodOptions.map((option) => (
                <div key={option.value} className="mood-option">
                  <input
                    type="radio"
                    id={option.value}
                    name="mood"
                    value={option.value}
                    checked={selectedMood === option.value}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="mood-radio"
                  />
                  <label htmlFor={option.value} className="mood-option-label">
                    <span className="mood-emoji">{option.emoji}</span>
                    <span className="mood-text">{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Note Textarea */}
          <div className="form-group">
            <label htmlFor="note" className="note-label">
              Add a note (optional)
            </label>
            <textarea
              id="note"
              className="note-textarea"
              placeholder="What's on your mind? How can we help?..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="4"
            />
            <div className="char-count">{note.length} / 200</div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedMood}
            className="submit-btn"
          >
            {loading ? "Saving..." : hasSubmitted ? "Update Mood" : "Save Mood"}
          </button>
        </form>

        {/* Messages */}
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default MoodEntry;
