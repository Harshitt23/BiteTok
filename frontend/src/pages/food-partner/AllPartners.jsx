import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../../config/api';

const AllPartners = () => {
  const { theme } = useTheme();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api.baseURL}${api.endpoints.allPartners}`, {
          withCredentials: true
        });
        
        if (response.data && response.data.partners) {
          setPartners(response.data.partners);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
        setError('Failed to load food partners');
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className={`page ${theme}`} style={{ 
      minHeight: '100vh',
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>
      
      <div className="container" style={{ 
        position: 'relative',
        zIndex: 1,
        padding: '40px 20px'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          animation: 'fadeInDown 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '15px',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🍽️ Food Partners
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '30px',
            fontWeight: '300'
          }}>
            Discover amazing restaurants and food partners
          </p>
          
          {/* Navigation buttons */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/food-partner/register" 
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.2))';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))';
              }}
            >
              ✨ Join as Partner
            </Link>
            <Link 
              to="/home" 
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.2))';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))';
              }}
            >
              🏠 Back to Home
            </Link>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <div style={{
              display: 'inline-block',
              width: '60px',
              height: '60px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></div>
            <p style={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '1.1rem',
              fontWeight: '500'
            }}>
              Loading amazing food partners...
            </p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            animation: 'shake 0.5s ease-in-out'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(220,53,69,0.2), rgba(220,53,69,0.1))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(220,53,69,0.3)',
              borderRadius: '20px',
              padding: '40px',
              color: 'white',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Oops! Something went wrong</h3>
              <p style={{ opacity: 0.8 }}>{error}</p>
            </div>
          </div>
        ) : partners.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '25px',
              padding: '60px 40px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{ 
                fontSize: '5rem', 
                marginBottom: '30px',
                animation: 'bounce 2s infinite'
              }}>👥</div>
              <h3 style={{ 
                color: 'white', 
                fontSize: '1.8rem',
                marginBottom: '15px',
                fontWeight: '600'
              }}>
                No Food Partners Yet
              </h3>
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '1.1rem',
                marginBottom: '30px',
                lineHeight: '1.6'
              }}>
                Be the first to join our amazing community of food partners!
              </p>
              <Link 
                to="/food-partner/register"
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                🚀 Register Now
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            {partners.map((partner, index) => (
              <div 
                key={partner._id}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  padding: '30px',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))';
                }}
              >
                {/* Decorative elements */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '100px',
                  height: '100px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent)',
                  borderRadius: '50%',
                  animation: 'pulse 3s ease-in-out infinite'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      marginRight: '15px',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                    }}>
                      🏪
                    </div>
                    <h3 style={{
                      color: 'white',
                      fontSize: '1.4rem',
                      fontWeight: '700',
                      margin: 0,
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                      {partner.businessName}
                    </h3>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '14px'
                    }}>
                      <span style={{ marginRight: '8px', fontSize: '16px' }}>👤</span>
                      <strong>Contact:</strong> {partner.contactName}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '14px'
                    }}>
                      <span style={{ marginRight: '8px', fontSize: '16px' }}>📧</span>
                      <strong>Email:</strong> {partner.email}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '14px'
                    }}>
                      <span style={{ marginRight: '8px', fontSize: '16px' }}>📞</span>
                      <strong>Phone:</strong> {partner.phone}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '14px'
                    }}>
                      <span style={{ marginRight: '8px', fontSize: '16px' }}>📍</span>
                      <strong>Address:</strong> {partner.address}, {partner.city}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '15px',
                    borderTop: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <div style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      📅 Joined: {new Date(partner.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '11px',
                      fontWeight: '600',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      VERIFIED
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default AllPartners;
