import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient, endpoints } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  let theme = 'light'; // Default fallback
  try {
    const themeContext = useTheme();
    theme = themeContext.theme || 'light';
  } catch (error) {
    console.error('Theme context error:', error);
    theme = 'light';
  }
  
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [cleanupMessage, setCleanupMessage] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch only this partner's own food items.
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(endpoints.myFood);
        setFoodItems(data.foodItems || []);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/food-partner/login');
          return;
        }
        setCleanupMessage('❌ Could not load your food items.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/food-partner/login');
  };

  const handleDeleteFoodItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await apiClient.delete(endpoints.foodDelete(id));
      setFoodItems(prev => prev.filter(item => item._id !== id));
      setCleanupMessage(`✅ "${name}" deleted successfully!`);
    } catch (error) {
      setCleanupMessage(`❌ Failed to delete "${name}". ${error.uiMessage || ''}`);
    } finally {
      setDeletingId(null);
    }
  };
  
  // Simple fallback if there are any issues
  if (!theme) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        padding: '20px', 
        backgroundColor: '#f5f5f5',
        color: '#333'
      }}>
        <h1>Food Partner Dashboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={`page ${theme}`} style={{ minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        <h1 style={{ color: theme === 'dark' ? '#fff' : '#333' }}>Food Partner Dashboard</h1>
        <p style={{ color: theme === 'dark' ? '#ccc' : '#666' }}>Welcome to your dashboard!</p>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '40px',
          borderRadius: '16px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>🍽️ Food Partner Dashboard</h2>
          <p style={{ margin: '0', fontSize: '1.1rem', opacity: 0.9 }}>
            Manage your restaurant and food items
          </p>
        </div>

        {cleanupMessage && (
          <div style={{ 
            margin: '20px 0', 
            padding: '15px', 
            backgroundColor: cleanupMessage.includes('✅') ? '#d4edda' : '#f8d7da',
            color: cleanupMessage.includes('✅') ? '#155724' : '#721c24',
            borderRadius: '8px',
            border: `1px solid ${cleanupMessage.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            fontSize: '16px',
            fontWeight: '500'
          }}>
            {cleanupMessage}
          </div>
        )}
        
        {/* Action Buttons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '40px' 
        }}>
          <Link 
            to="/food-partner/create" 
            style={{ 
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            ➕ Add New Food Item
          </Link>
          
          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, #f44336, #d32f2f)',
              color: 'white',
              border: 'none',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            🚪 Logout
          </button>
        </div>

        {/* Food Items List */}
        <div style={{ 
          background: theme === 'dark' ? '#2a2a2a' : '#fff',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            margin: '0 0 30px 0', 
            color: theme === 'dark' ? '#fff' : '#333',
            fontSize: '2rem',
            textAlign: 'center'
          }}>
            📦 Your Food Items
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div 
                className="dashboard-spinner"
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #667eea',
                  borderRadius: '50%',
                  margin: '0 auto 20px'
                }}
              ></div>
              <p style={{ color: theme === 'dark' ? '#ccc' : '#666' }}>Loading your food items...</p>
            </div>
          ) : foodItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🍽️</div>
              <h3 style={{ color: theme === 'dark' ? '#fff' : '#333', marginBottom: '10px' }}>
                No food items found
              </h3>
              <p style={{ color: theme === 'dark' ? '#ccc' : '#666', marginBottom: '20px' }}>
                Start by creating your first delicious food item!
              </p>
              <Link 
                to="/food-partner/create" 
                style={{ 
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Create Your First Item
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {foodItems.map((item) => (
                <div 
                  key={item._id} 
                  style={{ 
                    border: `2px solid ${theme === 'dark' ? '#444' : '#e0e0e0'}`,
                    borderRadius: '12px', 
                    padding: '25px',
                    backgroundColor: theme === 'dark' ? '#333' : '#fafafa',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = theme === 'dark' ? '#444' : '#e0e0e0';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, marginRight: '20px' }}>
                      <h3 style={{ 
                        margin: '0 0 15px 0', 
                        color: theme === 'dark' ? '#fff' : '#333',
                        fontSize: '1.5rem',
                        fontWeight: '600'
                      }}>
                        🍽️ {item.name}
                      </h3>
                      <p style={{ 
                        margin: '0 0 15px 0', 
                        color: theme === 'dark' ? '#ccc' : '#666',
                        lineHeight: '1.6',
                        fontSize: '16px'
                      }}>
                        {item.description}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        gap: '20px', 
                        fontSize: '14px',
                        color: theme === 'dark' ? '#999' : '#888'
                      }}>
                        <span>🏪 <strong>Restaurant:</strong> {item.foodPartner?.businessName || 'Unknown'}</span>
                        <span>📅 <strong>Created:</strong> {new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFoodItem(item._id, item.name)}
                      disabled={deletingId === item._id}
                      style={{
                        background: deletingId === item._id ? '#6c757d' : 'linear-gradient(135deg, #dc3545, #c82333)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        cursor: deletingId === item._id ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
                        transition: 'all 0.2s ease',
                        minWidth: '100px'
                      }}
                      onMouseOver={(e) => {
                        if (deletingId !== item._id) {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 6px 16px rgba(220, 53, 69, 0.4)';
                        }
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
                      }}
                    >
                      {deletingId === item._id ? '⏳ Deleting...' : '🗑️ Delete'}
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

export default Dashboard;
