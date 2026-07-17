import { Link, NavLink } from 'react-router-dom'
import { useShop } from '../context/ShopContext'

export default function Navbar({ theme, onToggleTheme }) {
  const { cartCount, wishlist } = useShop()

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Shoppy<span className="brand-dot">.</span>
      </Link>
      <div className="nav-actions">
        <NavLink to="/" className="nav-link" end>
          Shop
        </NavLink>
        <NavLink to="/orders" className="nav-link">
          Orders
        </NavLink>
        <NavLink to="/wishlist" className="nav-link badge-link">
          ♡ Wishlist
          {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
        </NavLink>
        <NavLink to="/cart" className="nav-link badge-link">
          🛒 Cart
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </NavLink>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  )
}
