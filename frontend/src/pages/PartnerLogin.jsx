import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PartnerLogin = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const cardRef = useRef(null);
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
      const response = await axios.post('http://localhost:3000/api/auth/food-partner/login', formData, {
        withCredentials: true
      })
      
      console.log('Login successful:', response.data)
      navigate('/food-partner/create')
      
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
        <h1 className="auth-title">Partner sign in</h1>
        <p className="auth-subtitle">Access your partner dashboard.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="email">Business email</label>
            <input 
              className="input" 
              id="email" 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="owner@brand.com" 
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
              placeholder="••••••••" 
              required
            />
          </div>

          <div className="actions">
            <button className="btn" type="submit">Sign in</button>
            <Link to="/food-partner/register" className="btn secondary">New partner? Create account</Link>
          </div>

          <p className="meta">Need help? Contact partner support after sign up.</p>
        </form>
      </div>
    </div>
  )
}

export default PartnerLogin


