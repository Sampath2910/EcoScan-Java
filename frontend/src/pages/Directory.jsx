import React, { useEffect, useState } from 'react'
import client from '../api/client'
import Navbar from '../components/Navbar'

export default function Directory() {
  const [recyclers, setRecyclers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [typeFilter, setType]     = useState('')
  const [cityFilter, setCity]     = useState('')
  const [selected, setSelected]   = useState(null)

  const fetch = async () => {
    setLoading(true)
    try {
      const params = {}
      if (typeFilter) params.type = typeFilter
      if (cityFilter) params.city = cityFilter
      const res = await client.get('/directory', { params })
      setRecyclers(res.data.data || [])
    } catch {
      setRecyclers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetch()
  }

  const WASTE_TYPES = ['Plastic', 'Glass', 'Metal', 'Paper', 'Cardboard', 'E-Waste']

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>🗺️ Recycler Directory</h1>
          <p>Find recycling centers near you in Hyderabad and across India</p>
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} className="filter-bar">
          <select value={typeFilter} onChange={e => setType(e.target.value)}>
            <option value="">All Waste Types</option>
            {WASTE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="text"
            placeholder="Search by city..."
            value={cityFilter}
            onChange={e => setCity(e.target.value)}
          />
          <button type="submit" className="btn-primary">🔍 Search</button>
          <button type="button" className="btn-outline" onClick={() => {
            setType(''); setCity('')
            setTimeout(fetch, 0)
          }}>Clear</button>
        </form>

        {loading ? (
          <div className="center"><div className="spinner"></div></div>
        ) : (
          <div className="directory-layout">
            {/* List */}
            <div className="recycler-list">
              {recyclers.length === 0 ? (
                <div className="empty-state">
                  <p>No recyclers found for your search.</p>
                </div>
              ) : recyclers.map(r => (
                <div
                  key={r.id}
                  className={`recycler-card ${selected?.id === r.id ? 'selected' : ''}`}
                  onClick={() => setSelected(r)}
                >
                  <div className="recycler-info">
                    <h4>{r.name}</h4>
                    <p>📍 {r.city}</p>
                    <span className="recycler-type-badge">{r.type}</span>
                  </div>
                  <div className="recycler-coords">
                    <small>{r.lat.toFixed(4)}, {r.lng.toFixed(4)}</small>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="map-panel">
              {selected ? (
                <div className="map-detail">
                  <h3>📍 {selected.name}</h3>
                  <p><strong>City:</strong> {selected.city}</p>
                  <p><strong>Waste Type:</strong> {selected.type}</p>
                  <p><strong>Coordinates:</strong> {selected.lat}, {selected.lng}</p>
                  <a
                    href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    🗺️ Open in Google Maps
                  </a>
                  <iframe
                    title="map"
                    className="google-map"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${selected.lat},${selected.lng}&z=15&output=embed`}
                  ></iframe>
                </div>
              ) : (
                <div className="map-placeholder">
                  <div className="map-icon">🗺️</div>
                  <p>Select a recycler to view on map</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
