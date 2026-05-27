import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../utils/notifications'
import { validateField, validationRules } from '../utils/validation'
import Logo from '../components/Logo'

export default function Login() {
  const { login } = useAuth()
  const { error: showError, success: showSuccess } = useNotification()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Validation schema
  const validationSchema = {
    email: [validationRules.required, validationRules.email],
    password: [validationRules.required]
  }

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle field blur - validate on blur
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    // Validate field
    const error = validateField(form[name], validationSchema[name], name)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {}
    Object.keys(validationSchema).forEach(field => {
      const error = validateField(form[field], validationSchema[field], field)
      if (error) newErrors[field] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched(Object.keys(validationSchema).reduce((acc, field) => {
        acc[field] = true
        return acc
      }, {}))
      return
    }

    setLoading(true)
    try {
      const res = await login(form.email, form.password)
      if (res.success) {
        showSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          if (res.data.role === 'reclaimer') navigate('/reclaimer')
          else navigate('/')
        }, 500)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.'
      showError(errorMsg)
      setErrors({ general: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Logo size="64" animated={true} />
          <h1>Welcome Back</h1>
          <p>Sign in to your account and classify waste</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="alert alert-error">
              <span>✕</span>
              {errors.general}
            </div>
          )}

          {/* Email Field */}
          <div className={`form-group ${errors.email && touched.email ? 'error' : ''}`}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
            />
            {errors.email && touched.email && (
              <div className="form-error">{errors.email}</div>
            )}
          </div>

          {/* Password Field */}
          <div className={`form-group ${errors.password && touched.password ? 'error' : ''}`}>
            <label htmlFor="password">
              Password
              <span className="password-hint"> (minimum 8 characters)</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && touched.password && (
              <div className="form-error">{errors.password}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            New user? 
            <Link to="/register"> Create account</Link>
          </p>
          <p>
            Recycling company? 
            <Link to="/register-reclaimer"> Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
