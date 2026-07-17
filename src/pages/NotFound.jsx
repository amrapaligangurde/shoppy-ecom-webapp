import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="success-page">
      <div className="success-icon">🧭</div>
      <h1>Page not found</h1>
      <p className="muted">The page you’re looking for doesn’t exist or was moved.</p>
      <Link to="/" className="add-btn inline-link">
        Back to the shop
      </Link>
    </main>
  )
}
