// /frontend/src/pages/Chatbot.tsx
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hi! I am the Modex movie assistant. Ask me about movies, genres, recommendations, or how to use the booking system.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, { message: trimmed });
      const reply: string = response.data.reply || 'No response.';
      const assistantMessage: ChatMessage = { role: 'assistant', content: reply };
      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      setError('Chat service is currently unavailable. Please try again.');
      setMessages(newMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#fbbf24', marginBottom: '10px' }}>Movie Chat Assistant</h2>
      <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
        Ask questions about movies, genres, recommendations, or how to use the Modex Booking System.
      </p>

      <div
        style={{
          background: 'radial-gradient(circle at top left, #1f2937, #020617)',
          borderRadius: '16px',
          border: '1px solid #374151',
          boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          height: '480px',
        }}
      >
        <div
          style={{
            flex: 1,
            padding: '16px 18px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background:
                    m.role === 'user'
                      ? 'linear-gradient(135deg, #ef4444, #f97316)'
                      : 'linear-gradient(135deg, #0f172a, #1f2937)',
                  color: '#f9fafb',
                  fontSize: '0.9rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ color: '#f97316', padding: '0 18px 8px', fontSize: '0.85rem' }}>Error: {error}</div>
        )}

        <form
          onSubmit={sendMessage}
          style={{
            display: 'flex',
            gap: '10px',
            padding: '12px 16px 14px',
            borderTop: '1px solid #374151',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any movie or how to book..."
            style={{ flex: 1, border: 'none' }}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage;
