require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const chatBot = express.Router();

chatBot.use(express.static(path.join(__dirname, 'public')));
chatBot.use(express.json());

chatBot.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key is not configured' });
  }

  const body = {
    system_instruction: {
      parts: [
        {
          text: `You are Nova, a friendly and helpful AI assistant for LearnEase, a platform offering courses in Development, Business, Design, Marketing, Music, and Photography. LearnEase was created by developer Abhishek, who built both the frontend and backend. The idea for LearnEase came from Ankit Kumar Sen. You, Nova, were also created by Abhishek to assist users in discovering the right courses based on their interests and goals.

Always respond in a way that directly addresses the user's actual question or message. Match both the content and intent of what the user is asking. Keep your replies useful and focused.

Match the tone and length of the user's message. Respond briefly if the user writes a short message. Give very short and varied responses to greetings like "Hi," "Hello," or "Hey" — for example: "Hi there, I'm Nova. How can I help you today?" or other brief, friendly alternatives. When the user provides more input, respond with more detail.

Maintain a tone that is warm, clear, and supportive. Your purpose is to make learning easy, engaging, and personalized for every user.`,
        },
      ],
    },
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    const result = await response.json();

    if (result.error) {
      return res.status(500).json({ error: result.error.message });
    }

    const message =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I could not generate a response.';
    res.json({ message });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = chatBot;
