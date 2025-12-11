// /backend/controllers/chatbotController.js
// Simple proxy controller that forwards chat messages to Groq API.
// Reads API key from environment variable GROQ_API_KEY.

const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function chatWithGroq(req, res) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL;
  if (!apiKey) {
    return res.status(500).json({ message: 'GROQ_API_KEY is not configured on the server.' });
  }

  if (!model) {
    return res.status(500).json({ message: 'GROQ_MODEL is not configured on the server. Please set it to a valid Groq model name.' });
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ message: 'Message is required.' });
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant for the Modex Movie Booking System. Answer user questions about movies, showtimes, genres, and general film info. Do not perform bookings yourself; instead, guide the user to use the main booking screens.',
          },
          { role: 'user', content: message },
        ],
        temperature: 0.6,
        max_tokens: 512,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply =
      response.data &&
      response.data.choices &&
      response.data.choices[0] &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content;

    res.json({ reply: reply || 'Sorry, I could not generate a response.' });
  } catch (error) {
    console.error('Groq chat error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Chat service error. Please try again later.' });
  }
}

module.exports = {
  chatWithGroq,
};
