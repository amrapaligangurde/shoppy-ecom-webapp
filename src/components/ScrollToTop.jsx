import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Restores scroll position to the top on every route change,
// so navigating from the bottom of the catalog doesn't land mid-page.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
