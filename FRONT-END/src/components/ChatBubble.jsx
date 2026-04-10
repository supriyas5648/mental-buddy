// src/components/ChatBubble.jsx
import React from "react";

const ChatBubble = ({ sender, text, isLast }) => {
  const isUser = sender === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2 transition-all duration-300`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl shadow-md text-base font-medium 
          ${isUser
            ? "bg-gradient-to-br from-green-200 to-green-100 text-gray-800 rounded-br-none"
            : "bg-gradient-to-br from-blue-100 to-blue-50 text-gray-700 rounded-bl-none"}
          ${isLast ? "animate-bubble-pop" : ""}
        `}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatBubble;
