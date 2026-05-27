import React, { useEffect, useState } from 'react'
import client from '../api/client'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    client.get('/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><Navbar /><div className="page-content center"><div className="spinner"></div></div></div>

  const { metrics, uploads } = data || {}

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>My Dashboard</h1>
          <p>Track your recycling history and environmental impact</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📂</div>
            <div className="metric-value">{metrics?.totalUploads ?? 0}</div>
            <div className="metric-label">Total Scans</div>
          </div>
          <div className="metric-card recyclable">
            <div className="metric-icon">♻️</div>
            <div className="metric-value">{metrics?.recyclableCount ?? 0}</div>
            <div className="metric-label">Recyclable Items</div>
          </div>
          <div className="metric-card trash">
            <div className="metric-icon">🗑️</div>
            <div className="metric-value">{metrics?.trashCount ?? 0}</div>
            <div className="metric-label">Trash Items</div>
          </div>
          <div className="metric-card rewards">
            <div className="metric-icon">🏆</div>
            <div className="metric-value">{metrics?.rewardsEarned ?? 0}</div>
            <div className="metric-label">Points Earned</div>
          </div>
        </div>

        {/* Upload History */}
        <div className="history-section">
          <div className="history-header">
            <h2>Recent Scans</h2>
            <Link to="/upload" className="btn-primary btn-sm">+ Scan New</Link>
          </div>

          {(!uploads || uploads.length === 0) ? (
            <div className="empty-state">
              <div className="empty-icon">📷</div>
              <h3>No scans yet</h3>
              <p>Upload your first waste item to get started!</p>
              <Link to="/upload" className="btn-primary">Scan Waste Now</Link>
            </div>
          ) : (
            <div className="uploads-grid">
              {uploads.map(u => (
                <div key={u.id} className="upload-card">
                  <img src={u.imageUrl} alt={u.materialLabel} className="upload-thumb" />
                  <div className="upload-info">
                    <div className="upload-label">
                      <span className={`badge ${u.isRecyclable ? 'badge-green' : 'badge-red'}`}>
                        {u.materialLabel}
                      </span>
                      <span className={`badge ${u.isRecyclable ? 'badge-green' : 'badge-red'}`}>
                        {u.isRecyclable ? '♻️ Recyclable' : '❌ Trash'}
                      </span>
                    </div>
                    <p className="upload-time">{new Date(u.time).toLocaleDateString()}</p>
                    <p className="upload-status">Status: <strong>{u.status}</strong></p>
                    {u.suggestions?.slice(0,1).map((s,i) => (
                      <p key={i} className="upload-tip">💡 {s}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
