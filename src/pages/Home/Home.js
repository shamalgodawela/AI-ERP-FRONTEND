import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../../assets/nihon.png';

const Home = () => {
  return (
    <div className="welcome-root">
      <div className="welcome-container">
        <div className="welcome-content">
          {/* <img src={logo} alt="ERP Logo" className="welcome-logo" /> */}
          <h1 className="welcome-title">
            Welcome to <span className="welcome-highlight">ERP System</span>
          </h1>
          
          
          
          <div className="welcome-features">
            <div className="feature-item">
              <span className="feature-icon">📦</span>
              <span>Inventory Management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span>HR & Payroll Management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <span>Accounting & Financial Management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛒</span>
              <span>Sales Management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              <span>Chatbot for sales Analytics</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🧑‍🌾</span>
              <span>Employee Management</span>
            </div>
          </div>
          
          <div className="welcome-actions">
            <Link to="/All-in-one-Login" className="login-button">
              Login
            </Link>
          </div>
          
          {/* <div className="welcome-footer">
            <p>Powered by Nihon Software for Modern Agriculture</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Home;