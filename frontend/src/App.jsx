import React, { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes'
import { ThemeContext } from './contexts/ThemeContext'

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

        return (
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <BrowserRouter>
              {/* Video Background Section - Four videos with fade transitions */}
              <video 
                className="video-background video-1" 
                autoPlay 
                loop 
                muted 
                playsInline
              >
                <source src="/videos/6829356-uhd_3840_2160_25fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <video 
                className="video-background video-2" 
                autoPlay 
                loop 
                muted 
                playsInline
              >
                <source src="/videos/4667165-uhd_4096_2160_25fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <video 
                className="video-background video-3" 
                autoPlay 
                loop 
                muted 
                playsInline
              >
                <source src="/videos/3196094-uhd_3840_2160_25fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <video 
                className="video-background video-4" 
                autoPlay 
                loop 
                muted 
                playsInline
              >
                <source src="/videos/8849057-uhd_3840_2160_30fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="theme-toggle" onClick={toggleTheme}>
                {theme === 'light' ? '🌙' : '☀️'}
              </div>
              <AppRoutes />
            </BrowserRouter>
          </ThemeContext.Provider>
        )
}

export default App
