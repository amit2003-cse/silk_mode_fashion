# Silk Mode Fashion — Premium Saree Catalogue & Ethnic E-Commerce

A luxury, high-conversion frontend saree catalogue and ethnic wear website for **Silk Mode Fashion**, inspired by the visual hierarchy and shopping experience of [Vastrang.in](https://vastrang.in/).

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed for effortless product exploration and instant conversion via **direct WhatsApp enquiries**.

---

## 🌟 Key Features

### 1. Editorial Hero Carousel
- **Auto-Swapping 2-Slide Banner**: Automatically transitions every 4.5 seconds (pauses on user hover).
- **Interactive Navigation**: Left (`<`) and Right (`>`) arrows, along with slide indicator dots.
- **Promotional CTAs**: Direct "SHOP NOW" and "EXPLORE COLLECTION" buttons linked to the catalogue.

### 2. Shop by Collection
- **Circular Category Cards**: 6 categories in a clean desktop row and a **3×2 mobile grid**.
- High-res preview imagery for Banarasi Silk, Kanjivaram, Bridal Collection, Organza, Chanderi, and Party Wear.

### 3. Trending Saree Catalogue
- **Responsive Grid**: 4 columns on desktop, **2 columns on mobile** (no horizontal overflow).
- Product cards featuring promotional tags (`BUY 2 GET 1 FREE`), quick view modal trigger, selling price, and crossed-out MRP.
- **1-Click WhatsApp Enquiry Button** on every card.

### 4. Dedicated All-Sarees Page (`/collections`)
- **Filter Slide-Over Drawer**: Filter by fabric/category and price range (Under ₹2,500, ₹2,500 - ₹4,000, Above ₹4,000).
- **Explicit Application**: Filters update in a draft state and only apply when clicking the **"Apply Filters"** button.
- **Sort by Dropdown**: Featured, Price (Low to High), Price (High to Low), and Alphabetical (A-Z).
- **View Toggle**: Switches between 2-column grid and 1-column list view (defaults to 2 columns on mobile).

### 5. Social Proof & Brand Trust Sections
- **"Our Customers Love Us"**: Two continuous horizontal marquee rows of verified customer reviews with avatars and 5-star ratings.
- **"Discover Timeless Elegance"**: Brand story container featuring an artistic golden brush stroke underline.
- **Curated Instagram Lookbook**: 12-image grid (6×2) showcasing saree drapes, fabric close-ups, and dispatch packaging.

### 6. Mobile-First Optimization & UX
- **Sticky 4-Tab Bottom Navigation**: *Home*, *Shop*, *Collections*, *Help*.
- **iOS Safari Auto-Zoom Fix**: All inputs enforce `font-size: 16px` with viewport locking to eliminate annoying manual zoom-out behavior on iPhones.
- **Floating WhatsApp Button**: Clean, official WhatsApp vector icon fixed at the bottom-right corner with subtle pulse animation.

---

## 💬 WhatsApp Conversion Funnel

The website uses a zero-backend, direct-to-WhatsApp architecture powered by `src/lib/whatsapp.ts`:
- **Client Contact**: `+91 7359345438`
- When a customer clicks **"Enquire on WhatsApp"**, it opens `https://wa.me/917359345438` with an encoded pre-filled message:
  ```text
  Namaste Silk Mode Fashion! 🙏
  I am interested in this saree:

  Product: Royal Crimson Kadhwa Banarasi Silk Saree
  Price: ₹3,499
  Category: Banarasi Silk
  Code: SM-BAN-101

  Please share more details, fabric quality, and real photos/videos on WhatsApp. Thank you!
  ```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React & Official SVGs
- **Images**: Next.js Image Component (`next/image`)
- **Architecture**: 100% Static Frontend (zero backend costs, zero database overhead)

---

## 📁 Project Structure

```
surat/
├── public/
│   └── images/               # Brand logo, hero slides, and promo banners
├── src/
│   ├── app/
│   │   ├── collections/
│   │   │   └── page.tsx      # All products catalogue with filters & sort
│   │   ├── globals.css       # Tailwind directives & marquee animations
│   │   ├── layout.tsx        # Root layout, viewport metadata, floating widgets
│   │   └── page.tsx          # Homepage composing all primary sections
│   ├── components/
│   │   ├── AnnouncementBar.tsx # Scrolling top promotional marquee
│   │   ├── BrandElegance.tsx   # Timeless elegance narrative section
│   │   ├── BrandStory.tsx      # Heritage weaving story
│   │   ├── CustomerReviews.tsx # 2-row scrolling customer review pills
│   │   ├── FloatingWhatsApp.tsx# Bottom-right pulsating WhatsApp FAB
│   │   ├── Footer.tsx          # Wine/maroon footer with accordions & contact
│   │   ├── Header.tsx          # Responsive white header with centered logo
│   │   ├── HeroBanner.tsx      # Auto-swapping 2-slide carousel
│   │   ├── InstagramSection.tsx# 12-photo Instagram lookbook grid
│   │   ├── MobileBottomNav.tsx # 4-tab mobile sticky footer
│   │   ├── ProductCard.tsx     # Reusable saree card with WhatsApp action
│   │   ├── ProductQuickViewModal.tsx # Full-screen quick view modal
│   │   ├── PromotionalBanner.tsx # Artisan handloom showcase banner
│   │   ├── ShopByCollection.tsx# Circular category grid (6 cols / 3x2 mobile)
│   │   ├── TrendingCollection.tsx # Trending 4-col / 2-col product grid
│   │   └── WhyChooseUs.tsx     # 4 trust pillars
│   ├── data/
│   │   ├── collections.ts      # Collection category metadata
│   │   └── products.ts         # Static product catalogue entries
│   └── lib/
│       └── whatsapp.ts         # WhatsApp URL generator & message formatter
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📝 Managing Catalogue Data

To add, edit, or remove sarees:
1. Open `src/data/products.ts`.
2. Add or modify entries in the `PRODUCTS_DATA` array:
   ```typescript
   {
     id: "sm-09",
     slug: "royal-emerald-bridal-silk",
     name: "Royal Emerald Pure Katan Silk Saree",
     category: "Bridal Collection",
     code: "SM-BRD-109",
     price: 4499,
     originalPrice: 8999,
     badge: "BUY 2 GET 1 FREE",
     description: "Exquisite handwoven zari work with scalloped border.",
     fabric: "100% Pure Katan Silk",
     images: ["/images/your-saree.jpg"],
     trending: true,
     featured: true,
     inStock: true
   }
   ```
3. Save and redeploy.

---

## 📄 License & Attribution

Designed and engineered for **Silk Mode Fashion**.  
Contact & WhatsApp: **+91 7359345438**
