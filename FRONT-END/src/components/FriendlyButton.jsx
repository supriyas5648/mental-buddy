// src/components/FriendlyButton.jsx
import React from "react";

const FriendlyButton = ({ children, ...props }) => (
  <button
    className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-300 to-yellow-200 text-gray-800 font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-200"
    {...props}
  >
    {children}
  </button>
);

export default FriendlyButton;
