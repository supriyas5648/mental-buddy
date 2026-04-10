// src/components/ChatMessage.jsx
import React from "react";

const ChatMessage = ({ text, sender, name, avatar }) => {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex items-start gap-3 max-w-xs ${isUser ? "flex-row-reverse" : ""}`}>
        <img
          src={avatar}
          alt={`${name} avatar`}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          <span className="text-sm font-bold text-gray-600 mb-1">{name}</span>
          <div
            className={`px-4 py-2 rounded-2xl shadow-md text-base font-medium ${
              isUser
                ? "bg-gradient-to-br from-pink-200 to-pink-100 text-gray-800 rounded-br-none"
                : "bg-gradient-to-br from-blue-100 to-blue-50 text-gray-700 rounded-bl-none"
            }`}
          >
            {typeof text === 'string' ? text : text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;