import { createContext, useContext, useEffect, useReducer } from 'react'
import { discountedPrice } from '../api'

const ShopContext = createContext(null)
const CART_KEY = 'shoppy-cart'
const WISHLIST_KEY = 'shoppy-wishlist'

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

const load = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? []
  } catch {
    return []
  }
}

export function ShopProvider({ children }) {
  const [cart, cartDispatch] = useReducer(cartReducer, undefined, () => load(CART_KEY))
  const [wishlist, wishlistDispatch] = useReducer(wishlistReducer, undefined, () => load(WISHLIST_KEY))

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  const subtotal = cart.reduce((sum, i) => sum + discountedPrice(i) * i.qty, 0)
  const savings = cart.reduce((sum, i) => sum + (i.price - discountedPrice(i)) * i.qty, 0)
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 6.99
  const total = subtotal + shipping
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const value = {
    cart,
    cartDispatch,
    wishlist,
    wishlistDispatch,
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
