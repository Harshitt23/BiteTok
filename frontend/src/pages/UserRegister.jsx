import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const UserRegister = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [isFoodPartner, setIsFoodPartner] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  })
  const [partnerFormData, setPartnerFormData] = useState({
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
    if (isFoodPartner) {
      setPartnerFormData(prev => ({
        ...prev,
        [name]: value
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = isFoodPartner ? '/api/auth/food-partner/register' : '/api/auth/user/register'
      const data = isFoodPartner ? partnerFormData : formData
      
      const response = await axios.post(`http://localhost:3000${endpoint}`, data, {
        withCredentials: true
      })
      
      console.log('Registration successful:', response.data)
      console.log('isFoodPartner:', isFoodPartner)
      // Redirect based on user type
      if (isFoodPartner) {
        console.log('Redirecting to /food-partner/create')
        navigate('/food-partner/create')
      } else {
        console.log('Redirecting to /home')
        navigate('/home')
      }
      
    } catch (error) {
      console.error('Registration error:', error)
      if (error.response) {
        // Server responded with error status
        console.error('Error response:', error.response.data)
        alert(`Registration failed: ${error.response.data.message || 'Unknown error'}`)
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request)
        alert('Registration failed: No response from server')
      } else {
        // Something else happened
        console.error('Error:', error.message)
        alert(`Registration failed: ${error.message}`)
      }
    }
  }

  return (
    <div className={`page ${theme}`}>
      <div className="auth-card" ref={cardRef}>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">{isFoodPartner ? 'Join as a food partner to serve customers.' : 'Join as a user to explore and order.'}</p>
        
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
          {!isFoodPartner ? (
            // User Registration Form
            <>
              <div className="row">
                <div className="field">
                  <label className="label" htmlFor="first">First name</label>
                  <input 
                    className="input" 
                    id="first" 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Harshit" 
                    required
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="last">Last name</label>
                  <input 
                    className="input" 
                    id="last" 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Sharma" 
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            // Food Partner Registration Form
            <>
              <div className="field">
                <label className="label" htmlFor="businessName">Business Name</label>
                <input 
                  className="input" 
                  id="businessName" 
                  type="text" 
                  name="businessName"
                  value={partnerFormData.businessName}
                  onChange={handleInputChange}
                  placeholder="Your Restaurant Name" 
                  required
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="contactName">Contact Name</label>
                <input 
                  className="input" 
                  id="contactName" 
                  type="text" 
                  name="contactName"
                  value={partnerFormData.contactName}
                  onChange={handleInputChange}
                  placeholder="Your Name" 
                  required
                />
              </div>
            </>
          )}

          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input 
              className="input" 
              id="email" 
              type="email" 
              name="email"
              value={isFoodPartner ? partnerFormData.email : formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com" 
              required
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="phone">Phone</label>
            <input 
              className="input" 
              id="phone" 
              type="tel" 
              name="phone"
              value={isFoodPartner ? partnerFormData.phone : formData.phone}
              onChange={handleInputChange}
              placeholder="your phone number" 
              required
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="address">Address</label>
            <input 
              className="input" 
              id="address" 
              type="text" 
              name="address"
              value={isFoodPartner ? partnerFormData.address : formData.address}
              onChange={handleInputChange}
              placeholder="your address" 
              required
            />
            <p className="field-hint">{isFoodPartner ? 'Business address' : 'Full address for delivery'}</p>
          </div>

          {isFoodPartner && (
            <div className="field">
              <label className="label" htmlFor="city">City</label>
              <input 
                className="input" 
                id="city" 
                type="text" 
                name="city"
                value={partnerFormData.city}
                onChange={handleInputChange}
                placeholder="Your city" 
                required
              />
            </div>
          )}

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input 
              className="input" 
              id="password" 
              type="password" 
              name="password"
              value={isFoodPartner ? partnerFormData.password : formData.password}
              onChange={handleInputChange}
              placeholder="your password" 
              autoComplete="new-password"
              required
            />
          </div>

          <div className="actions">
            <button className="btn" type="submit">Create account</button>
            <Link to="/user/login" className="btn secondary">Already have an account? Sign in</Link>
          </div>

          <p className="meta">By continuing you agree to our Terms and Privacy Policy.</p>
        </form>
      </div>
    </div>
  )
}

export default UserRegister


