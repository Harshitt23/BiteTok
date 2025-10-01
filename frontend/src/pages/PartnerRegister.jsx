import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import axios from 'axios'
import api from '../config/api'
import { useNavigate } from 'react-router-dom'


const PartnerRegister = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    password: ''
  })

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
      const response = await axios.post(`${api.baseURL}${api.endpoints.partnerRegister}`, formData, {
        withCredentials: true
      })
      
      console.log('Registration successful:', response.data)
      navigate('/food-partner/home')
      
    } catch (error) {
      console.error('Registration error:', error)
      if (error.response) {
        console.error('Error response:', error.response.data)
        alert(`Registration failed: ${error.response.data.message || 'Unknown error'}`)
      } else if (error.request) {
        console.error('No response received:', error.request)
        alert('Registration failed: No response from server')
      } else {
        console.error('Error:', error.message)
        alert(`Registration failed: ${error.message}`)
      }
    }
  }

  return (
    <div className={`page ${theme}`}>
      <div className="auth-card" ref={cardRef}>
        <h1 className="auth-title">Partner sign up</h1>
        <p className="auth-subtitle">Grow your business with our platform.</p>
        
        <div className="switch-buttons">
          <Link to="/user/register" className="switch-btn">User</Link>
          <span className="switch-separator">•</span>
          <span className="switch-btn active">Food partner</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">BUSINESS NAME</label>
            <input 
              className="input" 
              type="text" 
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder="Spice Garden Restaurant" 
              required
            />
          </div>

          <div className="row">
            <div className="field">
              <label className="label">CONTACT NAME</label>
              <input 
                className="input" 
                type="text" 
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                placeholder="Rajesh Kumar" 
                required
              />
            </div>
            <div className="field">
              <label className="label">PHONE</label>
              <input 
                className="input" 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210" 
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">EMAIL</label>
            <input 
              className="input" 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="rajesh@spicegarden.com" 
              required
            />
          </div>

          <div className="field">
            <label className="label">ADDRESS</label>
            <input 
              className="input" 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 MG Road, Bangalore" 
              required
            />
            <p className="field-hint">Full address helps customers find you faster</p>
          </div>

          <div className="field">
            <label className="label">CITY</label>
            <input 
              className="input" 
              type="text" 
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Bangalore" 
              required
            />
          </div>

          <div className="field">
            <label className="label">PASSWORD</label>
            <input 
              className="input" 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create password" 
              autoComplete="new-password"
              required
            />
          </div>

          <button className="btn primary" type="submit">Create Partner Account</button>
          
          <p className="login-link">Already a partner? <Link to="/food-partner/login">Sign in</Link></p>
          
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
        </form>
      </div>
    </div>
  )
}

export default PartnerRegister


