// Structured skeleton placeholders that mirror the shape of the real content,
// so the layout doesn't jump when data arrives.

export function SkeletonCard() {
  return (
    <div className="product-card" aria-hidden="true">
      <div className="sk-media shimmer" />
      <div className="product-body">
        <div className="sk-line shimmer w40" />
        <div className="sk-line shimmer" />
        <div className="sk-line shimmer w60" />
        <div className="sk-btn shimmer" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <section className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </section>
  )
}

export function SkeletonDetail() {
  return (
    <div className="detail-grid" aria-hidden="true">
      <div className="sk-gallery shimmer" />
      <div>
        <div className="sk-line shimmer w40" />
        <div className="sk-title shimmer" />
        <div className="sk-line shimmer w60" />
        <div className="sk-line shimmer" />
        <div className="sk-line shimmer" />
        <div className="sk-line shimmer w60" />
        <div className="sk-btn shimmer w40" />
      </div>
    </div>
  )
}

export function SkeletonStripCard() {
  return (
    <div className="strip-card" aria-hidden="true">
      <div className="sk-media small shimmer" />
      <div className="sk-line shimmer" />
      <div className="sk-line shimmer w40" />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <span className="spinner" />
    </div>
  )
}
