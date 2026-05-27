import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import Navbar from '../components/Navbar'

export default function Upload() {
  const navigate = useNavigate()
  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError('')
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setError('Please select an image first.'); return }
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('wasteImage', file)

    try {
      const res = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data.success) {
        // Pass result via navigation state
        navigate('/results', { state: { result: res.data.data } })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page upload-page">
      <Navbar />
      <div className="page-content">
        <div className="upload-layout">
          {/* Left Panel - Upload Area */}
          <div className="upload-main">
            <div className="page-header upload-header">
              <h1>
                <span className="header-icon">📷</span>
                Scan Your Waste
              </h1>
              <p>Upload a photo and let our AI identify the material type</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="upload-form">
              <div
                className={`upload-zone ${dragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''}`}
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => document.getElementById('fileInput').click()}
              >
                {preview ? (
                  <div className="preview-wrapper">
                    <img src={preview} alt="Preview" className="upload-preview" />
                    <div className="preview-overlay">
                      <div className="preview-overlay-content">
                        <span className="preview-icon">🔄</span>
                        <span>Click to change image</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon-wrapper">
                      <div className="upload-icon">📁</div>
                      <div className="upload-icon-pulse"></div>
                    </div>
                    <h3>Drop your image here</h3>
                    <p>or click to browse from your device</p>
                    <div className="upload-formats">
                      <span className="format-badge">JPG</span>
                      <span className="format-badge">PNG</span>
                      <span className="format-badge">WEBP</span>
                      <span className="format-badge">GIF</span>
                    </div>
                    <small className="upload-limit">Maximum file size: 20MB</small>
                  </div>
                )}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleFile(e.target.files[0])}
                />
              </div>

              <button
                type="submit"
                className={`btn-primary btn-full btn-large upload-btn ${loading ? 'loading' : ''}`}
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    <span>Classify Waste</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel - Info */}
          <div className="upload-sidebar">
            <div className="sidebar-card">
              <h3>
                <span>🎯</span>
                What We Detect
              </h3>
              <div className="detect-list">
                {[
                  { icon: '🧴', label: 'Plastic', color: '#3b82f6' },
                  { icon: '🫙', label: 'Glass', color: '#06b6d4' },
                  { icon: '🥫', label: 'Metal', color: '#8b5cf6' },
                  { icon: '📰', label: 'Paper', color: '#f59e0b' },
                  { icon: '📦', label: 'Cardboard', color: '#10b981' },
                  { icon: '🗑️', label: 'Trash', color: '#ef4444' },
                ].map((item, i) => (
                  <div key={i} className="detect-item" style={{'--item-color': item.color}}>
                    <span className="detect-icon">{item.icon}</span>
                    <span className="detect-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-card tips-card">
              <h3>
                <span>💡</span>
                Tips for Best Results
              </h3>
              <ul className="tips-list">
                <li>
                  <span>📸</span>
                  Take photos in good lighting
                </li>
                <li>
                  <span>🎯</span>
                  Center the waste item in frame
                </li>
                <li>
                  <span>🔍</span>
                  Capture clear, focused images
                </li>
                <li>
                  <span>📏</span>
                  Avoid multiple items in one photo
                </li>
              </ul>
            </div>

            <div className="sidebar-card reward-card">
              <div className="reward-icon">🏆</div>
              <h4>Earn 100 Points</h4>
              <p>Get rewarded for every recyclable item you scan!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
