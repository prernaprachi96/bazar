# BAZAR — Voice Command Shopping Assistant

> A voice-powered grocery shopping assistant with smart suggestions, NLP, and multilingual support.

---

## Approach (200 words)

BAZAR is a Next.js 14 web app that lets users manage a grocery shopping list entirely through voice or text commands. The core idea was to make adding, removing, and searching for items feel as natural as talking to someone.

For voice input, I used the browser's built-in Web Speech API — no external service needed, works offline, and supports 8 languages (English, Hindi, Spanish, French, German, Japanese, Arabic, Portuguese). On top of the raw transcript, a custom rule-based NLP layer (`lib/nlp.ts`) detects intent (add, remove, search, suggest, clear) and extracts item names, quantities, and price filters — handling phrases like "Add 2 bottles of water" or "Find toothpaste under $5".

Smart suggestions are driven by three signals: staples not yet in the cart (low-stock nudge), in-season products, and on-sale items. When a product is out of stock, the app blocks adding it and immediately surfaces same-category substitutes.

The product catalog has 200 SKUs across 10 categories, generated programmatically. Orders are saved locally (no database required for demo). Authentication uses scrypt-hashed passwords stored in a JSON file server-side.

The entire UI is responsive and optimized for mobile and voice-only use.

---

## Features

- **Voice commands** — "Add milk", "Remove apples", "Find snacks under $4", "Clear list"
- **NLP** — understands varied phrasing in 8 languages
- **Smart suggestions** — low-stock staples, seasonal items, on-sale products
- **Substitutes** — auto-suggests alternatives when an item is out of stock
- **Out-of-stock enforcement** — blocks adding unavailable or unknown items
- **Checkout flow** — cart → address → payment (Card / UPI / COD) → confirmation
- **Auth** — signup/login with scrypt-hashed passwords
- **200 products** across 10 categories with brand variants

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Voice | Web Speech API |
| NLP | Custom rule-based (no external API) |
| Auth | scrypt + JSON file store |
| Orders | Local JSON file store |

---

## Getting Started (Local)

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
voice-command-project-updated/
├── app/
│   ├── api/
│   │   ├── auth/         # login & signup routes
│   │   └── orders/       # place & fetch orders
│   ├── layout.tsx        # app title, fonts
│   └── page.tsx          # entry point
├── components/
│   ├── assistant-app.tsx # main app shell
│   ├── product-card.tsx  # product display + out-of-stock badge
│   ├── voice-search-bar.tsx
│   ├── chat-panel.tsx
│   ├── shopping-list.tsx
│   ├── checkout-flow.tsx
│   └── search-results.tsx
├── hooks/
│   ├── use-shopping-store.ts  # cart logic, add/remove validation
│   └── use-speech-recognition.ts
├── lib/
│   ├── nlp.ts            # intent + entity extraction
│   ├── products.ts       # 200-SKU catalog, findSubstitutes()
│   ├── suggestions.ts    # smart suggestion engine
│   ├── i18n.ts           # 8-language translations
│   └── server/
│       ├── user-db.ts    # auth storage
│       └── order-db.ts   # order storage
└── next.config.mjs
```

---

## Deployment (Vercel)

This project is ready to deploy on Vercel with zero configuration.

See the **Deploying to Vercel** section below for step-by-step instructions.

---

## Environment Variables (Optional)

No environment variables are required to run the app. These are optional for production:

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Send real order confirmation emails via Resend |
| `RESEND_FROM_EMAIL` | Sender address for order emails |

To add them on Vercel: go to your project → **Settings** → **Environment Variables**.