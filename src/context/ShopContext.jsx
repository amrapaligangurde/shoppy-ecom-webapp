import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { discountedPrice } from '../api'

const ShopContext = createContext(null)

export const COUPONS = {
  SHOPPY10: 0.1,
  WELCOME5: 0.05,
}

const CART_KEY = 'shoppy-cart'
const WISHLIST_KEY = 'shoppy-wishlist'
const ORDERS_KEY = 'shoppy-orders'
const RECENT_KEY = 'shoppy-recent'
const COUPON_KEY = 'shoppy-coupon'
const RECENT_LIMIT = 8

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.find((i) => i.id === action.item.id)
      if (existing) {
        return state.map((i) => (i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...state, { ...action.item, qty: 1 }]
    }
    case 'setQty': {
      if (action.qty <= 0) return state.filter((i) => i.id !== action.id)
      return state.map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i))
    }
    case 'remove':
      return state.filter((i) => i.id !== action.id)
    case 'clear':
      return []
    default:
      return state
  }
}

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'toggle': {
      const exists = state.find((i) => i.id === action.item.id)
      if (exists) return state.filter((i) => i.id !== action.item.id)
      return [...state, action.item]
    }
    case 'remove':
      return state.filter((i) => i.id !== action.id)
    default:
      return state
  }
}

function ordersReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [action.order, ...state]
    default:
      return state
  }
}

function recentReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [action.item, ...state.filter((i) => i.id !== action.item.id)].slice(0, RECENT_LIMIT)
    default:
      return state
  }
}

const load = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export function ShopProvider({ children }) {
  const [cart, cartDispatch] = useReducer(cartReducer, undefined, () => load(CART_KEY))
  const [wishlist, wishlistDispatch] = useReducer(wishlistReducer, undefined, () => load(WISHLIST_KEY))
  const [orders, ordersDispatch] = useReducer(ordersReducer, undefined, () => load(ORDERS_KEY))
  const [recent, recentDispatch] = useReducer(recentReducer, undefined, () => load(RECENT_KEY))
  const [coupon, setCoupon] = useState(() => load(COUPON_KEY, null))

  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)), [wishlist])
  useEffect(() => localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)), [orders])
  useEffect(() => localStorage.setItem(RECENT_KEY, JSON.stringify(recent)), [recent])
  useEffect(() => localStorage.setItem(COUPON_KEY, JSON.stringify(coupon)), [coupon])

  const subtotal = cart.reduce((sum, i) => sum + discountedPrice(i) * i.qty, 0)
  const savings = cart.reduce((sum, i) => sum + (i.price - discountedPrice(i)) * i.qty, 0)
  const couponDiscount = coupon && COUPONS[coupon] ? subtotal * COUPONS[coupon] : 0
  const shipping = subtotal === 0 || subtotal - couponDiscount >= 100 ? 0 : 6.99
  const total = subtotal - couponDiscount + shipping
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const applyCoupon = (code) => {
    const normalized = code.trim().toUpperCase()
    if (COUPONS[normalized]) {
      setCoupon(normalized)
      return true
    }
    return false
  }

  const removeCoupon = () => setCoupon(null)

  const value = {
    cart,
    cartDispatch,
    wishlist,
    wishlistDispatch,
    orders,
    ordersDispatch,
    recent,
    recentDispatch,
    coupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    subtotal,
    savings,
    shipping,
    total,
    cartCount,
  }
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside a ShopProvider')
  return ctx
}
