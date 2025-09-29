import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Home = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`page ${theme}`}>
      <div className="container">
        <h1>Welcome to Food Delivery App!</h1>
        <p>Discover amazing restaurants and order your favorite food.</p>
        <div style={{ marginTop: '20px' }}>
          <button className="btn" style={{ marginRight: '10px' }}>
            Browse Restaurants
          </button>
          <button className="btn secondary">
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;