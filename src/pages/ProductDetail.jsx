import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { discountedPrice, fetchProduct, fetchProducts, formatUSD } from '../api'
import ProductStrip from '../components/ProductStrip'
import { useShop } from '../context/ShopContext'
import { useToast } from '../context/ToastContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [activeImage, setActiveImage] = useState(0)
  const [error, setError] = useState(null)
  const { cart, cartDispatch, wishlist, wishlistDispatch, recentDispatch } = useShop()
  const toast = useToast()

  useEffect(() => {
    let cancelled = false
    setProduct(null)
    setRelated([])
    setActiveImage(0)
    setError(null)

    fetchProduct(id)
      .then((p) => {
        if (cancelled) return
        setProduct(p)
        // Record a lightweight snapshot for the "Recently viewed" rail
        recentDispatch({
          type: 'add',
          item: {
            id: p.id,
            title: p.title,
            thumbnail: p.thumbnail,
            price: p.price,
            discountPercentage: p.discountPercentage,
          },
        })
        // Fetch related products from the same category
        return fetchProducts({ limit: 8, category: p.category }).then(({ products }) => {
          if (!cancelled) setRelated(products.filter((r) => r.id !== p.id).slice(0, 6))
        })
      })
      .catch(() => !cancelled && setError('Could not load this product.'))

    return () => {
      cancelled = true
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <main className="detail-page">
        <p className="error">{error}</p>
        <Link to="/" className="secondary-btn inline-link">
          Back to shop
        </Link>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="detail-page">
        <div className="skeleton-detail" />
      </main>
    )
  }

  const inCart = cart.find((i) => i.id === product.id)
  const wished = wishlist.some((i) => i.id === product.id)
  const images = product.images?.length ? product.images : [product.thumbnail]
  const hasDiscount = (product.discountPercentage ?? 0) >= 1
  const reviews = product.reviews ?? []

  return (
    <main className="detail-page">
      <Link to="/" className="muted back-link">
        ← Back to shop
      </Link>
      <div className="detail-grid">
        <div className="gallery">
          <img className="gallery-main" src={images[activeImage]} alt={product.title} />
          {images.length > 1 && (
            <div className="thumbs">
              {images.map((src, i) => (
                <button
                  key={src}
                  className={i === activeImage ? 'thumb active' : 'thumb'}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={src} alt={`${product.title} view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <span className="muted">{product.brand || product.category}</span>
          <h1>{product.title}</h1>
          <div className="detail-meta">
            <span className="rating">★ {product.rating?.toFixed(1)}</span>
            <span className={product.stock > 0 ? 'stock in' : 'stock out'}>
              {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
            </span>
          </div>
          <p className="detail-price">
            {formatUSD(discountedPrice(product))}
            {hasDiscount && (
              <>
                <s className="muted">{formatUSD(product.price)}</s>
                <span className="discount-tag inline">-{Math.round(product.discountPercentage)}%</span>
              </>
            )}
          </p>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-actions">
            {inCart ? (
              <div className="qty-stepper large">
                <button onClick={() => cartDispatch({ type: 'setQty', id: product.id, qty: inCart.qty - 1 })}>−</button>
                <span>{inCart.qty} in cart</span>
                <button onClick={() => cartDispatch({ type: 'setQty', id: product.id, qty: inCart.qty + 1 })}>+</button>
              </div>
            ) : (
              <button
                className="add-btn large"
                disabled={product.stock <= 0}
                onClick={() => {
                  cartDispatch({ type: 'add', item: product })
                  toast('Added to cart')
                }}
              >
                Add to cart
              </button>
            )}
            <button
              className={wished ? 'secondary-btn wished' : 'secondary-btn'}
              onClick={() => {
                wishlistDispatch({ type: 'toggle', item: product })
                toast(wished ? 'Removed from wishlist' : 'Added to wishlist')
              }}
            >
              {wished ? '♥ Wishlisted' : '♡ Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <section className="reviews">
          <h2>Customer reviews</h2>
          <ul className="review-list">
            {reviews.map((review, i) => (
              <li key={i} className="review card">
                <div className="review-head">
                  <strong>{review.reviewerName}</strong>
                  <span className="rating">★ {review.rating}</span>
                </div>
                <p>{review.comment}</p>
                <span className="muted">
                  {new Date(review.date).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ProductStrip title="You may also like" products={related} />
    </main>
  )
}
