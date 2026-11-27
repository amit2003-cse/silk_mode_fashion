# Pending Tasks & Next Phases — SilkMode Fashion E-Commerce

**Last Updated:** 2026-11-27  
**Completed So Far:** Phases 1–6 (MongoDB Atlas, Cloudflare R2 1,042 images migrated, 114 products seeded, Google Sign-In, 2Factor OTP APIs, Dynamic Catalogue & Hybrid Cart, Checkout + Razorpay + COD + Webhook + Notifications, Order History + Cancellation + 3-Day Returns, and RBAC Protected Admin Panel).

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

## 2. Deployment & End-to-End Verification (Pending)
- [ ] Configure Cloudflare Worker Secrets (`wrangler secret put ...`) for all server-side env vars.
- [ ] Run OpenNext build & deploy to Cloudflare Workers (`@opennextjs/cloudflare` + `wrangler deploy`).
- [ ] Verify `/api/health`, Google Sign-In, OTP, Razorpay test/live checkout, webhook delivery, and admin RBAC in production.
