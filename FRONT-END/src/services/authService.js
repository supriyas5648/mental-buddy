
import axios from "axios";

// CREATE AXIOS INSTANCE WITH BASE URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

//

const authAPI = axios.create({
  baseURL: API_BASE_URL,
});

// INTERCEPTOR: Add token to every request header
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INTERCEPTOR: Handle 401 unauthorized responses
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid/expired, redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// AUTHENTICATION FUNCTIONS

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} confirmPassword - Confirm password
 * @returns {Promise} - Response with token and user data
 */
export const signup = (name, email, password, confirmPassword) => {
  return authAPI.post("/auth/signup", {
    name,
    email,
    password,
    confirmPassword,
  });
};

/**
 * Login existing user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Response with token and user data
 */
export const login = (email, password) => {
  return authAPI.post("/auth/login", {
    email,
    password,
  });
};

/**
 * Google Sign-In
 * @param {string} name - User's full name from Google
 * @param {string} email - User's email from Google
 * @param {string} googleId - User's Google ID (sub claim)
 * @returns {Promise} - Response with token and user data
 */
export const googleSignIn = (name, email, googleId) => {
  return authAPI.post("/auth/google", {
    name,
    email,
    googleId,
  });
};
/**
 * Logout user (clear token from storage)
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Get stored user data
 * @returns {Object|null} - User object or null if not logged in
 */
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if token exists
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * Get stored token
 * @returns {string|null} - JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

export default authAPI;
