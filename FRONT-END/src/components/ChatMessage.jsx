// src/components/ChatMessage.jsx
import React from "react";

const ChatMessage = ({ text, sender, name, avatar }) => {
  return (
    <div className={`message ${sender}`}>
      <img src={avatar} className="avatar" />
      <div className="bubble">
        <div className="name">{name}</div>
        <div className="text">{typeof text === 'string' ? text : text}</div>
      </div>
    </div>
  );
};

export default ChatMessage;