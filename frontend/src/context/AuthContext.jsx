import React, { createContext, useContext, useState, useEffect } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount — check if session still valid
  useEffect(() => {
    client.get('/auth/me')
      .then(res => setUser(res.data.data))
      .catch(() => {
        setUser(null)
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password })
    const userData = res.data.data
    if (userData && userData.token) {
      localStorage.setItem('token', userData.token)
    }
    setUser(userData)
    return res.data
  }

  const logout = async () => {
    try {
      await client.post('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
