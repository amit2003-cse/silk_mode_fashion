# Pending Tasks & Next Phases — SilkMode Fashion E-Commerce

**Last Updated:** 2026-11-27  
**Completed So Far:** Phase 1 (MongoDB Atlas, Cloudflare R2 1,042 images migrated, 114 products seeded, OpenNext config) & Phase 2 (Google Sign-In, 2Factor OTP APIs, HTTP-only JWT sessions, `/account` & saved addresses).

---

## 1. Pending Environment Keys & External Setup
- [ ] **`TWOFACTOR_API_KEY`**: Add key in `.env.local` (and Cloudflare Worker Secrets) to activate live Mobile OTP & SMS notifications.
- [ ] **Razorpay Keys**: Add `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`.
- [ ] **Resend Email Key**: Add `RESEND_API_KEY` and verified sender email (e.g., `orders@silkmodefashion.in`).
- [ ] **Google OAuth Consent Screen**: Ensure test user emails are added (or publish OAuth app to Production) in Google Cloud Console.
- [ ] **Production Security Cleanup (Before Go-Live)**:
  - Rotate MongoDB password & Cloudflare R2 API token/keys used during initial setup.
  - Enable `0.0.0.0/0` in MongoDB Atlas Network Access for Cloudflare Workers serverless IPs.

---

## 2. Phase 3: Dynamic Catalogue, Colour Variants & Cart (Pending)
- [ ] Build product read APIs (`GET /api/products`, `GET /api/products/[slug]`) reading live data and colour-wise `stock` from MongoDB.
- [ ] Switch Homepage (`HomeClient.tsx`), `/collections`, and `/products/[slug]` from static `PRODUCTS_DATA` to MongoDB-backed data.
- [ ] Implement `CartContext` with `localStorage` persistence for guests and `/api/cart` + `/api/cart/merge` for logged-in users.
- [ ] Build slide-over **Cart Drawer** with quantity controls, colour variant display, stock limits, and shipping threshold indicator (Free above ₹999, ₹99 below).
- [ ] Wire **"Add to Cart"** and **"Buy Now"** buttons in `ProductCard.tsx`, `ProductQuickViewModal.tsx`, and `ProductDetailClient.tsx`.

---

## 3. Phase 4: Checkout, Razorpay + COD & Notifications (Pending)
- [ ] Build `/checkout` page (delivery address selection/creation, payment method: Razorpay or COD up to ₹10,000, live order summary).
- [ ] Build `POST /api/checkout/create-order`:
  - Re-calculate prices, shipping (`₹0` if `> ₹999`, else `₹99`), and totals strictly on the server from MongoDB.
  - Atomically decrement colour-variant stock (`stock >= quantity`) to prevent overselling.
  - Create Razorpay Order (if online) or place COD order directly.
- [ ] Build `POST /api/payments/verify` (server-side HMAC-SHA256 Razorpay signature verification).
- [ ] Build `POST /api/webhooks/razorpay` (webhook signature verification + `webhook_events` idempotency check for `payment.captured` / `payment.failed`).
- [ ] Create `src/lib/notifications.ts` for **2Factor SMS** and **Resend Email** triggers on order confirmation, shipment, cancellation, and returns.

---

## 4. Phase 5: Order History, Cancellation & 3-Day Returns (Pending)
- [ ] Build `/orders` (order list) and `/orders/[id]` (status timeline, items snapshot, tracking info, invoice summary).
- [ ] Build `POST /api/orders/[id]/cancel`:
  - Allow cancellation **only before `shipped`** (`placed`, `confirmed`, `packed`).
  - Restore colour-variant stock and trigger Razorpay refund if online-paid.
- [ ] Build `POST /api/orders/[id]/return`:
  - Enforce `orderStatus === "delivered"`, `<= 3 days` from `deliveredAt`, and valid reasons (`damaged`, `wrong_product`, `incorrect_color`).
  - Support R2 presigned upload for damaged/wrong-item proof photos.
  - Collect UPI ID / Bank details for COD order refunds.

---

## 5. Phase 6: Protected Admin Panel (RBAC) (Pending)
- [ ] Protect `/admin/*` pages and `/api/admin/*` routes with `role === "admin"` (`silkmodefashion06@gmail.com`).
- [ ] Build `/admin` dashboard:
  - **Product CRUD**: Create, edit, and archive products.
  - **Image Uploader**: Direct-to-R2 multi-image upload via presigned URLs.
  - **Colour & Inventory Manager**: Add/edit colours, hex codes, SKUs, and per-colour stock.
  - **Order Management**: Update order status (`confirmed` → `packed` → `shipped` → `delivered`), add courier name & tracking ID, trigger SMS/Email.
  - **Return & Refund Queue**: Review proof images, approve/reject returns, mark manual/Razorpay refunds complete.

---

## 6. Deployment & End-to-End Verification (Pending)
- [ ] Configure Cloudflare Worker Secrets (`wrangler secret put ...`) for all server-side env vars.
- [ ] Run OpenNext build & deploy to Cloudflare Workers (`@opennextjs/cloudflare` + `wrangler deploy`).
- [ ] Verify `/api/health`, Google Sign-In, OTP, Razorpay test/live checkout, webhook delivery, and admin RBAC in production.
