import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { discountedPrice, fetchCategories, fetchProducts, formatUSD } from '../api'
import ProductCard from '../components/ProductCard'
import ProductStrip from '../components/ProductStrip'
import useDebounce from '../hooks/useDebounce'
import { useShop } from '../context/ShopContext'

const PAGE_SIZE = 12

const SORTS = {
  featured: { label: 'Featured', fn: null },
  priceLow: { label: 'Price: low to high', fn: (a, b) => discountedPrice(a) - discountedPrice(b) },
  priceHigh: { label: 'Price: high to low', fn: (a, b) => discountedPrice(b) - discountedPrice(a) },
  rating: { label: 'Top rated', fn: (a, b) => b.rating - a.rating },
}

const PRICE_BUCKETS = {
  all: { label: 'Any price', test: () => true },
  under50: { label: 'Under $50', test: (p) => discountedPrice(p) < 50 },
  mid: { label: '$50 – $200', test: (p) => discountedPrice(p) >= 50 && discountedPrice(p) <= 200 },
  over200: { label: 'Over $200', test: (p) => discountedPrice(p) > 200 },
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [queryInput, setQueryInput] = useState('')
  const [sortKey, setSortKey] = useState('featured')
  const [priceBucket, setPriceBucket] = useState('all')
  const [minRating, setMinRating] = useState(0)
  const [dealsOnly, setDealsOnly] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggest, setShowSuggest] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const { recent } = useShop()

  // Debounced search — avoids an API request per keystroke
  const query = useDebounce(queryInput.trim(), 400)

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  // Live search suggestions (top 5) for the dropdown
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }
    let cancelled = false
    fetchProducts({ limit: 5, query })
      .then(({ products }) => !cancelled && setSuggestions(products))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [query])

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
    const filtered = products.filter(
      (p) =>
        PRICE_BUCKETS[priceBucket].test(p) &&
        (p.rating ?? 0) >= minRating &&
        (!dealsOnly || (p.discountPercentage ?? 0) >= 10),
    )
    if (SORTS[sortKey].fn) filtered.sort(SORTS[sortKey].fn)
    return filtered
  }, [products, sortKey, priceBucket, minRating, dealsOnly])

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">New season · up to 40% off</p>
        <h1>
          Good things,
          <br />
          close at hand.
        </h1>
        <p className="muted">Browse {total > 0 ? `${total}+` : 'hundreds of'} products across every category.</p>
        <div className="search-wrap">
          <input
            className="search"
            type="search"
            placeholder="Search products… (e.g. laptop, perfume)"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onFocus={() => setShowSuggest(true)}
            onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
          />
          {showSuggest && suggestions.length > 0 && (
            <ul className="suggest">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <Link to={`/product/${s.id}`} className="suggest-item">
                    <img src={s.thumbnail} alt="" loading="lazy" />
                    <span className="suggest-title">{s.title}</span>
                    <span className="suggest-price">{formatUSD(discountedPrice(s))}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
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

      <section className="subfilters">
        <select value={priceBucket} onChange={(e) => setPriceBucket(e.target.value)} aria-label="Price range">
          {Object.entries(PRICE_BUCKETS).map(([key, b]) => (
            <option key={key} value={key}>
              {b.label}
            </option>
          ))}
        </select>
        <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} aria-label="Minimum rating">
          <option value={0}>Any rating</option>
          <option value={3}>★ 3.0 & up</option>
          <option value={4}>★ 4.0 & up</option>
          <option value={4.5}>★ 4.5 & up</option>
        </select>
        <label className="deal-toggle">
          <input type="checkbox" checked={dealsOnly} onChange={(e) => setDealsOnly(e.target.checked)} />
          Deals only (10%+ off)
        </label>
        {(priceBucket !== 'all' || minRating > 0 || dealsOnly) && (
          <button
            className="link-btn"
            onClick={() => {
              setPriceBucket('all')
              setMinRating(0)
              setDealsOnly(false)
            }}
          >
            Clear filters
          </button>
        )}
      </section>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <section className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </section>
      ) : visible.length === 0 ? (
        <p className="muted empty">No products match your filters. Try loosening them.</p>
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

      <ProductStrip title="Recently viewed" products={recent} />
    </main>
  )
}
