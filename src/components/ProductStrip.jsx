import { Link } from 'react-router-dom'
import { discountedPrice, formatUSD } from '../api'
import { SkeletonStripCard } from './Skeletons'

// Compact horizontal product rail — used for "Recently viewed" and "You may also like"
export default function ProductStrip({ title, products, loading = false }) {
  if (!loading && !products?.length) return null

  return (
    <section className="strip">
      <h2>{title}</h2>
      <div className="strip-row">
        {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonStripCard key={i} />)}
        {!loading &&
          products.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="strip-card">
            <img src={p.thumbnail} alt={p.title} loading="lazy" />
            <span className="strip-title">{p.title}</span>
            <span className="strip-price">{formatUSD(discountedPrice(p))}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
