const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `You are an interactive mental health companion named MentalBuddy.

Rules:
- Do NOT repeat generic phrases like "tell me more" in every response.
- Ask specific follow-up questions based on the user's message.
- Give small practical suggestions when appropriate.
- If the user shares emotions, acknowledge them briefly and then respond with guidance or reflection.
- Vary tone and wording across messages.
- Avoid sounding robotic or repetitive.`;

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction
});

async function getChatReply(messages) {
    try {
        // 1. Separate history (all messages except the last one)
        // Gemini format: { role: "user" | "model", parts: [{ text: "..." }] }
        const history = messages.slice(0, -1).map(msg => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
        }));

        // 2. Get the new user message
        const lastMessage = messages[messages.length - 1];
        const userMessageContent = lastMessage.content;

        // 3. Start Chat Session with History
        const chat = model.startChat({
            history: history,
        });

        // 4. Send Message and Get Response
        const result = await chat.sendMessage(userMessageContent);
        const response = await result.response;
        const text = response.text();

        return text;

    } catch (error) {
        console.error("❌ [AI Service] Error generating content:", error);
        throw error; // Re-throw to be handled by the route
    }
}

module.exports = { getChatReply };
