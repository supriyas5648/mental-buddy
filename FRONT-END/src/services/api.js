import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Create axios instance with auth header
const createAuthHeader = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Mood API functions
export const moodAPI = {
  // Save or update today's mood
  saveMood: async (mood, note = "") => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/mood`,
        { mood, note },
        createAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Error saving mood" };
    }
  },

  // Get all mood entries for user
  getAllMoods: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/mood`,
        createAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Error fetching moods" };
    }
  },

  // Get today's mood
  getTodayMood: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/mood/today`,
        createAuthHeader()
      );
      return response.data;
    } catch (error) {
      // Return empty data instead of throwing for non-existent moods
      if (error.response?.status === 404) {
        return { data: null };
      }
      throw error.response?.data || { msg: "Error fetching today's mood" };
    }
  }
};
