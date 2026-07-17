import { Link, useLocation } from 'react-router-dom'
import { formatUSD } from '../api'

export default function OrderSuccess() {
  const { state } = useLocation()

  if (!state) {
    return (
      <main className="success-page">
        <h1>No recent order</h1>
        <Link to="/" className="add-btn inline-link">
          Browse products
        </Link>
      </main>
    )
  }

  return (
    <main className="success-page">
      <div className="success-icon">📦</div>
      <h1>Order confirmed, {state.name.split(' ')[0]}!</h1>
      <p className="muted">
        Order <strong>{state.orderId}</strong> · {state.itemCount} item(s) · {formatUSD(state.total)} · {state.payment}
      </p>
      <p className="muted">You’ll get shipping updates by email. Estimated delivery: 3–5 days.</p>
      <Link to="/" className="add-btn inline-link">
        Continue shopping
      </Link>
    </main>
  )
}
