import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatUSD } from '../api'
import { useShop } from '../context/ShopContext'
import { useToast } from '../context/ToastContext'

const PAYMENT_METHODS = ['Card', 'UPI', 'Cash on Delivery']

export default function Checkout() {
  const { cart, total, cartDispatch, ordersDispatch, removeCoupon } = useShop()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', address: '', payment: PAYMENT_METHODS[0] })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (cart.length === 0) navigate('/', { replace: true })
  }, [cart.length, navigate])

  if (cart.length === 0) return null

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const validate = () => {
    const errs = {}
    if (form.name.trim().length < 2) errs.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Enter a valid email address.'
    if (form.address.trim().length < 10) errs.address = 'Address looks too short — add street and city.'
    return errs
  }

  const placeOrder = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const orderId = `SH${Date.now().toString().slice(-8)}`
    ordersDispatch({
      type: 'add',
      order: {
        id: orderId,
        date: new Date().toISOString(),
        items: cart.map((i) => ({ id: i.id, title: i.title, qty: i.qty, thumbnail: i.thumbnail })),
        total,
        payment: form.payment,
        name: form.name,
      },
    })
    cartDispatch({ type: 'clear' })
    removeCoupon()
    toast('Order placed!')
    navigate('/order-success', {
      state: { orderId, total, name: form.name, payment: form.payment, itemCount: cart.length },
      replace: true,
    })
  }

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>
      <form className="card checkout-form" onSubmit={placeOrder} noValidate>
        <label className="field">
          <span>Full name</span>
          <input value={form.name} onChange={update('name')} placeholder="Your name" />
          {errors.name && <em className="field-error">{errors.name}</em>}
        </label>

        <label className="field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" />
          {errors.email && <em className="field-error">{errors.email}</em>}
        </label>

        <label className="field">
          <span>Shipping address</span>
          <textarea value={form.address} onChange={update('address')} rows="3" placeholder="Street, city, PIN code" />
          {errors.address && <em className="field-error">{errors.address}</em>}
        </label>

        <fieldset className="payment">
          <legend>Payment method</legend>
          {PAYMENT_METHODS.map((method) => (
            <label key={method} className="radio">
              <input
                type="radio"
                name="payment"
                value={method}
                checked={form.payment === method}
                onChange={update('payment')}
              />
              {method}
            </label>
          ))}
        </fieldset>

        <button type="submit" className="add-btn">
          Place order · {formatUSD(total)}
        </button>
      </form>
    </main>
  )
}
