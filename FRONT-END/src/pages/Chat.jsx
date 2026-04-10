
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BreathingBackground from "../components/BreathingBackground";
import AnimatedAvatar from "../components/AnimatedAvatar";
import ChatMessage from "../components/ChatMessage";
import FriendlyButton from "../components/FriendlyButton";
import "../components/BreathingBackground.css";
import "../styles/chat.css";
import logo from "../assets/app_logo.jpg";
import noProfileIcon from "../assets/no_profile_icon.png";
import maleAvatar from "../assets/male-avatar.png";
import femaleAvatar from "../assets/female-avatar.png";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Chat() {
    // Initial State: No mock messages, just empty or a welcome system message if desired.
    // We start empty to strictly follow "NO mock data" requirement, or a strictly UI-only welcome.
    const [messages, setMessages] = useState([
        {
            id: 'init-1',
            sender: "ai",
            text: "Hey! I'm your Mental Buddy. How are you feeling today?",
            uiOnly: true
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [aiName, setAiName] = useState("Mental Buddy");
    const [aiAvatar, setAiAvatar] = useState(logo);
    const [userName, setUserName] = useState("You");
    const [userAvatar, setUserAvatar] = useState(noProfileIcon);
    const messagesEndRef = useRef(null);

    // Load profile data
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const res = await axios.get(`${API_BASE_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const { name, avatar, preferences } = res.data;
                setUserName(name || "You");
                setUserAvatar(avatar || noProfileIcon);
               if (preferences) {
                 setAiName(preferences.buddyName || "Mental Buddy");
                 localStorage.setItem("buddyName", preferences.buddyName || "Mental Buddy");

                 if (preferences.buddy === "male") {
                     setAiAvatar(maleAvatar);
                 } else if (preferences.buddy === "female") {
                     setAiAvatar(femaleAvatar);
                 } else {
                     setAiAvatar(logo); // fallback
                }
}
            } catch (err) {
                console.error("Failed to load profile:", err);
            }
        };
        loadProfile();
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const userText = inputText;
        const userMsg = { id: Date.now(), sender: "user", text: userText };
        setMessages((prev) => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);
        try {
            const historyForBackend = messages.filter(msg => !msg.uiOnly).map(msg => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text
            }));
            const payload = [
                ...historyForBackend,
                { role: "user", content: userText }
            ];
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: payload }),
            });
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            const botMsg = {
                id: Date.now() + 1,
                sender: "ai",
                text: data.reply,
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 2,
                sender: "ai",
                text: "⚠️ Sorry, I couldn't connect to the server. Please ensure the backend is running.",
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <BreathingBackground>
            <div className="chat-container" style={{ background: "transparent" }}>
                {/* Header */}
                <header className="chat-header" style={{ background: "rgba(255,255,255,0.7)", boxShadow: "0 2px 8px #e6f9ec33" }}>
                    <Link to="/home" className="back-btn">← Back</Link>
                    <div className="flex items-center gap-2">
                        <AnimatedAvatar src={aiAvatar} alt="Buddy Avatar" />
                        <h2 className="friendly text-xl">{aiName}</h2>
                    </div>
                    <div style={{ width: "40px" }}></div>
                </header>

                {/* Messages */}
                <div className="chat-messages" style={{ background: "none" }}>
                    {messages.map((msg, idx) => (
                        <ChatMessage
                            key={msg.id}
                            text={msg.text}
                            sender={msg.sender}
                            name={msg.sender === "user" ? userName : aiName}
                            avatar={msg.sender === "user" ? userAvatar : aiAvatar}
                        />
                    ))}
                    {isTyping && (
                        <ChatMessage
                            text={<span className="typing">{aiName} is typing...</span>}
                            sender="ai"
                            name={aiName}
                            avatar={aiAvatar}
                        />
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="chat-input-area" style={{ background: "rgba(255,255,255,0.8)" }}>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="friendly"
                            style={{ background: "transparent" }}
                            autoFocus
                        />
                        <FriendlyButton
                            onClick={handleSend}
                            disabled={!inputText.trim() || isTyping}
                            aria-label="Send message"
                        >
                            ➤
                        </FriendlyButton>
                    </div>
                </div>
            </div>
        </BreathingBackground>
    );
}

export default Chat;
