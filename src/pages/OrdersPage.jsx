import { Link, useNavigate } from 'react-router-dom'
import { formatUSD } from '../api'
import { useShop } from '../context/ShopContext'
import { useToast } from '../context/ToastContext'

export default function OrdersPage() {
  const { orders, cartDispatch } = useShop()
  const toast = useToast()
  const navigate = useNavigate()

  const reorder = (order) => {
    cartDispatch({ type: 'addMany', items: order.items })
    toast('Order items added to cart')
    navigate('/cart')
  }

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
              <div className="order-foot">
                <span className="muted">
                  {order.payment} · {order.items.length} product(s)
                </span>
                {order.items.every((i) => i.price != null) && (
                  <button className="secondary-btn" onClick={() => reorder(order)}>
                    Reorder
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
