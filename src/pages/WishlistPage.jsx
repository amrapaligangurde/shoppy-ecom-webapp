import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useShop } from '../context/ShopContext'
import { useToast } from '../context/ToastContext'

export default function WishlistPage() {
  const { wishlist, cartDispatch } = useShop()
  const toast = useToast()

  return (
    <main className="cart-page">
      <div className="page-head">
        <h1>Your wishlist</h1>
        {wishlist.length > 0 && (
          <button
            className="secondary-btn"
            onClick={() => {
              cartDispatch({ type: 'addMany', items: wishlist })
              toast('Wishlist added to cart')
            }}
          >
            Add all to cart
          </button>
        )}
      </div>
      {wishlist.length === 0 ? (
        <>
          <p className="muted">Nothing saved yet — tap the ♡ on any product.</p>
          <Link to="/" className="add-btn inline-link">
            Browse products
          </Link>
        </>
      ) : (
        <section className="product-grid">
          {wishlist.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      )}
    </main>
  )
}
