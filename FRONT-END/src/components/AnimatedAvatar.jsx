// src/components/AnimatedAvatar.jsx
import React from "react";

const AnimatedAvatar = ({ src, alt }) => (
  <div className="avatar-breathing inline-block rounded-full overflow-hidden shadow-lg animate-avatar-breathing">
    <img src={src} alt={alt} className="w-16 h-16 object-cover" />
  </div>
);

export default AnimatedAvatar;
