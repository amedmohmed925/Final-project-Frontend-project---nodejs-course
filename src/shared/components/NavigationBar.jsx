// components/NavigationBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css'; // ملف CSS جديد للتنسيق

const NavigationBar = () => {
  const location = useLocation();
  
  return (
    <nav className="navigation-bar">
      <Link 
        to="/community" 
        className={`nav-btn btn ${location.pathname === '/community' ? 'active' : ''}`}
      >
        Posts
      </Link>
      <Link 
        to="/chat/live" 
        className={`nav-btn btn ${location.pathname === '/chat/live' ? 'active' : ''}`}
      >
        Live Chat
      </Link>
      <Link 
        to="/chat/bot" 
        className={`nav-btn btn ${location.pathname === '/chat/bot' ? 'active' : ''}`}
      >
        AI Chatbot
      </Link>
    </nav>
  );
};

export default NavigationBar;