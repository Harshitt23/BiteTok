import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

const UserLogin = () => {
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
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Enter your email and password</p>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input 
              className="input" 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input 
              className="input" 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              autoComplete="current-password"
            />
          </div>

          <div className="actions">
            <button className="btn" type="submit">Log in</button>
            <Link to="/user/register" className="btn secondary">Don't have an account? Register</Link>
          </div>

          <p className="meta">Forgot password?</p>
        </form>
      </div>
    </div>
  )
}

export default UserLogin


