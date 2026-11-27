# E-Commerce Upgrade Plan (Phase 1 to 6): SilkMode Fashion

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, MongoDB Atlas, Cloudflare Workers (`@opennextjs/cloudflare`), Cloudflare R2, Razorpay, 2Factor API (OTP & SMS), Resend (Email), Google Sign-In.

> **Security Rule:** Never commit `.env.local` or real credentials (MongoDB password, R2 Secret Access Key, Razorpay Secret, 2Factor API Key, JWT Secret) to Git. Use `.env.local` for local development and Cloudflare Worker Secrets (`wrangler secret put`) for production.

---

## Non-Secret Infrastructure Endpoints
- **MongoDB Cluster:** `mongodb+srv://<db_username>:<db_password>@silkmodefashion.cfzhlo8.mongodb.net/silkmodefashion`
- **Cloudflare R2 Public Read URL:** `https://pub-e469e267b4b049eda6d26e83f2ebe5a7.r2.dev`
- **Cloudflare R2 S3 API Endpoint:** `https://<account_id>.r2.cloudflarestorage.com`

---

## Database Schema Overview (MongoDB Atlas)

1. **`users`**: `_id`, `phone` (unique sparse), `email` (unique sparse), `googleId`, `name`, `role` (`"customer" | "admin"`), `addresses[]`, `createdAt`, `updatedAt`.
2. **`otp_sessions`**: `_id`, `phone`, `twoFactorSessionId`, `attempts`, `expiresAt` (TTL index for auto-cleanup).
3. **`products`**: `_id`, `slug` (unique), `name`, `category`, `code`, `price`, `originalPrice`, `badge`, `description`, `fabric`, `work`, `sareeLength`, `blouseDetails`, `weight`, `images[]`, `colors[]` (`name`, `hex`, `sku`, `stock`, `imageIndexes[]`), `trending`, `featured`, `isActive`, `createdAt`, `updatedAt`.
4. **`carts`**: `_id`, `userId` (unique), `items[]` (`productId`, `colorName`, `quantity`), `updatedAt`.
5. **`orders`**: `_id`, `orderNumber` (unique), `userId`, `items[]` (purchase-time snapshot: `productId`, `name`, `code`, `colorName`, `priceAtPurchase`, `quantity`, `image`), `shippingAddress`, `subtotal`, `shippingFee`, `totalAmount`, `paymentMethod` (`"razorpay" | "cod"`), `paymentStatus` (`"pending" | "paid" | "failed" | "refunded"`), `razorpayOrderId`, `razorpayPaymentId`, `orderStatus` (`"placed" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled"`), `trackingNumber`, `courierName`, `statusHistory[]`, `deliveredAt`, `cancelledAt`, `cancelReason`, `createdAt`.
6. **`return_requests`**: `_id`, `orderId`, `userId`, `items[]`, `reason` (`"damaged" | "wrong_product" | "incorrect_color"`), `description`, `proofImages[]` (R2 URLs), `status` (`"requested" | "approved" | "rejected" | "picked_up" | "refunded"`), `refundAmount`, `refundDetails`, `adminNote`, `createdAt`, `updatedAt`.
7. **`webhook_events`**: `_id`, `eventId` (unique), `provider` (`"razorpay"`), `eventType`, `processedAt`.

---

## Phased Development Roadmap

### Phase 1: Infrastructure, Database, R2 & OpenNext Setup
- **Goals:**
  - Configure `.env.local` (gitignored) and `env.example` template.
  - Add `pub-e469e267b4b049eda6d26e83f2ebe5a7.r2.dev` to `next.config.js` `images.remotePatterns`.
  - Set up `@opennextjs/cloudflare` & `wrangler.jsonc` (`nodejs_compat` enabled for MongoDB driver).
  - Create singleton MongoDB Atlas connection helper (`src/lib/db.ts`) and indexes.
  - Create Cloudflare R2 S3-compatible presigned upload helper (`src/lib/r2.ts`).
  - Build an idempotent seed script (`src/scripts/seed-products.ts`) to import all 114 products from `src/data/products.ts` into MongoDB with colour-level `stock` and `sku`.
- **Verification:** Health check endpoint `/api/health` confirms MongoDB ping + R2 config; seeded product count matches 114.

