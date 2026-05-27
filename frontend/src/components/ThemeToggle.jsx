import React from 'react'
import { useTheme } from '../context/ThemeContext'

/**
 * Theme Toggle Component
 * Allows users to switch between light and dark modes
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
      type="button"
    >
      {theme === 'dark' ? (
        <span className="theme-icon">☀️</span>
      ) : (
        <span className="theme-icon">🌙</span>
      )}
      <span className="theme-label">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}
