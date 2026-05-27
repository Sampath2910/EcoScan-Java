import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? (import.meta.env.VITE_API_URL.endsWith('/') ? `${import.meta.env.VITE_API_URL}api` : `${import.meta.env.VITE_API_URL}/api`)
    : '/api',
  withCredentials: true,  // send session cookies cross-origin
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000  // 30 second timeout
})

/**
 * Request Interceptor
 * - Add request timestamp for debugging
 * - Add loading state
 */
client.interceptors.request.use(
  config => {
    // Add timestamp for monitoring
    config.metadata = { startTime: Date.now() }
    
    // Emit loading event (can be used for global loading indicators)
    window.dispatchEvent(new CustomEvent('api:request:start', { detail: config }))
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * - Handle different status codes
 * - Log performance metrics
 * - Show error notifications
 */
client.interceptors.response.use(
  res => {
    // Log request duration for performance monitoring
    if (res.config?.metadata?.startTime) {
      const duration = Date.now() - res.config.metadata.startTime
      console.debug(`API Response: ${res.config.method?.toUpperCase()} ${res.config.url} - ${duration}ms`)
    }

    // Emit success event
    window.dispatchEvent(new CustomEvent('api:request:end', { detail: res }))

    return res
  },
  err => {
    // Log request duration even on error
    if (err.config?.metadata?.startTime) {
      const duration = Date.now() - err.config.metadata.startTime
      console.debug(`API Error: ${err.config.method?.toUpperCase()} ${err.config.url} - ${duration}ms`)
    }

    // Emit error event
    window.dispatchEvent(new CustomEvent('api:request:error', { detail: err }))

    // Handle 401 Unauthorized - redirect to login
    // Skip redirect for /auth/me — it legitimately returns 401 when not logged in
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/me')) {
      console.warn('Session expired. Redirecting to login...')
      sessionStorage.removeItem('user')
      localStorage.removeItem('user')
      window.location.href = '/login'
      return Promise.reject(err)
    }

    // Handle 403 Forbidden
    if (err.response?.status === 403) {
      console.error('Access forbidden:', err.response.data?.message)
      err.message = err.response.data?.message || 'You do not have permission to access this resource'
    }

    // Handle 404 Not Found
    if (err.response?.status === 404) {
      err.message = 'The requested resource was not found'
    }

    // Handle 422 Unprocessable Entity - Validation errors
    if (err.response?.status === 422) {
      err.validationErrors = err.response.data?.errors || {}
      err.message = 'Please check the form for errors'
    }

    // Handle 500+ Server Errors
    if (err.response?.status >= 500) {
      console.error('Server error:', err.response.status)
      err.message = 'Server error occurred. Please try again later.'
    }

    // Handle network errors
    if (!err.response) {
      if (err.code === 'ECONNABORTED') {
        err.message = 'Request timeout. Please try again.'
      } else if (err.message === 'Network Error') {
        err.message = 'Network connection failed. Please check your internet.'
      }
    }

    return Promise.reject(err)
  }
)

/**
 * Helper function to handle API errors uniformly
 */
export const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || 
                       error.message || 
                       'An unexpected error occurred'
  
  const errorCode = error.response?.status || 'UNKNOWN'
  
  console.error(`API Error [${errorCode}]:`, errorMessage)
  
  return {
    message: errorMessage,
    code: errorCode,
    validationErrors: error.validationErrors || {},
    status: error.response?.status
  }
}

export default client
