import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoMdSend } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { BsRobot } from 'react-icons/bs';
import './Chatbot.css';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/command', {
        prompt: inputMessage
      }, {
        withCredentials: true
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.answer,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        type: response.data.type
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot Toggle Button */}
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Assistant"
      >
        <BsRobot size={24} />
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <BsRobot size={20} />
              <span>AI Assistant</span>
            </div>
            <div className="chatbot-controls">
              <button onClick={clearChat} className="clear-btn" title="Clear Chat">
                Clear
              </button>
              <button onClick={() => setIsOpen(false)} className="close-btn" title="Close">
                <IoClose size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <BsRobot size={40} />
                <h3>AI Assistant</h3>
                <p>Ask me about:</p>
                <ul>
                  <li>• Monthly sales data</li>
                  <li>• Inventory status</li>
                  <li>• Top selling products</li>
                  <li>• Business reports</li>
                </ul>
              </div>
            )}
            
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">{message.timestamp}</span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chatbot-input">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your business..."
              disabled={isLoading}
              rows={1}
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="send-btn"
            >
              <IoMdSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot; 