import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="welcome-root">
      <div className="welcome-container">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome to <span className="welcome-highlight">ERP AI System</span>
          </h1>
          
          <p className="welcome-subtitle">
            Your comprehensive business management solution with AI-powered insights
          </p>
          
          <div className="welcome-features">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Sales & Inventory Management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              <span>AI-Powered Analytics</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              <span>Business Intelligence</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💼</span>
              <span>Customer Management</span>
            </div>
          </div>
          
          <div className="welcome-actions">
            <Link to="/All-in-one-Login" className="login-button">
              Get Started - Login
            </Link>
          </div>
          
          <div className="welcome-footer">
            <p>Powered by AI Technology</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;