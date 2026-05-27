import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client from '../api/client'

export default function RegisterReclaimer() {
  const navigate = useNavigate()
  const [form, setForm]   = useState({ companyName: '', email: '', password: '', address: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    setLoading(true)
    try {
      const res = await client.post('/auth/register/reclaimer', form)
      if (res.data.success) {
        setSuccess('Reclaimer account created! Redirecting to login...')
        setTimeout(() => navigate('/login'), 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const f = (field) => ({
    value: form[field],
    onChange: e => setForm({...form, [field]: e.target.value})
  })

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🏭</div>
          <h1>Register as Reclaimer</h1>
          <p>Your company will be able to collect and process waste from users</p>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" placeholder="GreenCycle Industries" {...f('companyName')} required />
          </div>
          <div className="form-group">
            <label>Business Email</label>
            <input type="email" placeholder="contact@company.com" {...f('email')} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Secure password" {...f('password')} required />
          </div>
          <div className="form-group">
            <label>Business Address</label>
            <input type="text" placeholder="Factory / Office address" {...f('address')} />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register Company'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already registered? <Link to="/login">Sign In</Link></p>
          <p>Individual user? <Link to="/register">Create User Account</Link></p>
        </div>
      </div>
    </div>
  )
}
