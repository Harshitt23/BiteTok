import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

const UserRegister = () => {
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
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join as a user to explore and order.</p>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="row">
            <div className="field">
              <label className="label" htmlFor="first">First name</label>
              <input className="input" id="first" type="text" placeholder="Jane" />
            </div>
            <div className="field">
              <label className="label" htmlFor="last">Last name</label>
              <input className="input" id="last" type="text" placeholder="Doe" />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input className="input" id="email" type="email" placeholder="jane@example.com" />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input 
              className="input" 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              autoComplete="new-password"
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


