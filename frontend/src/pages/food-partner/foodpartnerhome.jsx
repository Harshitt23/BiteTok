import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FoodPartnerHome = () => {
  const { theme } = useTheme();
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  
  // Fetch food items on component mount
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/food/', {
          withCredentials: true
        });
        
        if (response.data && response.data.foodItems) {
          setFoodItems(response.data.foodItems);
        }
      } catch (error) {
        console.error('Error fetching food items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);
  
  const handleCleanupDuplicates = async () => {
    try {
      setIsCleaning(true);
      setCleanupMessage('');
      
      const response = await axios.delete('http://localhost:3000/api/food/cleanup', {
        withCredentials: true
      });
      
      setCleanupMessage(`✅ Cleanup completed! ${response.data.duplicatesDeleted} duplicates removed, ${response.data.uniqueItems} unique items kept.`);
      
    } catch (error) {
      console.error('Error cleaning duplicates:', error);
      setCleanupMessage('❌ Failed to clean duplicates. Please try again.');
    } finally {
      setIsCleaning(false);
    }
  };

  const handleDeleteFoodItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      
      const response = await axios.delete(`http://localhost:3000/api/food/${id}`, {
        withCredentials: true
      });
      
      // Remove the deleted item from the list
      setFoodItems(prev => prev.filter(item => item._id !== id));
      
      setCleanupMessage(`✅ "${name}" deleted successfully!`);
      
    } catch (error) {
      console.error('Error deleting food item:', error);
      setCleanupMessage(`❌ Failed to delete "${name}". Please try again.`);
    } finally {
      setDeletingId(null);
    }
  };
  
  return (
    <div className={`page ${theme}`}>
      <div className="container">
        <h1>Food Partner Dashboard</h1>
        <p>Welcome to your partner dashboard! Manage your restaurant and orders here.</p>
        
        {cleanupMessage && (
          <div style={{ 
            margin: '20px 0', 
            padding: '10px', 
            backgroundColor: cleanupMessage.includes('✅') ? '#d4edda' : '#f8d7da',
            color: cleanupMessage.includes('✅') ? '#155724' : '#721c24',
            borderRadius: '5px',
            border: `1px solid ${cleanupMessage.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {cleanupMessage}
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <Link to="/food-partner/create" className="btn" style={{ marginRight: '10px', textDecoration: 'none' }}>
            Add New Food Item
          </Link>
          <button 
            className="btn secondary" 
            style={{ marginRight: '10px' }}
            onClick={handleCleanupDuplicates}
            disabled={isCleaning}
          >
            {isCleaning ? 'Cleaning...' : 'Clean Duplicates'}
          </button>
          <button className="btn secondary" style={{ marginRight: '10px' }}>
            View Orders
          </button>
          <Link to="/food-partner/login" className="btn secondary" style={{ textDecoration: 'none' }}>
            Logout
          </Link>
        </div>

        {/* Food Items List */}
        <div style={{ marginTop: '40px' }}>
          <h2>Your Food Items</h2>
          {loading ? (
            <p>Loading your food items...</p>
          ) : foodItems.length === 0 ? (
            <p>No food items found. <Link to="/food-partner/create">Create your first food item</Link>!</p>
          ) : (
            <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
              {foodItems.map((item) => (
                <div 
                  key={item._id} 
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    padding: '20px',
                    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 10px 0', color: theme === 'dark' ? '#fff' : '#333' }}>
                        {item.name}
                      </h3>
                      <p style={{ margin: '0 0 10px 0', color: theme === 'dark' ? '#ccc' : '#666' }}>
                        {item.description}
                      </p>
                      <p style={{ margin: '0', fontSize: '14px', color: theme === 'dark' ? '#999' : '#888' }}>
                        Restaurant: {item.foodPartner?.businessName || 'Unknown'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteFoodItem(item._id, item.name)}
                      disabled={deletingId === item._id}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        cursor: deletingId === item._id ? 'not-allowed' : 'pointer',
                        opacity: deletingId === item._id ? 0.6 : 1
                      }}
                    >
                      {deletingId === item._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerHome;
