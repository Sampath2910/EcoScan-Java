import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

  // Navigation items grouped by category
  const mainNav = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Scan' },
    { path: '/dashboard', label: 'Dashboard' },
  ]

  const discoverNav = [
    { path: '/directory', label: 'Recyclers' },
    { path: '/recycled-products', label: 'Products' },
  ]

  const infoNav = [
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo Brand */}
        <Link to="/" className="nav-brand">
          <Logo size="48" animated={true} />
          <div className="brand-text">
            <span className="brand-name">EcoScan</span>
            <span className="brand-tagline">Smart Waste Classification</span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button 
          className={`nav-toggle ${menuOpen ? 'open' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          {/* Main Navigation */}
          <div className="nav-section">
            <span className="nav-section-label">Main</span>
            {mainNav.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={isActive(item.path)}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Discover Navigation */}
          <div className="nav-section">
            <span className="nav-section-label">Discover</span>
            {discoverNav.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={isActive(item.path)}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Info Navigation */}
          <div className="nav-section">
            <span className="nav-section-label">Info</span>
            {infoNav.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={isActive(item.path)}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Reclaimer Portal (conditional) */}
          {user?.role === 'reclaimer' && (
            <div className="nav-section">
              <span className="nav-section-label">Business</span>
              <Link 
                to="/reclaimer" 
                className={isActive('/reclaimer')}
                onClick={() => setMenuOpen(false)}
              >
                Reclaimer Portal
              </Link>
            </div>
          )}

          {/* User Actions */}
          <div className="nav-user-section">
            {/* Theme Toggle */}
            <ThemeToggle className="nav-theme-toggle" />

            {user ? (
              <>
                <div className="nav-user-info">
                  <div className="user-avatar">
                    {user.username?.charAt(0).toUpperCase() || '👤'}
                  </div>
                  <div className="user-details">
                    <span className="user-name">{user.username}</span>
                    <span className="user-role">{user.role || 'User'}</span>
                  </div>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <div className="nav-auth">
                <Link to="/login" className="btn-login">Sign In</Link>
                <Link to="/register" className="btn-register">Get Started</Link>
              </div>
            )}
          </div>
        </div>

        {/* Overlay for mobile */}
        {menuOpen && (
          <div className="nav-overlay" onClick={() => setMenuOpen(false)}></div>
        )}
      </div>
    </nav>
  )
}
