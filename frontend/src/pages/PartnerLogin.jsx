import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

const PartnerLogin = () => {
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
        <h1 className="auth-title">Partner sign in</h1>
        <p className="auth-subtitle">Access your partner dashboard.</p>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label className="label" htmlFor="email">Business email</label>
            <input className="input" id="email" type="email" placeholder="owner@brand.com" />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input className="input" id="password" type="password" placeholder="••••••••" />
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


