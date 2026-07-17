import { useEffect, useMemo, useState } from 'react'
import { fetchCategories, fetchProducts } from '../api'
import ProductCard from '../components/ProductCard'

const PAGE_SIZE = 12

const SORTS = {
  featured: { label: 'Featured', fn: null },
  priceLow: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  priceHigh: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  rating: { label: 'Top rated', fn: (a, b) => b.rating - a.rating },
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('featured')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  // Debounce the search box so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setQuery(queryInput.trim()), 400)
    return () => clearTimeout(t)
  }, [queryInput])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  // Initial load + reload when search/category changes
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchProducts({ limit: PAGE_SIZE, skip: 0, category, query })
      .then(({ products, total }) => {
        if (!cancelled) {
          setProducts(products)
          setTotal(total)
        }
      })
      .catch(() => !cancelled && setError('Could not load products. Check your connection and retry.'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [category, query])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const { products: next } = await fetchProducts({
        limit: PAGE_SIZE,
        skip: products.length,
        category,
        query,
      })
      setProducts([...products, ...next])
    } catch {
      setError('Could not load more products.')
    } finally {
      setLoadingMore(false)
    }
  }

  const visible = useMemo(() => {
    const sorted = [...products]
    if (SORTS[sortKey].fn) sorted.sort(SORTS[sortKey].fn)
    return sorted
  }, [products, sortKey])

  return (
    <main>
      <section className="hero">
        <h1>Everything you need, in one place</h1>
        <p className="muted">Browse {total > 0 ? `${total}+` : 'hundreds of'} products across every category.</p>
        <input
          className="search"
          type="search"
          placeholder="Search products… (e.g. laptop, perfume)"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
        />
      </section>

      <section className="filters">
        <div className="chips">
          <button className={category === '' ? 'chip active' : 'chip'} onClick={() => setCategory('')}>
            All
          </button>
          {categories.slice(0, 10).map((c) => (
            <button
              key={c.slug}
              className={category === c.slug ? 'chip active' : 'chip'}
              onClick={() => setCategory(category === c.slug ? '' : c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} aria-label="Sort by">
          {Object.entries(SORTS).map(([key, s]) => (
            <option key={key} value={key}>
              Sort: {s.label}
            </option>
          ))}
        </select>
      </section>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <section className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </section>
      ) : visible.length === 0 ? (
        <p className="muted empty">No products found. Try a different search or category.</p>
      ) : (
        <>
          <section className="product-grid">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </section>
          {products.length < total && (
            <div className="load-more-wrap">
              <button className="secondary-btn" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading…' : `Load more (${products.length} of ${total})`}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
