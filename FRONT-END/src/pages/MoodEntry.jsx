
import { useState, useEffect } from "react";
import { moodAPI } from "../services/api";
import MoodCard from "../components/MoodCard";
import FriendlyButton from "../components/FriendlyButton";
import "../components/BreathingBackground.css";
import "../styles/mood.css";

const moodColors = {
  happy: "border-pink-200",
  sad: "border-blue-200",
  anxious: "border-yellow-200",
  calm: "border-green-200",
  angry: "border-red-200",
};

function MoodEntry() {
  const moodOptions = [
    { value: "happy", label: "Happy", emoji: "😊" },
    { value: "sad", label: "Sad", emoji: "😔" },
    { value: "anxious", label: "Anxious", emoji: "😟" },
    { value: "calm", label: "Calm", emoji: "😌" },
    { value: "angry", label: "Angry", emoji: "😡" },
  ];

  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString());
    const loadTodayMood = async () => {
      try {
        const response = await moodAPI.getTodayMood();
        if (response.data && response.data.mood) {
          setSelectedMood(response.data.mood);
          setNote(response.data.note || "");
          setHasSubmitted(true);
        }
      } catch (err) {
        // No mood entry for today
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
      await moodAPI.saveMood(selectedMood, note);
      setMessage(hasSubmitted ? "Mood updated successfully! 🎉" : "Mood saved successfully! 🎉");
      setHasSubmitted(true);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.msg || "Failed to save mood. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mood-entry-container" style={{ background: "linear-gradient(120deg, #ffe0ec 0%, #e0f7fa 100%)" }}>
      <div className="mood-entry-card" style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 8px 32px #ffe0ec55" }}>
        <h1 className="mood-title friendly">How are you feeling today?</h1>
        <p className="mood-subtitle">This is your private journal. Your feelings matter. 💛</p>

        {hasSubmitted && (
          <MoodCard
            mood={moodOptions.find(m => m.value === selectedMood)?.label}
            note={note}
            date={today}
            emoji={moodOptions.find(m => m.value === selectedMood)?.emoji}
            color={moodColors[selectedMood]}
          />
        )}

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
                  <label htmlFor={option.value} className="mood-option-label animate-float">
                    <span className="mood-emoji">{option.emoji}</span>
                    <span className="mood-text friendly">{option.label}</span>
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
              maxLength={200}
            />
            <div className="char-count">{note.length} / 200</div>
          </div>

          {/* Submit Button */}
          <FriendlyButton
            type="submit"
            disabled={loading || !selectedMood}
            style={{ marginTop: 10 }}
          >
            {loading ? "Saving..." : hasSubmitted ? "Update Mood" : "Save Mood"}
          </FriendlyButton>
        </form>

        {/* Messages */}
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default MoodEntry;
