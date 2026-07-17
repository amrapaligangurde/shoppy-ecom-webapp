# Shoppy 🛍️

A responsive online-marketplace web app built with React — browse real product data, view product details with an image gallery, manage a cart and wishlist, and check out.

## Features

- Product catalog fetched from the [DummyJSON](https://dummyjson.com) API with loading skeletons and "Load more" pagination
- Debounced server-side search (custom `useDebounce` hook), category filter chips, and client-side sorting
- Product detail page with image gallery, stock status, customer reviews, and a "You may also like" rail of related products
- "Recently viewed" rail on the home page
- Cart with quantity steppers, discount-aware pricing, savings line, and free shipping over $100
- Coupon codes (`SHOPPY10`, `WELCOME5`) with validation and removal
- Wishlist with heart toggle on every card, shown on its own page
- Order history page — every placed order is saved and browsable
- Toast notifications for cart, wishlist, coupon, and order actions
- Checkout form with validation and payment method selection; order confirmation with generated ID
- Cart, wishlist, orders, recently-viewed, coupon, and theme all persisted in localStorage
- Dark / light theme toggle
- Fully responsive — grid, detail page, and cart adapt to mobile

## Architecture notes

- React 18 + Vite, React Router v6 with **route-level code splitting** (`React.lazy` + `Suspense`)
- Context API + `useReducer` — four small reducers (cart, wishlist, orders, recently viewed) in one provider
- Custom hooks: `useDebounce`, `useLocalStorage`
- **Error boundary** around the route tree with a friendly fallback
- Scroll restoration on route change; 404 page for unknown routes
- Plain CSS with CSS variables for theming (no UI framework)

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
