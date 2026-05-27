import React, { useEffect, useState } from 'react'
import client from '../api/client'
import Navbar from '../components/Navbar'

export default function ReclaimersPortal() {
  const [uploads, setUploads]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [collecting, setCollecting] = useState(null)
  const [error, setError]         = useState('')

  useEffect(() => {
    client.get('/reclaimer/uploads')
      .then(res => setUploads(res.data.data || []))
      .catch(() => setError('Failed to load uploads.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCollect = async (id) => {
    setCollecting(id)
    try {
      const res = await client.post(`/reclaimer/collect/${id}`)
      if (res.data.success) {
        setUploads(prev => prev.map(u =>
          u.id === id
            ? { ...u, status: 'Collected', collectedBy: res.data.data.collectedBy }
            : u
        ))
      }
    } catch {
      setError('Failed to mark as collected.')
    } finally {
      setCollecting(null)
    }
  }

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>Reclaimer Portal</h1>
          <p>View and collect waste items submitted by users in your area</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="center"><div className="spinner"></div></div>
        ) : uploads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No uploads to process</h3>
            <p>Check back later when users submit waste items.</p>
          </div>
        ) : (
          <div className="reclaimer-table-wrapper">
            <table className="reclaimer-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Material</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Collected By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map(u => (
                  <tr key={u.id}>
                    <td>
                      <img src={u.imageUrl} alt={u.label} className="table-thumb" />
                    </td>
                    <td>
                      <span className="badge badge-green">{u.label}</span>
                    </td>
                    <td>{u.username}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${u.status === 'Collected' ? 'badge-green' : 'badge-yellow'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>{u.collectedBy || '—'}</td>
                    <td>
                      {u.status !== 'Collected' ? (
                        <button
                          className="btn-primary btn-sm"
                          disabled={collecting === u.id}
                          onClick={() => handleCollect(u.id)}
                        >
                          {collecting === u.id ? 'Processing...' : '✅ Collect'}
                        </button>
                      ) : (
                        <span className="collected-tag">✅ Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
