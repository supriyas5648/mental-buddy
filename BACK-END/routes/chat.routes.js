const express = require('express');
const router = express.Router();
const { getChatReply } = require('../services/ai.service');

// POST / (mounted at /api/chat in server.js)
router.post('/', async (req, res) => { // CHANGED: path is '/' not '/api/chat' to avoid double nesting
    try {
        console.log("🔥 [Backend] POST /api/chat received");
        const { messages } = req.body;

        // Validation
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.warn("⚠️ [Backend] Invalid messages format received");
            return res.status(400).json({ error: 'Messages array is required and must not be empty' });
        }

        console.log(`📩 [Backend] Processing ${messages.length} messages...`);

        // Check for empty content in the last message
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || !lastMessage.content || !lastMessage.content.trim()) {
            return res.status(400).json({ error: "Message content cannot be empty" });
        }

        // Get AI Reply
        const reply = await getChatReply(messages);

        console.log("✅ [Backend] AI Response generated successfully");
        res.json({ reply });

    } catch (error) {
        console.error('❌ [Backend] Chat route error:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

module.exports = router;
