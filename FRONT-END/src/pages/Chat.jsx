import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/chat.css";

function Chat() {
    // Initial State: No mock messages, just empty or a welcome system message if desired.
    // We start empty to strictly follow "NO mock data" requirement, or a strictly UI-only welcome.
    const [messages, setMessages] = useState([
        {
            id: 'init-1',
            sender: "bot",
            text: "Hello! I'm your Mental Buddy. How are you feeling today?",
            uiOnly: true
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        // 1. Optimistic UI Update: Show user message immediately
        const userText = inputText;
        const userMsg = { id: Date.now(), sender: "user", text: userText };

        setMessages((prev) => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);

        try {
            // 2. Prepare Payload: Convert state messages to API format
            // We need to send the ENTIRE conversation history including the new message
            const historyForBackend = messages.filter(msg => !msg.uiOnly).map(msg => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text
            }));

            // Add the new message to the history payload
            const payload = [
                ...historyForBackend,
                { role: "user", content: userText }
            ];

            console.log("📤 Sending to Backend:", payload);

            // 3. Real API Call
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: payload }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log("📥 Received from Backend:", data);

            // 4. Update UI with AI Response
            const botMsg = {
                id: Date.now() + 1,
                sender: "bot",
                text: data.reply,
            };
            setMessages((prev) => [...prev, botMsg]);

        } catch (error) {
            console.error("❌ Chat Error:", error);
            const errorMsg = {
                id: Date.now() + 2,
                sender: "bot",
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
        <div className="chat-container">
            {/* Header */}
            <header className="chat-header">
                <Link to="/home" className="back-btn">← Back</Link>
                <h2>Mental Buddy Chat</h2>
                <div style={{ width: "40px" }}></div>
            </header>

            {/* Messages */}
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`message ${msg.sender === "user" ? "user" : "bot"}`}
                    >
                        {msg.text}
                    </div>
                ))}

                {isTyping && (
                    <div className="message bot">
                        <span className="typing">Mental Buddy is typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button
                        className="send-btn"
                        onClick={handleSend}
                        disabled={!inputText.trim() || isTyping}
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;
