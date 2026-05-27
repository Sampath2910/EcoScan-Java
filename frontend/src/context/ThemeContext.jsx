import React, { createContext, useContext, useState, useEffect } from 'react'

/**
 * Theme Context for managing light/dark mode
 */
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // Check for saved theme preference or system preference
  const [theme, setTheme] = useState(() => {
    // 1. Check localStorage
    const savedTheme = localStorage.getItem('theme-preference')
    if (savedTheme) return savedTheme

    // 2. Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }

    // 3. Default to dark (matches current design)
    return 'dark'
  })

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark-mode')
      root.removeAttribute('data-theme')
    } else {
      root.classList.remove('dark-mode')
      root.setAttribute('data-theme', 'light')
    }

    // Save preference
    localStorage.setItem('theme-preference', theme)
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      const saved = localStorage.getItem('theme-preference')
      // Only auto-switch if user hasn't manually set a preference
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
