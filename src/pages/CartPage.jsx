import { Link, useNavigate } from 'react-router-dom'
import { discountedPrice, formatUSD } from '../api'
import { useShop } from '../context/ShopContext'

export default function CartPage() {
  const { cart, cartDispatch, subtotal, savings, shipping, total } = useShop()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <h1>Your cart</h1>
        <p className="muted">Your cart is empty.</p>
        <Link to="/" className="add-btn inline-link">
          Start shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <h1>Your cart</h1>
      <div className="cart-layout">
        <ul className="cart-list">
          {cart.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.thumbnail} alt={item.title} className="cart-thumb" />
              <div className="cart-item-info">
                <Link to={`/product/${item.id}`} className="product-title">
                  {item.title}
                </Link>
                <span className="muted">{formatUSD(discountedPrice(item))} each</span>
              </div>
              <div className="qty-stepper">
                <button onClick={() => cartDispatch({ type: 'setQty', id: item.id, qty: item.qty - 1 })}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => cartDispatch({ type: 'setQty', id: item.id, qty: item.qty + 1 })}>+</button>
              </div>
              <span className="cart-line-total">{formatUSD(discountedPrice(item) * item.qty)}</span>
              <button
                className="remove-btn"
                onClick={() => cartDispatch({ type: 'remove', id: item.id })}
                aria-label={`Remove ${item.title}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <aside className="bill card">
          <h2>Order summary</h2>
          <div className="bill-row">
            <span>Subtotal</span>
            <span>{formatUSD(subtotal)}</span>
          </div>
          {savings > 0 && (
            <div className="bill-row savings">
              <span>You save</span>
              <span>−{formatUSD(savings)}</span>
            </div>
          )}
          <div className="bill-row">
            <span>Shipping {shipping === 0 && <em className="free">FREE over $100</em>}</span>
            <span>{formatUSD(shipping)}</span>
          </div>
          <div className="bill-row bill-total">
            <span>Total</span>
            <span>{formatUSD(total)}</span>
          </div>
          <button className="add-btn" onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </button>
        </aside>
      </div>
    </main>
  )
}
