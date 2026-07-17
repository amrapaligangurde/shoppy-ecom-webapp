import { Link } from 'react-router-dom'
import { discountedPrice, formatUSD } from '../api'
import { useShop } from '../context/ShopContext'
import { useToast } from '../context/ToastContext'

export default function ProductCard({ product }) {
  const { cart, cartDispatch, wishlist, wishlistDispatch } = useShop()
  const toast = useToast()
  const inCart = cart.find((i) => i.id === product.id)
  const wished = wishlist.some((i) => i.id === product.id)
  const hasDiscount = (product.discountPercentage ?? 0) >= 1

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-media">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        {hasDiscount && <span className="discount-tag">-{Math.round(product.discountPercentage)}%</span>}
      </Link>
      <button
        className={wished ? 'wish-btn active' : 'wish-btn'}
        onClick={() => {
          wishlistDispatch({ type: 'toggle', item: product })
          toast(wished ? 'Removed from wishlist' : 'Added to wishlist')
        }}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {wished ? '♥' : '♡'}
      </button>
      <div className="product-body">
        <span className="muted product-brand">{product.brand || product.category}</span>
        <Link to={`/product/${product.id}`} className="product-title">
          {product.title}
        </Link>
        <div className="product-meta">
          <span className="rating">★ {product.rating?.toFixed(1)}</span>
          <span className="price">
            {formatUSD(discountedPrice(product))}
            {hasDiscount && <s className="muted">{formatUSD(product.price)}</s>}
          </span>
        </div>
        {inCart ? (
          <div className="qty-stepper">
            <button onClick={() => cartDispatch({ type: 'setQty', id: product.id, qty: inCart.qty - 1 })}>−</button>
            <span>{inCart.qty}</span>
            <button
              disabled={product.stock != null && inCart.qty >= product.stock}
              onClick={() => cartDispatch({ type: 'setQty', id: product.id, qty: inCart.qty + 1 })}
            >
              +
            </button>
          </div>
        ) : (
          <button
            className="add-btn"
            onClick={() => {
              cartDispatch({ type: 'add', item: product })
              toast('Added to cart')
            }}
          >
            Add to cart
          </button>
        )}
      </div>
    </article>
  )
}
