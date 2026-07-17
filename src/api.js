// DummyJSON — free fake e-commerce API with real product images (https://dummyjson.com)
const BASE = 'https://dummyjson.com'
const FIELDS = 'id,title,price,rating,thumbnail,category,discountPercentage,stock,brand'

async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export async function fetchProducts({ limit = 12, skip = 0, category = '', query = '' } = {}) {
  let url
  if (query) {
    url = `${BASE}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}&select=${FIELDS}`
  } else if (category) {
    url = `${BASE}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}&select=${FIELDS}`
  } else {
    url = `${BASE}/products?limit=${limit}&skip=${skip}&select=${FIELDS}`
  }
  const data = await getJSON(url)
  return { products: data.products ?? [], total: data.total ?? 0 }
}

export async function fetchProduct(id) {
  return getJSON(`${BASE}/products/${id}`)
}

export async function fetchCategories() {
  const data = await getJSON(`${BASE}/products/categories`)
  // The API has returned both plain strings and {slug, name} objects across versions — support both
  return data.map((c) => (typeof c === 'string' ? { slug: c, name: c.replace(/-/g, ' ') } : c))
}

export const formatUSD = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export const discountedPrice = (product) =>
  product.price * (1 - (product.discountPercentage ?? 0) / 100)
