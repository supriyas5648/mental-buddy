// src/components/MoodCard.jsx
import React from "react";

const MoodCard = ({ mood, note, date, emoji, color }) => (
  <div
    className={`mood-card bg-white/80 rounded-2xl shadow-lg p-4 mb-4 flex items-center gap-4 border-l-8 ${color} animate-float`}
  >
    <span className="text-3xl">{emoji}</span>
    <div className="flex-1">
      <div className="font-bold text-lg text-gray-700">{mood}</div>
      <div className="text-sm text-gray-500">{note}</div>
      <div className="text-xs text-gray-400 mt-1">{date}</div>
    </div>
  </div>
);

export default MoodCard;
