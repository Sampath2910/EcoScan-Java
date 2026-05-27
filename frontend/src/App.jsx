import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Toast from './components/Toast'

import Login            from './pages/Login'
import RegisterUser     from './pages/RegisterUser'
import RegisterReclaimer from './pages/RegisterReclaimer'
import Home             from './pages/Home'
import Dashboard        from './pages/Dashboard'
import Upload           from './pages/Upload'
import Results          from './pages/Results'
import Directory        from './pages/Directory'
import ReclaimersPortal from './pages/ReclaimersPortal'
import RecycledProducts from './pages/RecycledProducts'
import About            from './pages/About'
import Contact          from './pages/Contact'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login"               element={<Login />} />
              <Route path="/register"            element={<RegisterUser />} />
              <Route path="/register-reclaimer"  element={<RegisterReclaimer />} />

              {/* Protected routes — any logged-in user */}
              <Route path="/"                 element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/dashboard"        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/upload"           element={<ProtectedRoute><Upload /></ProtectedRoute>} />
              <Route path="/results"          element={<ProtectedRoute><Results /></ProtectedRoute>} />
              <Route path="/directory"        element={<ProtectedRoute><Directory /></ProtectedRoute>} />
              <Route path="/recycled-products" element={<ProtectedRoute><RecycledProducts /></ProtectedRoute>} />
              <Route path="/about"            element={<ProtectedRoute><About /></ProtectedRoute>} />
              <Route path="/contact"          element={<ProtectedRoute><Contact /></ProtectedRoute>} />

              {/* Protected route — reclaimer only */}
              <Route path="/reclaimer"        element={<ProtectedRoute role="reclaimer"><ReclaimersPortal /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        
        {/* Global Toast Notifications */}
        <Toast />
      </ThemeProvider>
    </ErrorBoundary>
  )
}
