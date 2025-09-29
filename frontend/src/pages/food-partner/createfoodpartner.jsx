import React, { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const CreateFoodPartner = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  console.log('CreateFoodPartner component rendered');
  
  useEffect(() => {
    console.log('CreateFoodPartner useEffect - checking authentication');
    // Add any authentication check here if needed
  }, []);
  
  return (
    <div className={`page ${theme}`}>
      <div className="container">
        <h1>Add New Food Item</h1>
        <p>Create a new food item for your restaurant menu.</p>
        <div style={{ marginTop: '20px' }}>
          <p>Food creation form will be implemented here...</p>
          <button className="btn" style={{ marginTop: '20px' }}>
            Save Food Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFoodPartner;