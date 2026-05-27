/**
 * Global Loading & Toast Notification System
 * Manages loading states and notifications across the app
 */

import React from 'react'

class NotificationManager {
  constructor() {
    this.listeners = []
    this.toasts = []
    this.toastId = 0
  }

  /**
   * Subscribe to notification updates
   */
  subscribe(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  }

  /**
   * Emit notification update to all listeners
   */
  notify() {
    this.listeners.forEach(cb => cb(this.toasts))
  }

  /**
   * Add a toast notification
   */
  addToast(message, type = 'info', duration = 5000) {
    const id = ++this.toastId
    const toast = { id, message, type, duration }

    this.toasts.push(toast)
    this.notify()

    // Auto-remove after duration
    if (duration) {
      setTimeout(() => this.removeToast(id), duration)
    }

    return id
  }

  /**
   * Show success toast
   */
  success(message, duration) {
    return this.addToast(message, 'success', duration)
  }

  /**
   * Show error toast
   */
  error(message, duration) {
    return this.addToast(message, 'error', duration || 7000)
  }

  /**
   * Show warning toast
   */
  warning(message, duration) {
    return this.addToast(message, 'warning', duration)
  }

  /**
   * Show info toast
   */
  info(message, duration) {
    return this.addToast(message, 'info', duration)
  }

  /**
   * Remove a specific toast
   */
  removeToast(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.notify()
  }

  /**
   * Clear all toasts
   */
  clearAll() {
    this.toasts = []
    this.notify()
  }

  /**
   * Get all current toasts
   */
  getToasts() {
    return this.toasts
  }
}

/**
 * Global Loading Manager
 * Tracks loading states across the app
 */
class LoadingManager {
  constructor() {
    this.requests = new Map()
    this.listeners = []
  }

  /**
   * Subscribe to loading state changes
   */
  subscribe(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  }

  /**
   * Notify all listeners
   */
  notify() {
    const isLoading = this.requests.size > 0
    this.listeners.forEach(cb => cb(isLoading))
  }

  /**
   * Start loading with key
   */
  start(key = 'default') {
    this.requests.set(key, true)
    this.notify()
  }

  /**
   * End loading with key
   */
  end(key = 'default') {
    this.requests.delete(key)
    this.notify()
  }

  /**
   * Check if specific key is loading
   */
  isLoading(key = 'default') {
    return this.requests.has(key)
  }

  /**
   * Check if anything is loading
   */
  isAnyLoading() {
    return this.requests.size > 0
  }

  /**
   * Clear all loading states
   */
  clearAll() {
    this.requests.clear()
    this.notify()
  }
}

// Global instances
export const notifications = new NotificationManager()
export const loading = new LoadingManager()

/**
 * React Hook for using notifications
 */
export const useNotification = () => {
  const [toasts, setToasts] = React.useState([])

  React.useEffect(() => {
    return notifications.subscribe(setToasts)
  }, [])

  return {
    toasts,
    success: notifications.success.bind(notifications),
    error: notifications.error.bind(notifications),
    warning: notifications.warning.bind(notifications),
    info: notifications.info.bind(notifications),
    removeToast: notifications.removeToast.bind(notifications),
    clearAll: notifications.clearAll.bind(notifications)
  }
}

/**
 * React Hook for global loading state
 */
export const useLoading = (key = 'default') => {
  const [isLoading, setIsLoading] = React.useState(loading.isLoading(key))

  React.useEffect(() => {
    const unsubscribe = loading.subscribe(() => {
      setIsLoading(loading.isLoading(key))
    })
    return unsubscribe
  }, [key])

  return isLoading
}

/**
 * React Hook for global "any loading" state
 */
export const useAnyLoading = () => {
  const [isLoading, setIsLoading] = React.useState(loading.isAnyLoading())

  React.useEffect(() => {
    return loading.subscribe(() => {
      setIsLoading(loading.isAnyLoading())
    })
  }, [])

  return isLoading
}

export default { notifications, loading, useNotification, useLoading, useAnyLoading }
