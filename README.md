<div align="center">

# SilkMode Fashion — Full-Stack Ethnic E-Commerce Platform

**Handcrafted Silk Sarees, Salwar Suits & Bridal Wear — Direct from Surat**

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers_%26_R2-F38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com/)

</div>

---

## Overview

**SilkMode Fashion** is a full-stack, serverless e-commerce web application built for mobile-first Indian ethnic wear shopping. It pairs an editorial luxury storefront with MongoDB-backed colour-variant inventory, Cloudflare R2 media delivery, hybrid guest/authenticated carts, Razorpay + COD checkout, self-serve order cancellation & 3-day returns, and an RBAC-protected Admin Dashboard.

---

## Core Features

| Module | Highlights |
| :--- | :--- |
| **Authentication & Account** | • Google Sign-In (server-verified `id_token`) + 2Factor Mobile OTP<br>• Zero-dependency Web Crypto HS256 JWT in HTTP-only `sm_session` cookies<br>• Profile & saved delivery addresses management (`/account`) |
| **Dynamic Catalogue** | • **114 products** served from MongoDB Atlas with **1,042 images** hosted on Cloudflare R2<br>• Per-colour SKU & stock tracking with interactive shade swatches<br>• Filterable `/collections` & dynamic `/products/[slug]` pages |
| **Hybrid Cart & Buy Now** | • Guest `localStorage` cart with automatic `/api/cart/merge` on login<br>• Slide-over Cart Drawer with stock-capped quantity controls<br>• Free shipping progress bar (**Free above ₹999**, ₹99 fixed below) |
| **Checkout & Payments** | • Server-side price calculation & atomic colour-variant stock decrement<br>• **Razorpay** (HMAC-SHA256 verification + idempotent `/api/webhooks/razorpay`)<br>• **Cash on Delivery (COD)** up to ₹10,000 with zero extra fee |
| **Orders & 3-Day Returns** | • Customer order history (`/orders`) & live status timeline (`/orders/[id]`)<br>• Atomic pre-shipment cancellation (`placed`, `confirmed`, `packed`) with stock restore & refund<br>• 3-day return requests (`damaged`, `wrong_product`, `incorrect_color`) with direct-to-R2 proof uploads & COD UPI/bank refund details |
| **Protected Admin Panel** | • Role-based access (`role === "admin"`) across `/admin` & `/api/admin/*`<br>• Product CRUD, direct-to-R2 multi-image uploader, and colour/stock manager<br>• Order status & courier tracking updates + Return/Refund queue |
| **Notifications & Support** | • Transactional SMS (2Factor) & Email (Resend) on order/return events<br>• Context-aware desktop WhatsApp support & mobile bottom navigation |

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Database:** MongoDB Atlas (singleton connection pooling + TTL & unique indexes)
- **Media Storage:** Cloudflare R2 (S3-compatible presigned PUT uploads + CDN public URLs)
- **Hosting / Edge:** Cloudflare Workers via `@opennextjs/cloudflare` & `wrangler`
- **Payments & Comms:** Razorpay Orders/Refunds/Webhooks, 2Factor API (OTP & SMS), Resend (Email), Google Identity Services

---

## Project Structure

```text
silk_mode_fashion/
├── src/
│   ├── app/
│   │   ├── account/              # Customer profile & saved addresses
│   │   ├── admin/                # RBAC-protected Admin Dashboard
│   │   ├── api/
│   │   │   ├── account/          # Address CRUD
│   │   │   ├── admin/            # Admin products, orders & returns APIs
│   │   │   ├── auth/             # Google OAuth, 2Factor OTP, me & logout
│   │   │   ├── cart/             # MongoDB cart sync & guest merge
│   │   │   ├── checkout/         # Atomic order creation
│   │   │   ├── health/           # DB & R2 health check
│   │   │   ├── orders/           # Order history, cancel & 3-day return
│   │   │   ├── payments/         # Razorpay signature verification
│   │   │   ├── products/         # Public product catalogue endpoints
│   │   │   ├── uploads/          # Direct-to-R2 presigned URL generator
│   │   │   └── webhooks/         # Idempotent Razorpay webhook handler
│   │   ├── checkout/             # Cart & Buy Now checkout flow
│   │   ├── collections/          # Filterable & sortable catalogue
│   │   ├── orders/               # Customer order list & detail pages
│   │   └── products/[slug]/      # Dynamic product detail page
│   ├── components/               # Reusable storefront UI, CartDrawer, LoginModal
│   ├── context/                  # AuthContext & CartContext
│   ├── data/                     # Collections metadata & seed product catalogue
│   ├── lib/                      # db, r2, auth, products, cart, razorpay, notifications
│   └── scripts/                  # R2 image migration & MongoDB seed scripts
├── .env.example                  # Required environment variable template
├── wrangler.jsonc                # Cloudflare Workers configuration
└── open-next.config.ts           # OpenNext Cloudflare adapter config
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

Key variables:
- `MONGODB_URI` & `MONGODB_DB`
- `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`
- `AUTH_JWT_SECRET`, `ADMIN_EMAIL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_ID`
- `TWOFACTOR_API_KEY` *(for Mobile OTP & SMS)*
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

### 3. Seed Database & Migrate Images (One-Time)
```bash
npx tsx src/scripts/migrate-images-to-r2.ts
npx tsx src/scripts/seed-products.ts
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 5. Build & Deploy (Cloudflare Workers)
```bash
# Type check & Next.js build
npx tsc --noEmit
npx next build --webpack

# Build & deploy with OpenNext for Cloudflare Workers
npm run cf:build
npm run cf:deploy
```

---

## Documentation
- [ECOMMERCE_UPGRADE_PLAN.md](ECOMMERCE_UPGRADE_PLAN.md) — Architecture, schema, and phased roadmap
- [PENDING_TASKS.md](PENDING_TASKS.md) — Remaining external keys & production deployment checklist
