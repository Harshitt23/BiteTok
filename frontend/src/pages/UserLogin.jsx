import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const UserLogin = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [isFoodPartner, setIsFoodPartner] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      card.style.setProperty('--mouse-x', `${x}%`)
      card.style.setProperty('--mouse-y', `${y}%`)
    }

    card.addEventListener('mousemove', handleMouseMove)
    return () => card.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = isFoodPartner ? '/api/auth/food-partner/login' : '/api/auth/user/login'
      
      const response = await axios.post(`http://localhost:3000${endpoint}`, formData, {
        withCredentials: true
      })
      
      console.log('Login successful:', response.data)
      console.log('isFoodPartner:', isFoodPartner)
      // Redirect based on user type
      if (isFoodPartner) {
        console.log('Redirecting to /food-partner/home')
        navigate('/food-partner/home')
      } else {
        console.log('Redirecting to /home')
        navigate('/home')
      }
      
    } catch (error) {
      console.error('Login error:', error)
      if (error.response) {
        console.error('Error response:', error.response.data)
        alert(`Login failed: ${error.response.data.message || 'Unknown error'}`)
      } else if (error.request) {
        console.error('No response received:', error.request)
        alert('Login failed: No response from server')
      } else {
        console.error('Error:', error.message)
        alert(`Login failed: ${error.message}`)
      }
    }
  }
  
  return (
    <div className={`page ${theme}`}>
      <div className="auth-card" ref={cardRef}>
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">{isFoodPartner ? 'Enter your business email and password' : 'Enter your email and password'}</p>
        
        {/* Switch between User and Food Partner */}
        <div className="switch-container" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: !isFoodPartner ? '#ffa000' : '#666' }}>User</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isFoodPartner}
              onChange={(e) => setIsFoodPartner(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
          <span style={{ color: isFoodPartner ? '#ffa000' : '#666' }}>Food Partner</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="email">{isFoodPartner ? 'Business Email' : 'Email'}</label>
            <input 
              className="input" 
              id="email" 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={isFoodPartner ? "owner@brand.com" : "Enter your email"} 
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input 
              className="input" 
              id="password" 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password" 
              autoComplete="current-password"
              required
            />
          </div>

          <div className="actions">
            <button className="btn" type="submit">Log in</button>
            <Link to="/user/register" className="btn secondary">Don't have an account? Register</Link>
            <Link to="/food-partner/all" className="btn secondary" style={{ 
              marginTop: '10px', 
              background: 'linear-gradient(135deg, rgba(108, 117, 125, 0.8), rgba(73, 80, 87, 0.9))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white', 
              padding: '12px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'block',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
              e.target.style.background = 'linear-gradient(135deg, rgba(108, 117, 125, 0.9), rgba(73, 80, 87, 1))';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              e.target.style.background = 'linear-gradient(135deg, rgba(108, 117, 125, 0.8), rgba(73, 80, 87, 0.9))';
            }}
            >View All Food Partners</Link>
          </div>

          <p className="meta">Forgot password?</p>
        </form>
      </div>
    </div>
  )
}

export default UserLogin


