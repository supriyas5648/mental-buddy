import { useState, useEffect } from "react";
import { moodAPI } from "../services/api";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "../styles/progress.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Progress() {
  // State management
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [moodCounts, setMoodCounts] = useState({});
  const [highestMood, setHighestMood] = useState(null);
  const [todayMood, setTodayMood] = useState(null);

  // Mood emoji mapping
  const moodEmojis = {
    happy: "😊",
    sad: "😔",
    anxious: "😟",
    calm: "😌",
    angry: "😡"
  };

  // Get message based on highest mood
  const getMoodMessage = (mood, count) => {
    const messages = {
      happy: `You were happiest this week ${moodEmojis.happy}`,
      sad: `You felt sad more often ${moodEmojis.sad}`,
      anxious: `You felt anxious more often ${moodEmojis.anxious}`,
      calm: `You felt calm more often ${moodEmojis.calm}`,
      angry: `You felt angry more often ${moodEmojis.angry}`
    };
    return messages[mood] || "Track your mood regularly!";
  };

  // Fetch moods on component mount
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await moodAPI.getAllMoods();
        
        if (response.data && Array.isArray(response.data)) {
          setMoods(response.data);

          // Get today's mood
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayMoodEntry = response.data.find((entry) => {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === today.getTime();
          });
          if (todayMoodEntry) {
            setTodayMood(todayMoodEntry);
          }

          // Count moods by type
          const counts = {
            happy: 0,
            sad: 0,
            anxious: 0,
            calm: 0,
            angry: 0
          };

          response.data.forEach((entry) => {
            if (counts.hasOwnProperty(entry.mood)) {
              counts[entry.mood]++;
            }
          });

          setMoodCounts(counts);

          // Find highest mood
          const highest = Object.entries(counts).reduce((prev, current) =>
            prev[1] > current[1] ? prev : current
          );
          setHighestMood(highest[0]);
        } else {
          setError("No mood data available");
        }
      } catch (err) {
        setError(err.msg || "Failed to load mood data. Please try again.");
        console.error("Fetch moods error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, []);

  // Prepare data for mood distribution bar chart
  const barChartData = {
    labels: ["Happy", "Sad", "Anxious", "Calm", "Angry"],
    datasets: [
      {
        label: "Mood Count",
        data: [
          moodCounts.happy || 0,
          moodCounts.sad || 0,
          moodCounts.anxious || 0,
          moodCounts.calm || 0,
          moodCounts.angry || 0
        ],
        backgroundColor: [
          "rgba(255, 193, 7, 0.7)", // Happy - Yellow
          "rgba(244, 67, 54, 0.7)", // Sad - Red
          "rgba(233, 30, 99, 0.7)", // Anxious - Pink
          "rgba(76, 175, 80, 0.7)", // Calm - Green
          "rgba(233, 121, 12, 0.7)" // Angry - Orange
        ],
        borderColor: [
          "rgba(255, 193, 7, 1)",
          "rgba(244, 67, 54, 1)",
          "rgba(233, 30, 99, 1)",
          "rgba(76, 175, 80, 1)",
          "rgba(233, 121, 12, 1)"
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: [
          "rgba(255, 193, 7, 0.9)",
          "rgba(244, 67, 54, 0.9)",
          "rgba(233, 30, 99, 0.9)",
          "rgba(76, 175, 80, 0.9)",
          "rgba(233, 121, 12, 0.9)"
        ]
      }
    ]
  };

  // Prepare data for 30-day trend line chart (Monthly)
  const getLast30DaysTrend = () => {
    const today = new Date();
    const last30Days = {};

    // Initialize last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split("T")[0];
      last30Days[dateStr] = 0;
    }

    // Count moods by date
    moods.forEach((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      const dateStr = entryDate.toISOString().split("T")[0];
      if (last30Days.hasOwnProperty(dateStr)) {
        last30Days[dateStr]++;
      }
    });

    // Convert to sorted arrays for chart
    const labels = Object.keys(last30Days).sort().reverse();
    const data = labels.map((date) => last30Days[date]);

    return { labels, data };
  };

  const trendData = getLast30DaysTrend();

  const lineChartData = {
    labels: trendData.labels,
    datasets: [
      {
        label: "Daily Mood Entries",
        data: trendData.data,
        borderColor: "rgba(102, 126, 234, 1)",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "rgba(102, 126, 234, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        hoverBackgroundColor: "rgba(102, 126, 234, 0.8)"
      }
    ]
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 12,
            weight: "bold"
          },
          color: "#2d3748"
        }
      },
      title: {
        display: true,
        text: "Mood Distribution",
        font: {
          size: 16,
          weight: "bold"
        },
        color: "#2d3748"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return Number.isInteger(value) ? value : "";
          }
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 12,
            weight: "bold"
          },
          color: "#2d3748"
        }
      },
      title: {
        display: true,
        text: "Last 30 Days Mood Entries",
        font: {
          size: 16,
          weight: "bold"
        },
        color: "#2d3748"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return Number.isInteger(value) ? value : "";
          }
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="progress-container">
        <div className="progress-card">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your mood data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="progress-container">
        <div className="progress-card">
          <div className="error-message">
            <p>⚠️ {error}</p>
            <p className="error-hint">Make sure you have logged mood entries first.</p>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!moods || moods.length === 0) {
    return (
      <div className="progress-container">
        <div className="progress-card">
          <div className="no-data-message">
            <p>📊 No mood data available</p>
            <p className="no-data-hint">
              Start logging your mood to see your progress and insights!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    //Today's Mood Section */}
    <div className="progress-container">
      <div className="progress-wrapper">
        {/* Today's Mood Section */}
        {todayMood && (
          <div className="todays-mood-section">
            <div className="todays-mood-card">
              <h2 className="todays-mood-title">Today's Mood</h2>
              <div className="todays-mood-content">
                <span className="todays-mood-emoji">{moodEmojis[todayMood.mood]}</span>
                <div className="todays-mood-info">
                  <p className="todays-mood-label">
                    {todayMood.mood.charAt(0).toUpperCase() + todayMood.mood.slice(1)}
                  </p>
                  {todayMood.note && (
                    <p className="todays-mood-note">"{todayMood.note}"</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="progress-header">
          <h1 className="progress-title">Your Mood Progress</h1>
          <p className="progress-subtitle">
            Track your emotional journey and discover patterns in your mood
          </p>
        </div>

        {/* Highest Mood Card */}
        {highestMood && (
          <div className="highest-mood-card">
            <div className="mood-metric">
              <span className="mood-emoji-large">
                {moodEmojis[highestMood]}
              </span>
              <div className="mood-info">
                <p className="mood-message">{getMoodMessage(highestMood, moodCounts[highestMood])}</p>
                <p className="mood-count">
                  {highestMood.charAt(0).toUpperCase() + highestMood.slice(1)}: 
                  <span className="count"> {moodCounts[highestMood]} entries</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="charts-container">
          {/* Bar Chart */}
          <div className="chart-card">
            <div className="chart-wrapper">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          {/* Line Chart */}
          <div className="chart-card">
            <div className="chart-wrapper">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Mood Count Summary */}
        <div className="mood-summary">
          <h2 className="summary-title">Mood Summary</h2>
          <div className="mood-stats">
            {Object.entries(moodCounts).map(([mood, count]) => (
              <div key={mood} className="stat-item">
                <span className="stat-emoji">{moodEmojis[mood]}</span>
                <div className="stat-content">
                  <p className="stat-label">
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </p>
                  <p className="stat-count">{count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Entries */}
        <div className="total-entries">
          <p>
            <span className="entry-icon">📝</span>
            Total Mood Entries: <strong>{moods.length}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Progress;
