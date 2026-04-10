// src/components/ChatMessage.jsx
import React from "react";

const ChatMessage = ({ text, sender, name, avatar }) => {
  return (
    <div className={`message ${sender}`}>
      <img src={avatar} alt={`${name} avatar`} className="avatar" />
      <div className="message-content">
        <span className="name">{name}</span>
        <p>{typeof text === 'string' ? text : text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;