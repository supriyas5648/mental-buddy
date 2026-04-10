// src/components/BreathingBackground.jsx
import React from "react";

const BreathingBackground = ({ children }) => (
  <div className="breathing-bg min-h-screen w-full flex flex-col">
    {children}
  </div>
);

export default BreathingBackground;
