# Petal — Voice Command Shopping Assistant

## What's new in this update
- **Real signup/login**: emails and hashed passwords are stored server-side in `data/users.json` (via `lib/server/user-db.ts`), not just in the browser. Passwords are hashed with `scrypt` + a per-user salt.
- **Product availability**: any product marked `outOfStock` in `lib/products.ts` no longer appears in search, browsing, or suggestions.
- **Checkout flow**: cart → delivery address → payment method (Card / UPI / COD) → order confirmation, BigBasket-style (`components/checkout-flow.tsx`, `app/api/orders/route.ts`).
- **Order confirmation "email"**: after placing an order, a confirmation email (subject + HTML, matching BigBasket-style receipts) is generated server-side in `lib/server/order-db.ts`. Orders are saved to `data/orders.json`.
- Fully responsive layout, works on phone screens (navbar wraps, drawers go full-width on mobile).

### Sending real emails (optional)
By default no email provider is configured, so the app generates the email content and shows it in the confirmation screen but doesn't deliver it (this is logged to the server console instead). To actually send it:
1. Create a free [Resend](https://resend.com) account and get an API key.
2. Add to `.env.local`:
   ```
   RESEND_API_KEY=your_key_here
   RESEND_FROM_EMAIL=orders@yourdomain.com
   ```
3. Redeploy — `lib/server/order-db.ts` will now call the Resend API automatically.

### A note on the file-based "database"
`data/users.json` and `data/orders.json` work great for local development and demoing. On serverless hosts like Vercel, the filesystem is read-only outside `/tmp`, and `/tmp` doesn't persist between deployments — so for a real production deployment, swap `lib/server/user-db.ts` / `lib/server/order-db.ts` for a hosted database (Supabase, PlanetScale, MongoDB Atlas all have free tiers) using the same function signatures (`createUser`, `verifyUser`, `saveOrder`, `getOrdersForUser`).

---

# bazar

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_48x0878jCarmgOxNbPATCzp0wV08)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
