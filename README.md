# Shoppy 🛍️

A responsive online-marketplace web app built with React — browse real product data, view product details with an image gallery, manage a cart and wishlist, and check out.

## Features

- Product catalog fetched from the [DummyJSON](https://dummyjson.com) API with loading skeletons and "Load more" pagination
- Debounced server-side search, category filter chips, and client-side sorting (price / rating)
- Product detail page with image gallery, discount badge, stock status, and description
- Cart with quantity steppers, discount-aware pricing, savings line, and free shipping over $100
- Wishlist with heart toggle on every card, shown on its own page
- Cart and wishlist persisted in localStorage
- Checkout form with validation (name, email, address) and payment method selection
- Order confirmation with generated order ID
- Dark / light theme toggle (persisted)
- Fully responsive — grid, detail page, and cart adapt to mobile

## Tech

- React 18 + Vite
- React Router v6
- Context API + useReducer (separate reducers for cart and wishlist)
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
