import React, { useState, useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes'
import { ThemeContext } from './contexts/ThemeContext'

function AppContent() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })
  
  const location = useLocation()
  
  // Show video background only on auth pages (login/register)
  const showVideoBackground = location.pathname.includes('/user/login') || location.pathname.includes('/user/register') || location.pathname.includes('/food-partner/login') || location.pathname.includes('/food-partner/register')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Video Background Section - Only show on auth pages */}
      {showVideoBackground && (
        <>
          <video 
            className="video-background video-1" 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/videos/horizontal/6829356-uhd_3840_2160_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <video 
            className="video-background video-2" 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/videos/horizontal/4667165-uhd_4096_2160_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <video 
            className="video-background video-3" 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/videos/horizontal/3196094-uhd_3840_2160_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <video 
            className="video-background video-4" 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/videos/horizontal/8849057-uhd_3840_2160_30fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      )}
      <div className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </div>
      <AppRoutes />
    </ThemeContext.Provider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
