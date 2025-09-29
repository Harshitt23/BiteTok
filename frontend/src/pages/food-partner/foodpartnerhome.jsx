import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const FoodPartnerHome = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`page ${theme}`}>
      <div className="container">
        <h1>Food Partner Dashboard</h1>
        <p>Welcome to your partner dashboard! Manage your restaurant and orders here.</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/food-partner/create" className="btn" style={{ marginRight: '10px', textDecoration: 'none' }}>
            Add New Food Item
          </Link>
          <button className="btn secondary" style={{ marginRight: '10px' }}>
            View Orders
          </button>
          <Link to="/food-partner/login" className="btn secondary" style={{ textDecoration: 'none' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerHome;
