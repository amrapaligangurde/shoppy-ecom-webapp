import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useShop } from '../context/ShopContext'

export default function WishlistPage() {
  const { wishlist } = useShop()

  return (
    <main className="cart-page">
      <h1>Your wishlist</h1>
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
