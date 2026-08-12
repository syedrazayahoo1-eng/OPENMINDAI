import { useCallback, useMemo, useState } from 'react'

export default function useAuthForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})

  const errors = useMemo(() => validate(values), [validate, values])
  const isValid = Object.keys(errors).length === 0

  const setFieldValue = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
  }, [])

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }, [])

  const handleBlur = useCallback((event) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }))
  }, [])

  const markAllTouched = useCallback(() => {
    setTouched(Object.keys(initialValues).reduce((next, key) => ({ ...next, [key]: true }), {}))
  }, [initialValues])

  const resetForm = useCallback((nextValues = initialValues) => {
    setValues(nextValues)
    setTouched({})
  }, [initialValues])

  return {
    values,
    touched,
    errors,
    isValid,
    setFieldValue,
    handleChange,
    handleBlur,
    markAllTouched,
    resetForm,
  }
}
