import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client from '../api/client'

export default function RegisterUser() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '', village: '', pincode: ''
  })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    setLoading(true)
    try {
      const res = await client.post('/auth/register/user', form)
      if (res.data.success) {
        setSuccess('Account created! Redirecting to login...')
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
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="auth-logo">♻️</div>
          <h1>Create User Account</h1>
          <p>Join EcoScan and start scanning waste for rewards</p>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" {...f('name')} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" {...f('email')} required />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" {...f('password')} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+91 9876543210" {...f('phone')} />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input type="text" placeholder="500001" {...f('pincode')} />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" placeholder="Street address" {...f('address')} />
          </div>
          <div className="form-group">
            <label>Village / Area</label>
            <input type="text" placeholder="Your area or village" {...f('village')} />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
          <p>Are you a recycling company? <Link to="/register-reclaimer">Register as Reclaimer</Link></p>
        </div>
      </div>
    </div>
  )
}