### Phase 2: Customer Authentication (2Factor Mobile OTP + Google Sign-In)
- **Goals:**
  - Build `/api/auth/otp/send` and `/api/auth/otp/verify` using 2Factor API + `otp_sessions` (rate-limited, expiry-enforced).
  - Build `/api/auth/google` verifying Google ID tokens server-side.
  - Issue HTTP-only, `Secure`, `SameSite=Lax` signed JWT session cookies (`src/lib/auth.ts`).
  - Build `/api/auth/me`, `/api/auth/logout`, and `/api/account/addresses` (saved shipping addresses).
  - Create Login modal/page and `/account` profile page; integrate into `Header.tsx`.
- **Verification:** OTP send/verify, invalid OTP rejection, Google login, session persistence across reloads.

### Phase 3: Dynamic Catalogue, Colour Variants & Cart
- **Goals:**
  - Switch Homepage, `/collections`, and `/products/[slug]` to read live products & colour-variant stock from MongoDB.
  - Add Cart state (`CartContext`) with `localStorage` fallback for guests and `/api/cart` + `/api/cart/merge` for logged-in users.
  - Build slide-over Cart Drawer and wire "Add to Cart" + "Buy Now" in `ProductCard.tsx`, `ProductQuickViewModal.tsx`, and `ProductDetailClient.tsx`.
- **Verification:** Colour-specific stock display, out-of-stock guard, guest-to-login cart merge.

### Phase 4: Checkout, Razorpay + COD & Notifications
- **Goals:**
  - Build `/checkout` page with address selection, payment method (`razorpay` or `cod`), and order summary.
  - Build `/api/checkout/create-order`: validates stock, computes totals strictly on server from MongoDB, atomically decrements variant stock, creates Razorpay order (if online) or places COD order.
  - Build `/api/payments/verify` (HMAC-SHA256 signature verification) and `/api/webhooks/razorpay` (signature + `webhook_events` idempotency).
  - Integrate 2Factor SMS & Resend Email notification helper (`src/lib/notifications.ts`).
- **Verification:** Razorpay test-mode payment, tampered signature rejection, COD placement, webhook idempotency, SMS/email delivery.

### Phase 5: Customer Order History, Cancellation & 3-Day Returns
- **Goals:**
  - Build `/orders` and `/orders/[id]` pages showing status timeline, items, tracking details, and invoice summary.
  - Build `/api/orders/[id]/cancel` allowing cancellation only before `shipped` status (restores stock + triggers refund if paid).
  - Build `/api/orders/[id]/return` enforcing `orderStatus === "delivered"`, `<= 3 days` from `deliveredAt`, and valid reasons (`damaged`, `wrong_product`, `incorrect_color`) with R2 proof image uploads.
- **Verification:** Cancellation blocked after `shipped`; return blocked after 3 days or invalid reason.

### Phase 6: Protected Admin Panel (RBAC)
- **Goals:**
  - Enforce `role === "admin"` in Next.js middleware and every `/api/admin/*` route.
  - Build `/admin` dashboard:
    - Product CRUD (create/edit/archive products).
    - Direct-to-R2 multi-image uploader.
    - Colour variant & stock/SKU manager.
    - Order management (update status `confirmed` → `packed` → `shipped` → `delivered`, add courier/tracking, trigger notifications).
    - Return/Refund queue (inspect proof images, approve/reject, mark refunded).
- **Verification:** Non-admin receives `403 Forbidden` on `/admin` and `/api/admin/*`; full end-to-end admin product & order lifecycle test.

---

## Confirmed Business Decisions
1. **Shipping Fee:** Free shipping above ₹999; fixed ₹99 delivery charge for orders ₹999 and below.
2. **COD Rules:** Cash on Delivery allowed up to ₹10,000 order value; no extra COD fee.
3. **Existing 1,043 Images:** Migrate all existing product images from `public/images/products/` to Cloudflare R2 (`https://pub-e469e267b4b049eda6d26e83f2ebe5a7.r2.dev`).
4. **COD Return Refunds:** Collect customer UPI ID / Bank details in the return form for manual bank/UPI refund.
5. **Initial Admin Account:** `silkmodefashion06@gmail.com`.
