/**
 * Form Validation Utilities
 * Provides simple schema-based validation for forms
 */

import React from 'react'

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validation rules for common field types
 */
const validationRules = {
  // String validations
  required: (value, fieldName = 'This field') => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`
    }
    return null
  },

  minLength: (length) => (value, fieldName = 'This field') => {
    if (value && value.length < length) {
      return `${fieldName} must be at least ${length} characters long`
    }
    return null
  },

  maxLength: (length) => (value, fieldName = 'This field') => {
    if (value && value.length > length) {
      return `${fieldName} must not exceed ${length} characters`
    }
    return null
  },

  // Email validation
  email: (value, fieldName = 'Email') => {
    if (!value) return null
    if (!EMAIL_REGEX.test(value)) {
      return `Please enter a valid ${fieldName.toLowerCase()}`
    }
    return null
  },

  // Number validation
  numeric: (value, fieldName = 'This field') => {
    if (!value) return null
    if (isNaN(value)) {
      return `${fieldName} must be a number`
    }
    return null
  },

  minValue: (min) => (value, fieldName = 'This field') => {
    if (value && Number(value) < min) {
      return `${fieldName} must be at least ${min}`
    }
    return null
  },

  maxValue: (max) => (value, fieldName = 'This field') => {
    if (value && Number(value) > max) {
      return `${fieldName} must not exceed ${max}`
    }
    return null
  },

  // Password validation
  password: (value, fieldName = 'Password') => {
    if (!value) return `${fieldName} is required`
    if (value.length < 8) {
      return `${fieldName} must be at least 8 characters`
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return `${fieldName} must contain at least one lowercase letter`
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return `${fieldName} must contain at least one uppercase letter`
    }
    if (!/(?=.*\d)/.test(value)) {
      return `${fieldName} must contain at least one number`
    }
    return null
  },

  // URL validation
  url: (value, fieldName = 'URL') => {
    if (!value) return null
    try {
      new URL(value)
      return null
    } catch (e) {
      return `Please enter a valid ${fieldName.toLowerCase()}`
    }
  },

  // Phone validation (basic US format)
  phone: (value, fieldName = 'Phone') => {
    if (!value) return null
    const phoneRegex = /^[\d\s\-\+\(\)]+$|^$/
    if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
      return `Please enter a valid ${fieldName.toLowerCase()}`
    }
    return null
  },

  // Custom validation
  custom: (validator) => (value, fieldName) => {
    return validator(value, fieldName)
  }
}

/**
 * Validate a single field
 * @param {any} value - The field value
 * @param {Array|Function} rules - Array of validation functions or single function
 * @param {string} fieldName - The field name for error messages
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (value, rules, fieldName = 'Field') => {
  if (!rules) return null

  const rulesList = Array.isArray(rules) ? rules : [rules]

  for (const rule of rulesList) {
    const error = rule(value, fieldName)
    if (error) return error
  }

  return null
}

/**
 * Validate entire form object
 * @param {Object} formData - Form data object
 * @param {Object} validationSchema - Schema with field names as keys and rules as values
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validateForm = (formData, validationSchema) => {
  const errors = {}

  for (const [fieldName, rules] of Object.entries(validationSchema)) {
    const value = formData[fieldName]
    const error = validateField(value, rules, fieldName)
    if (error) {
      errors[fieldName] = error
    }
  }

  return errors
}

/**
 * Validation hook for React forms
 */
export const useFormValidation = (initialValues, validationSchema) => {
  const [values, setValues] = React.useState(initialValues)
  const [errors, setErrors] = React.useState({})
  const [touched, setTouched] = React.useState({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))

    // Validate on blur
    if (validationSchema[name]) {
      const error = validateField(values[name], validationSchema[name], name)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const handleSubmit = async (onSubmit) => {
    return async (e) => {
      e.preventDefault()
      setIsSubmitting(true)

      // Validate all fields
      const newErrors = validateForm(values, validationSchema)
      setErrors(newErrors)

      // If no errors, call onSubmit
      if (Object.keys(newErrors).length === 0) {
        try {
          await onSubmit(values)
        } catch (error) {
          console.error('Form submission error:', error)
        }
      }

      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors
  }
}

// Export all validation rules (named + default)
export { validationRules }
export default validationRules
