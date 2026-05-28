import React from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getMediaUrl } from '../api/client'

const LABEL_ICONS = {
  plastic: '🧴', glass: '🫙', metal: '🥫',
  paper: '📰', cardboard: '📦', trash: '🗑️'
}

export default function Results() {
  const { state }  = useLocation()
  const navigate   = useNavigate()
  const result     = state?.result

  if (!result) {
    return (
      <div className="page">
        <Navbar />
        <div className="page-content center">
          <div className="empty-state">
            <div className="empty-icon">🤔</div>
            <h2>No Result Found</h2>
            <p>Please upload an image first to see classification results.</p>
            <Link to="/upload" className="btn-primary">Go to Upload</Link>
          </div>
        </div>
      </div>
    )
  }

  const icon        = LABEL_ICONS[result.label?.toLowerCase()] || '🗑️'
  const isRecyclable = result.isRecyclable
  const label       = result.label ? result.label.charAt(0).toUpperCase() + result.label.slice(1) : 'Unknown'

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        <div className="results-container">
          <h1 className="page-title">🔬 Classification Result</h1>

          {result.error && (
            <div className="alert alert-warning">{result.error}</div>
          )}

          <div className="results-grid">
            {/* Image */}
            <div className="result-image-card">
              <img src={getMediaUrl(result.imageUrl)} alt="Classified waste" className="result-img" />
            </div>

            {/* Result */}
            <div className="result-info-card">
              <div className={`result-label-badge ${isRecyclable ? 'recyclable' : 'non-recyclable'}`}>
                <span className="label-icon">{icon}</span>
                <div>
                  <div className="label-title">{label}</div>
                  <div className="label-sub">{isRecyclable ? '✅ Recyclable' : '❌ Non-Recyclable'}</div>
                </div>
              </div>

              <div className="result-stats">
                <div className="result-stat">
                  <span className="stat-label">Confidence</span>
                  <span className="stat-value">{result.confidence?.toFixed(1)}%</span>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${result.confidence}%` }}></div>
                  </div>
                </div>
                <div className="result-stat">
                  <span className="stat-label">Points Earned</span>
                  <span className="stat-value points">{isRecyclable ? '+100' : '+0'} pts</span>
                </div>
              </div>

              <div className="suggestions">
                <h3>♻️ Recycling Tips</h3>
                <ul>
                  {(result.suggestions || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="result-actions">
                <button onClick={() => navigate('/upload')} className="btn-primary">
                  📷 Scan Another
                </button>
                <Link to="/directory" className="btn-outline">
                  🗺️ Find Recyclers
                </Link>
                <Link to="/dashboard" className="btn-outline">
                  📊 Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
