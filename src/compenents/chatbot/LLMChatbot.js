import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoMdSend } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { BsChatDots } from 'react-icons/bs';
import './Chatbot.css';

const LLMChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation history when component mounts
  useEffect(() => {
    if (isOpen && conversationId) {
      loadConversationHistory();
    }
  }, [isOpen, conversationId]);

  const loadConversationHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/llm/conversation/${conversationId}`, {
        withCredentials: true
      });
      
      if (response.data.messages) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  };

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
      const response = await axios.post('http://localhost:5000/api/llm/conversation', {
        prompt: inputMessage,
        conversationId: conversationId
      }, {
        withCredentials: true
      });

      // Set conversation ID if this is the first message
      if (!conversationId && response.data.conversationId) {
        setConversationId(response.data.conversationId);
      }

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.answer,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        type: 'llm'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('LLM Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get LLM response');
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

  const clearChat = async () => {
    try {
      if (conversationId) {
        await axios.delete(`http://localhost:5000/api/llm/conversation/${conversationId}`, {
          withCredentials: true
        });
      }
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
    
    setMessages([]);
    setConversationId(null);
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/llm/generate-report', {
        conversationId: conversationId
      }, {
        withCredentials: true
      });

      const reportMessage = {
        id: Date.now(),
        text: response.data.answer,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        type: 'report'
      };

      setMessages(prev => [...prev, reportMessage]);
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container llm-chatbot">
      {/* Chatbot Toggle Button */}
      <button 
        className="chatbot-toggle llm-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="LLM Assistant"
      >
        <BsChatDots size={24} />
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window llm-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <BsChatDots size={20} />
              <span>LLM Assistant</span>
            </div>
            <div className="chatbot-controls">
              <button onClick={generateReport} className="report-btn" title="Generate Report">
                Report
              </button>
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
                <BsChatDots size={40} />
                <h3>LLM Assistant</h3>
                <p>I can help you with:</p>
                <ul>
                  <li>• Natural language conversations</li>
                  <li>• Data analysis and insights</li>
                  <li>• Report generation</li>
                  <li>• Business intelligence</li>
                </ul>
              </div>
            )}
            
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.type === 'report' ? 'report-message' : ''}`}
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
              placeholder="Start a conversation with me..."
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

export default LLMChatbot; 