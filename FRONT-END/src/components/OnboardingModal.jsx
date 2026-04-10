// src/components/OnboardingModal.jsx
import React from "react";

const OnboardingModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
        <h2 className="text-2xl font-bold mb-2 text-green-500">Welcome to Mental Buddy!</h2>
        <p className="mb-4 text-gray-600">
          This is your safe space. Here, you can chat, track your mood, and find comfort whenever you need it. 💛
        </p>
        <button
          className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-green-300 to-teal-200 text-gray-800 font-semibold shadow hover:scale-105 transition-all duration-200"
          onClick={onClose}
        >
          Let’s Start
        </button>
      </div>
    </div>
  );
};

export default OnboardingModal;
