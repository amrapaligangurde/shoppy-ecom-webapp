import { useEffect, useState } from 'react'

// useState that syncs to localStorage. Falls back gracefully if storage is
// unavailable (private mode) or contains invalid JSON.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or unavailable — state still works in memory
    }
  }, [key, value])

  return [value, setValue]
}
