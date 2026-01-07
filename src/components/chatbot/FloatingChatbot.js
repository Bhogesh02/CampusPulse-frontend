/**
 * Floating Chatbot Component - Bottom Right Corner
 * Role-aware AI assistant
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth/authSelectors';
import { chatbotAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './Chatbot.css';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const user = useSelector(selectUser);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await chatbotAPI.sendMessage(inputMessage);
      const botMessage = {
        text: response.data.response,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <h3>AI Assistant</h3>
              <span className="chatbot-role-badge">{user?.role?.toUpperCase()}</span>
            </div>
            <button className="chatbot-close-btn" onClick={handleToggle}>
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatbot-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-message bot-message">
                <div className="message-content loading">
                  <span>●</span>
                  <span>●</span>
                  <span>●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chatbot-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button type="submit" className="chatbot-send-btn" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      ) : (
        <button className="chatbot-toggle-btn" onClick={handleToggle}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FloatingChatbot;
