export interface ProductColor {
  name: string;
  hex: string;
  imageIndex: number;
}

export interface SareeProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  code?: string;
  description: string;
  fabric?: string;
  work?: string;
  sareeLength?: string;
  blouseDetails?: string;
  weight?: string;
  images: string[];
  colors?: ProductColor[];
  trending: boolean;
  featured: boolean;
  inStock?: boolean;
}

export const PRODUCTS_DATA: SareeProduct[] = [
  {
    id: "sm-lhg-05",
    slug: "bridal-lehenga-choli-gadhwal-silk-crystal-beads-work",
    name: "Royal Bridal Gadhwal Silk Lehenga Choli with Double Dupatta",
    category: "Bridal Lehenga",
    code: "3116-A / 3116-B",
    price: 18999,
    originalPrice: 38000,
    badge: "HEAVY BRIDAL MASTERPIECE",
    description: "Bridal Lehenga choli crafted in motif and crystal beads work with double dupatta. Pure Gadhwal silk with heavy beads work, motif embroidery, zari, and sequins studded detailing. Standard cancan and canvas attached (free size up to 42, 4.5+ meter flair). Comes with 1.2m unstitched heavy blouse and double 2.5m softnet dupattas.",
    fabric: "Gadhwal Silk Lehenga & Blouse | Softnet Double Dupatta",
    work: "Heavy Crystal Beads Work, Motif Work, Zari Embroidered & Sequins Studded",
    sareeLength: "Lehenga Flair: 4.5m+ (Free Size up to 42 with Cancan & Canvas)",
    blouseDetails: "1.2 Meter Unstitched Gadhwal Silk with Heavy Front & Back Work",
    weight: "Heavy Bridal Weight (Double Dupatta + Cancan Attached)",
    images: [
      "/images/products/bridal-lehenga-3116a-front.jpg",
      "/images/products/bridal-lehenga-3116a-portrait.jpg",
      "/images/products/bridal-lehenga-3116a-side.jpg",
      "/images/products/bridal-lehenga-3116a-back.jpg",
      "/images/products/bridal-lehenga-3116a-work-detail.jpg",
      "/images/products/bridal-lehenga-3116b-front.jpg",
      "/images/products/bridal-lehenga-3116b-side.jpg",
      "/images/products/bridal-lehenga-3116b-angle.jpg",
      "/images/products/bridal-lehenga-3116b-back.jpg",
      "/images/products/bridal-lehenga-3116b-border-detail.jpg",
      "/images/products/bridal-lehenga-3116b-work-detail.jpg",
    ],
    colors: [
      { name: "Royal Rani Pink (3116-A)", hex: "#B21A5C", imageIndex: 0 },
      { name: "Bridal Crimson Red (3116-B)", hex: "#96181C", imageIndex: 5 },
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-kan-01",
    slug: "designed-kanjivaram-zari-tissue-embroidery-saree",
    name: "Designed Kanjivaram Rich Zari Tissue Hand Embroidery Saree",
    category: "Kanjivaram Silk",
    code: "SM-KAN-750",
    price: 7500,
    originalPrice: 14999,
    badge: "BEST SELLER",
    description: "Designed Kanjivaram saree with rich zari Tissue texture, hand embroidery and elegant Tube Beads Work. Included Blouse Fabric (1 Meter Unstitched).",
    fabric: "Rich Zari Tissue Kanjivaram Silk",
    work: "Hand Embroidery & Elegant Tube Beads Work",
    sareeLength: "5.5 meters",
    blouseDetails: "Included Blouse Fabric (1 Meter Unstitched)",
    weight: "1.600 kg",
    images: [
      "/images/products/kanjivaram-zari-tissue-1.jpg",
      "/images/products/kanjivaram-zari-tissue-2.jpg",
      "/images/products/kanjivaram-zari-tissue-3.jpg",
      "/images/products/kanjivaram-zari-tissue-4.jpg",
    ],
    colors: [
      { name: "Royal Gold Tissue", hex: "#D4AF37", imageIndex: 0 },
      { name: "Seated Royal Drape", hex: "#B8860B", imageIndex: 1 },
      { name: "Blouse & Back Angle", hex: "#9E7B36", imageIndex: 2 },
      { name: "Campaign Masterpiece", hex: "#C5A059", imageIndex: 3 },
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-khd-02",
    slug: "premium-soft-khadi-raw-silk-floral-zari-saree",
    name: "Premium Soft Khadi Raw Silk Floral Zari Weaving Saree",
    category: "Khadi Raw Silk",
    code: "SM-KHD-199",
    price: 1999,
    originalPrice: 3999,
    badge: "BUY 2 GET 1 FREE",
    description: "Premium Soft Khadi raw silk saree which gives pure touch by its raw smoothness with rich multicolour zari weaving floral pallu & fine zari weaving border with all over weaving floral butties and fancy tassels with running blouse piece.",
    fabric: "Premium Soft Khadi Raw Silk (Pure Handloom Touch)",
    work: "Multicolour Zari Weaving Floral Pallu, Fine Zari Border & All-over Floral Butties with Fancy Tassels",
    sareeLength: "5.5 meters",
    blouseDetails: "Running matching raw silk blouse piece included (0.8m)",
    images: [
      "/images/products/khadi-raw-silk-navy-blue.jpg",
      "/images/products/khadi-raw-silk-turquoise-blue.jpg",
      "/images/products/khadi-raw-silk-mehendi-green.jpg",
      "/images/products/khadi-raw-silk-royal-violet.jpg",
      "/images/products/khadi-raw-silk-teal-green.jpg",
      "/images/products/khadi-raw-silk-scarlet-red.jpg",
      "/images/products/khadi-raw-silk-coffee-brown.jpg",
      "/images/products/khadi-raw-silk-rani-pink.jpg",
    ],
    colors: [
      { name: "Navy Blue", hex: "#1B365D", imageIndex: 0 },
      { name: "Turquoise Blue", hex: "#00A8CC", imageIndex: 1 },
      { name: "Mehendi Green", hex: "#557A2B", imageIndex: 2 },
      { name: "Royal Violet", hex: "#503173", imageIndex: 3 },
      { name: "Teal Green", hex: "#007A78", imageIndex: 4 },
      { name: "Scarlet Red", hex: "#C0392B", imageIndex: 5 },
      { name: "Coffee Brown", hex: "#6E3B3B", imageIndex: 6 },
      { name: "Rani Pink", hex: "#D81B60", imageIndex: 7 },
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-geo-03",
    slug: "georgette-blooming-heavy-embroidery-real-jarkan-saree",
    name: "Georgette Blooming Heavy Embroidery & Real Jarkan Work Saree",
    category: "Party Wear",
    code: "BS-PARI",
    price: 3499,
    originalPrice: 6999,
    badge: "REAL JARKAN WORK",
    description: "Georgette Blooming saree adorned with intricate heavy all-over embroidery, authentic sparkling Real Jarkan stone work, elegant cutwork scalloped borders, and an unstitched heavy designer work blouse piece.",
    fabric: "Premium Georgette Blooming",
    work: "Heavy All-Over Floral Embroidery & Real Jarkan Stone Work",
    sareeLength: "5.5 meters",
    blouseDetails: "Heavy Work Matching Designer Blouse Piece (0.8m) Included",
    images: [
      "/images/products/georgette-blooming-jarkan-model.jpg",
      "/images/products/georgette-blooming-emerald-green.jpg",
      "/images/products/georgette-blooming-cherry-red.jpg",
      "/images/products/georgette-blooming-slate-blue.jpg",
      "/images/products/georgette-blooming-plum-wine.jpg",
      "/images/products/georgette-blooming-midnight-black.jpg",
    ],
    colors: [
      { name: "Forest Green", hex: "#1E4D3E", imageIndex: 1 },
      { name: "Cherry Red", hex: "#C02E4C", imageIndex: 2 },
      { name: "Slate Blue", hex: "#3B5B6D", imageIndex: 3 },
      { name: "Plum Wine", hex: "#5A3B50", imageIndex: 4 },
      { name: "Midnight Black", hex: "#1A1A1A", imageIndex: 5 },
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-slk-04",
    slug: "silk-saree-ghungroo-work-stitched-blouse-mastani",
    name: "Pure Silk Saree with Ghungroo & Designer Stitched Blouse",
    category: "Silk Saree",
    code: "AJ-MASTANI-GHUNGROO",
    price: 2495,
    originalPrice: 4999,
    badge: "STITCHED BLOUSE",
    description: "Silk saree fabric with delicate Ghungroo embellishments, rich zari border, and fine tassels. Includes a beautiful ready-to-wear heavy work designer stitched blouse.",
    fabric: "Pure Silk Fabric",
    work: "Golden Ghungroo Embellishments, Zari Border & Pallu Tassels",
    sareeLength: "5.5 meters",
    blouseDetails: "Designer Heavy Work Stitched Blouse Included",
    images: [
      "/images/products/silk-mastani-ghungroo-model.jpg",
      "/images/products/silk-mastani-ghungroo-forest-green.jpg",
      "/images/products/silk-mastani-ghungroo-peacock-blue.jpg",
      "/images/products/silk-mastani-ghungroo-rani-pink.jpg",
      "/images/products/silk-mastani-ghungroo-royal-wine.jpg",
      "/images/products/silk-mastani-ghungroo-scarlet-red.jpg",
    ],
    colors: [
      { name: "Royal Wine", hex: "#68203B", imageIndex: 4 },
      { name: "Forest Green", hex: "#1E593A", imageIndex: 1 },
      { name: "Peacock Blue", hex: "#137B85", imageIndex: 2 },
      { name: "Rani Pink", hex: "#D81B60", imageIndex: 3 },
      { name: "Scarlet Red", hex: "#C82A2A", imageIndex: 5 },
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-spc-06",
    slug: "space-silk-2d-shaded-saree-beads-sequins-embroidery",
    name: "Space Silk 2D Shaded Saree with Fancy Indian Beads & Sequins Work",
    category: "Space Silk",
    code: "SM-SPC-199",
    price: 1999,
    originalPrice: 3999,
    badge: "2D DUAL SHADED",
    description: "Space Silk 2D shaded dual-tone saree featuring exquisite Indian beads and sequins embroidery paisley butties throughout. Drapes fluidly with ethereal dual-tone ombré and includes a matching fancy work blouse piece.",
    fabric: "Space Silk (2D Dual Tone Shaded)",
    work: "Fancy Indian Beads & Sequins Embroidery Paisley Butties with Fine Zari Border",
    sareeLength: "5.5 meters",
    blouseDetails: "Fancy Work Matching Designer Blouse Piece (0.8m) Included",
    images: [
      "/images/products/space-silk-2d-lavender-drape.jpg",
      "/images/products/space-silk-2d-taupe-drape.jpg",
      "/images/products/space-silk-2d-powder-blue-drape.jpg",
      "/images/products/space-silk-2d-sage-green-drape.jpg",
      "/images/products/space-silk-2d-palette-all.jpg",
      "/images/products/space-silk-2d-lavender-fold.jpg",
      "/images/products/space-silk-2d-taupe-fold.jpg",
      "/images/products/space-silk-2d-powder-blue-fold.jpg",
      "/images/products/space-silk-2d-sage-green-fold.jpg",
    ],
    colors: [
      { name: "Lavender Lilac", hex: "#9B84A6", imageIndex: 0 },
      { name: "Mocca Taupe", hex: "#A4887B", imageIndex: 1 },
      { name: "Powder Blue", hex: "#6C92A6", imageIndex: 2 },
      { name: "Sage Olive Green", hex: "#8A9A7B", imageIndex: 3 },
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-lhg-07",
    slug: "heavy-chinon-designer-lehenga-choli-cancan",
    name: "Heavy Chinon Designer Embroidered Lehenga Choli with Cancan",
    category: "Bridal Lehenga",
    code: "3071 / 3072",
    price: 3395,
    originalPrice: 6999,
    badge: "CANCAN ATTACHED",
    description: "Heavy Chinon designer lehenga collection with all-matching heavy Chinon blouse and heavy Chinon dupatta. Pleated royal flare attached with standard cancan inner for authentic wedding silhouette. Single piece & set to set available.",
    fabric: "Heavy Chinon Silk (Lehenga, Blouse & Dupatta)",
    work: "Floral Resham & Zari Hand Embroidery with Scalloped Border",
    sareeLength: "Pleated Royal Flair (Comes with Attached Cancan)",
    blouseDetails: "Heavy Chinon Designer Embroidered Blouse Included",
    weight: "Flared with Cancan Inner",
    images: [
      "/images/products/chinon-lehenga-3071-front.jpg",
      "/images/products/chinon-lehenga-3071-side.jpg",
      "/images/products/chinon-lehenga-3071-seated.jpg",
      "/images/products/chinon-lehenga-3072-front.jpg",
      "/images/products/chinon-lehenga-3072-seated.jpg",
      "/images/products/chinon-lehenga-3072-portrait.jpg",
    ],
    colors: [
      { name: "Rust Terracotta (3071)", hex: "#C85A27", imageIndex: 0 },
      { name: "Royal Peacock Blue (3072)", hex: "#1F487E", imageIndex: 3 },
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
];

/**
 * Get product by slug or id
 */
export function getProductBySlug(slug: string): SareeProduct | undefined {
  if (!slug) return undefined;
  const decoded = decodeURIComponent(slug).toLowerCase();
  return PRODUCTS_DATA.find(
    (p) => p.slug.toLowerCase() === decoded || p.id.toLowerCase() === decoded
  );
}

/**
 * Get related products (same category first, then others)
 */
export function getRelatedProducts(currentSlug: string, limit: number = 4): SareeProduct[] {
  const current = getProductBySlug(currentSlug);
  if (!current) return PRODUCTS_DATA.slice(0, limit);

  const sameCategory = PRODUCTS_DATA.filter(
    (p) => p.id !== current.id && p.category === current.category
  );
  const others = PRODUCTS_DATA.filter(
    (p) => p.id !== current.id && p.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, limit);
}


