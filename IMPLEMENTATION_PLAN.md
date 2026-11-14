# Implementation Plan: Silk Mode Fashion — Premium Saree Brand Homepage

**Brand Name:** Silk Mode Fashion  
**WhatsApp / Contact:** +91 7359345438  
**Design Reference:** Inspired by vastrang.in (Luxury Indian ethnic wear aesthetic)  
**Budget Scope:** ₹15,000 Premium Frontend Catalogue  
**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide-React  

---

## 1. Design Direction & Theme Palette

- **Background:** Warm Ivory / Soft Off-white (`#FDFBF7`, `#FAF6F0`)
- **Primary Brand Accent:** Deep Royal Maroon / Wine (`#5E1224`, `#6B1426`)
- **Secondary Luxury Accent:** Muted Warm Gold (`#C5A059`, `#D4AF37`)
- **Text & Neutral:** Deep Charcoal / Soft Black (`#1F1E1D`), Muted Stone (`#66625C`)
- **Typography:**
  - Headings: Editorial Classical Serif (Playfair Display / Cormorant Garamond style)
  - Body & Meta: Clean Modern Sans-serif (Inter / Plus Jakarta Sans style)
- **Vibe:** Heritage Indian elegance, spacious layout, subtle micro-interactions, high visual polish without template clutter.

---

## 2. Directory Structure to be Created

```
webdev/
├── public/
│   └── images/               # High-res saree imagery & brand assets
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with fonts, metadata, global styles
│   │   ├── page.tsx          # Homepage composing all sections
│   │   └── globals.css       # Custom color tokens, serif font imports, styling
│   ├── components/
│   │   ├── AnnouncementBar.tsx
│   │   ├── Header.tsx        # Responsive navigation, mobile drawer, search modal
│   │   ├── HeroBanner.tsx    # Editorial hero banner with CTA
│   │   ├── CollectionGrid.tsx# Shop by Collection (Banarasi, Silk, Organza, etc.)
│   │   ├── ProductCard.tsx   # Reusable product card with WhatsApp enquiry button
│   │   ├── ProductSection.tsx# Trending & Bestseller product grids
│   │   ├── ProductModal.tsx  # Quick view modal for product details
│   │   ├── PromoBanner.tsx   # Full-width handloom heritage banner
│   │   ├── TrustFeatures.tsx # Why Choose Us (Authentic weaves, WhatsApp assistance)
│   │   ├── BrandStory.tsx    # About Silk Mode Fashion
│   │   ├── InstagramGrid.tsx # Curated editorial Instagram grid
│   │   └── Footer.tsx        # Luxury footer with contact 7359345438 & links
│   ├── data/
│   │   ├── products.ts       # 10+ detailed static saree products (Banarasi, Kanjivaram, Organza, etc.)
│   │   └── collections.ts    # Featured collection categories
│   └── lib/
│       └── whatsapp.ts       # WhatsApp URL generator with pre-filled product details
├── IMPLEMENTATION_PLAN.md     # This architectural plan
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. Step-by-Step Execution Plan

### Step 1: Base Configuration & Theme Setup
- Set up `next.config.ts`, `tsconfig.json`, and Tailwind CSS configuration with customized color palette (`ivory`, `maroon`, `gold`, `charcoal`).
- Configure responsive breakpoints and typography rules in `globals.css`.

### Step 2: Product & Collection Data Architecture (`data/products.ts`)
- Model full product types:
  - `id`, `slug`, `name`, `category`, `price`, `originalPrice`, `description`, `fabric`, `work`, `sareeLength`, `blouseDetails`, `images`, `trending`, `featured`.
- Create at least 10 realistic luxury saree catalogue entries with authentic Indian weaves.

### Step 3: WhatsApp Conversion Engine (`lib/whatsapp.ts`)
- Utility functions to construct `https://wa.me/917359345438` URLs with encoded pre-formatted text:
  - Product-specific: Product name, Price, Code, and enquiry message.
  - General enquiry: Direct assistance button in header and floating button.

### Step 4: Component Implementation (Top to Bottom)
1. **Announcement Bar:** Subtle gold/maroon banner with customizable announcement.
2. **Header & Navigation:** 
   - Silk Mode Fashion branding.
   - Links: Home, New Arrivals, Collections, About Us, Contact.
   - Interactive Search overlay.
   - Direct WhatsApp shortcut to `+91 7359345438`.
   - Mobile hamburger menu with smooth slide-out drawer.
3. **Hero Banner:**
   - Editorial high-fashion saree visual.
   - "Elegance Woven in Tradition" heading with "Explore Collection" smooth anchor CTA.
4. **Shop by Collection:**
   - Category cards (Pure Banarasi Silk, Kanjivaram Heritage, Organza & Chiffon, Royal Bridal, Designer Partywear).
5. **Trending Sarees Grid:**
   - Responsive layout (4 columns desktop, 2 columns mobile).
   - Price, MRP discount tag, Quick View modal, and Instant WhatsApp enquiry button.
6. **Promotional Banner:**
   - Editorial banner highlighting the artisan handloom story.
7. **Best Sellers Section:**
   - Curated selection of top-rated handcrafted sarees.
8. **Why Choose Us:**
   - 4 key pillars: Authentic Handloom Weaves, Direct Artisan Craftsmanship, Dedicated WhatsApp Assistance, Safe All-India Delivery.
9. **About Silk Mode Fashion:**
   - Split editorial layout showcasing brand roots, dedication to pure fabrics and timeless style.
10. **Instagram Grid:**
    - High-aesthetic 6-image curated gallery with Instagram profile link.
11. **Footer:**
    - Brand description, quick navigation, WhatsApp `+91 7359345438`, business address placeholder, copyright.

### Step 5: Verification & Quality Assurance
- Responsive test on mobile (360px+), tablet, and desktop.
- Verify every WhatsApp link opens properly with encoded message.
- Ensure zero broken links or console errors.

