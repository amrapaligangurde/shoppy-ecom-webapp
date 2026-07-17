import { Component } from 'react'

// Class component is intentional — error boundaries can't be written as hooks.
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // In a real app this would go to an error-reporting service
    console.error('Unhandled UI error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong.</h2>
          <p className="muted">An unexpected error occurred. Try reloading the page.</p>
          <button className="add-btn" onClick={() => window.location.assign('/')}>
            Reload Shoppy
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
