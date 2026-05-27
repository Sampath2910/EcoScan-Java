import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🌍</span>
            AI-Powered Waste Classification
          </div>
          <h1 className="hero-title">
            Scan. Classify. <span className="highlight">Recycle.</span>
          </h1>
          <p className="hero-subtitle">
            Transform the way you handle waste. Upload a photo of any item and let our 
            advanced AI instantly identify the material and guide you to the nearest 
            recycling center. Make a difference, one scan at a time.
          </p>
          <div className="hero-actions">
            <Link to="/upload" className="btn-primary btn-large">
              <span>📷</span>
              Scan Waste Now
            </Link>
            <Link to="/dashboard" className="btn-outline btn-large">
              <span>📊</span>
              View Dashboard
            </Link>
          </div>
          {user && (
            <div className="hero-welcome">
              <span>👋</span>
              Welcome back, <strong>{user.username}</strong>! Ready to recycle?
            </div>
          )}
        </div>

        <div className="hero-visual">
          {/* Recycling Illustration */}
          <div className="hero-illustration-container">
            <img 
              src="/images/recycling-illustration.png" 
              alt="People recycling together" 
              className="hero-illustration-img"
            />
            
            {/* Floating stat cards around illustration */}
            <div className="floating-stat stat-left">
              <span className="stat-icon-small">🌍</span>
              <span className="stat-text">Eco-Friendly</span>
            </div>
            <div className="floating-stat stat-right">
              <span className="stat-icon-small">🤖</span>
              <span className="stat-text">AI Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🗂️</div>
            <div className="stat-number">6</div>
            <div className="stat-label">Waste Categories</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-number">95%</div>
            <div className="stat-label">AI Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏙️</div>
            <div className="stat-number">15+</div>
            <div className="stat-label">Recycling Centers</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌱</div>
            <div className="stat-number">100</div>
            <div className="stat-label">Points Per Scan</div>
          </div>
        </div>
      </section>

      {/* Features Section - NEW */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Why Choose EcoScan?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{'--icon-color': 'var(--primary)'}}>🤖</div>
              <h3>AI-Powered</h3>
              <p>Advanced deep learning models trained on thousands of waste images for accurate classification.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{'--icon-color': 'var(--accent-blue)'}}>⚡</div>
              <h3>Instant Results</h3>
              <p>Get classification results in seconds. No waiting, no complicated forms to fill out.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{'--icon-color': 'var(--accent-purple)'}}>🗺️</div>
              <h3>Find Centers</h3>
              <p>Locate nearby recycling facilities with our interactive map and detailed information.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{'--icon-color': 'var(--accent-orange)'}}>🏆</div>
              <h3>Earn Rewards</h3>
              <p>Collect points for every recyclable item and track your environmental impact over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">📸</div>
            <h3>Upload Photo</h3>
            <p>Take or upload a clear photo of any waste item — plastic, glass, paper, metal, and more.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">🤖</div>
            <h3>AI Classifies</h3>
            <p>Our ResNet-18 deep learning model identifies the material type with high accuracy.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">📋</div>
            <h3>Get Guidance</h3>
            <p>Receive personalized recycling instructions and find the nearest recycling center.</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <div className="step-icon">🏆</div>
            <h3>Earn Rewards</h3>
            <p>Collect 100 points for each recyclable item and track your environmental impact.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2>Waste Categories We Detect</h2>
        <div className="categories-grid">
          {[
            { icon: '🧴', label: 'Plastic',   color: '#3b82f6' },
            { icon: '🫙', label: 'Glass',     color: '#06b6d4' },
            { icon: '🥫', label: 'Metal',     color: '#8b5cf6' },
            { icon: '📰', label: 'Paper',     color: '#f59e0b' },
            { icon: '📦', label: 'Cardboard', color: '#10b981' },
            { icon: '🗑️', label: 'Trash',     color: '#ef4444' },
          ].map(cat => (
            <div className="category-chip" key={cat.label}
                 style={{'--chip-color': cat.color}}>
              <span>{cat.icon}</span>
              {cat.label}
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} EcoScan — Built with ♻️ for a greener tomorrow</p>
      </footer>
    </div>
  )
}
