import { Link } from 'react-router-dom'
import { formatUSD } from '../api'
import { useShop } from '../context/ShopContext'

export default function OrdersPage() {
  const { orders } = useShop()

  return (
    <main className="cart-page">
      <h1>Your orders</h1>
      {orders.length === 0 ? (
        <>
          <p className="muted">No orders yet.</p>
          <Link to="/" className="add-btn inline-link">
            Start shopping
          </Link>
        </>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id} className="order-card">
              <div className="order-head">
                <div>
                  <strong>{order.id}</strong>
                  <span className="muted order-date">
                    {new Date(order.date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className="order-total">{formatUSD(order.total)}</span>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <Link key={item.id} to={`/product/${item.id}`} className="order-item" title={item.title}>
                    <img src={item.thumbnail} alt={item.title} loading="lazy" />
                    <span className="muted">×{item.qty}</span>
                  </Link>
                ))}
              </div>
              <span className="muted">{order.payment} · {order.items.length} product(s)</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
