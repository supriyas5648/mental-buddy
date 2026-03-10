const OpenAI = require("openai");

// Check for API key
if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️ WARNING: OPENAI_API_KEY is not set in environment variables");
}

console.log("🔑 OPENAI API KEY FROM ENV:", process.env.OPENAI_API_KEY ? "Set" : "Not Set");

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

console.log("✅ OpenAI client initialized");

const systemInstruction = `You are an interactive mental health companion named MentalBuddy.

Rules:
- Do NOT repeat generic phrases like "tell me more" in every response.
- Ask specific follow-up questions based on the user's message.
- Give small practical suggestions when appropriate.
- If the user shares emotions, acknowledge them briefly and then respond with guidance or reflection.
- Vary tone and wording across messages.
- Avoid sounding robotic or repetitive.`;

async function getChatReply(messages) {
    try {
        
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("Messages array must not be empty");
        }

        // OpenAI expects: [{ role: "user" | "assistant", content: string }]
        // Just pass the messages directly since frontend already provides correct format
        const openaiMessages = [
            { role: "system", content: systemInstruction },
            ...messages
        ];

        console.log("📤 Calling OpenAI API with", messages.length, "messages");

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: openaiMessages,
            temperature: 0.2,
            max_tokens: 500,
        });

        console.log("✅ OpenAI response received");
        const reply = response.choices[0].message.content;
        return reply;

    } catch (error) {
        console.error("❌ [AI Service] Error calling OpenAI:", error.message);
        throw error; // Re-throw to be handled by the route
    }
}

// new helper for depression analysis requests
async function analyzeDepression(text) {
    // build the same prompt used previously in the route
    const userPrompt = `You are a mental health analysis assistant.
     Analyze the following text written by a user and estimate the 
     likelihood that the user is experiencing depressive symptoms.

Return ONLY a JSON response in this format:
{\n"depression_percentage": number,\n"severity": "none | mild | moderate | severe",\n"explanation": "short explanation"\n}

User text:
${text}`;
    const aiResp = await getChatReply([{ role: "user", content: userPrompt }]);
    // parse before returning
    try {
        console.log("AI RAW RESPONSE:", aiResp);
        return JSON.parse(aiResp);
    } catch (err) {
        console.error("❌ [AI Service] parse error in analyzeDepression:", aiResp);
        throw new Error("Invalid AI response");
    }
}

module.exports = { getChatReply, analyzeDepression };
