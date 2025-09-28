import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

const PartnerRegister = () => {
  const { theme } = useTheme()
  const cardRef = useRef(null)

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

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label className="label">BUSINESS NAME</label>
            <input className="input" type="text" placeholder="Spice Garden Restaurant" />
          </div>

          <div className="row">
            <div className="field">
              <label className="label">CONTACT NAME</label>
              <input className="input" type="text" placeholder="Rajesh Kumar" />
            </div>
            <div className="field">
              <label className="label">PHONE</label>
              <input className="input" type="tel" placeholder="+91 98765 43210" />
            </div>
          </div>

          <div className="field">
            <label className="label">EMAIL</label>
            <input className="input" type="email" placeholder="rajesh@spicegarden.com" />
          </div>

          <div className="field">
            <label className="label">ADDRESS</label>
            <input className="input" type="text" placeholder="123 MG Road, Bangalore" />
            <p className="field-hint">Full address helps customers find you faster</p>
          </div>

          <div className="field">
            <label className="label">CITY</label>
            <input className="input" type="text" placeholder="Bangalore" />
          </div>

          <div className="field">
            <label className="label">PASSWORD</label>
            <input 
              className="input" 
              type="password" 
              placeholder="Create password" 
              autoComplete="new-password"
            />
          </div>

          <button className="btn primary" type="submit">Create Partner Account</button>
          
          <p className="login-link">Already a partner? <Link to="/food-partner/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  )
}

export default PartnerRegister


