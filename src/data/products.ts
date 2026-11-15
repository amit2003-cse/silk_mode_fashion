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
  images: string[];
  colors?: ProductColor[];
  trending: boolean;
  featured: boolean;
  inStock?: boolean;
}

export const PRODUCTS_DATA: SareeProduct[] = [
  {
    id: "sm-01",
    slug: "royal-crimson-banarasi-silk-saree",
    name: "Royal Crimson Kadhwa Banarasi Silk Saree",
    category: "Banarasi Silk",
    code: "SM-BAN-101",
    price: 3499,
    originalPrice: 6999,
    badge: "BUY 2 GET 1 FREE",
    description: "Handcrafted pure katan silk saree featuring intricate gold zari floral jaal with a regal meenakari pallu and scalloped border.",
    fabric: "100% Pure Katan Silk",
    work: "Handwoven Kadhwa Zari Weave",
    sareeLength: "5.5 meters",
    blouseDetails: "Running unstitched blouse piece (0.8m) with heavy border",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    ],
    colors: [
      { name: "Royal Crimson", hex: "#722F37", imageIndex: 0 },
      { name: "Peacock Blue", hex: "#1D3557", imageIndex: 1 },
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-02",
    slug: "midnight-purple-georgette-ajrakh-print",
    name: "Luxury Party Wear Pure Satin Silk Ajrakh Print",
    category: "Party Wear",
    code: "SM-SAT-102",
    price: 1999,
    originalPrice: 4000,
    badge: "BUY 2 GET 1 FREE",
    description: "Fluid and lustrous pure satin silk saree adorned with authentic Ajrakh block motifs and shimmering mirror work border.",
    fabric: "Pure Micro Satin Silk",
    work: "Heritage Ajrakh & Mirror Work",
    sareeLength: "5.5 meters",
    blouseDetails: "Designer contrasting embroidered blouse piece (0.8m)",
    images: [
      "https://images.unsplash.com/photo-1610030469668-93510cb2866c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    ],
    trending: true,
    featured: false,
    inStock: true,
  },
  {
    id: "sm-03",
    slug: "festive-black-georgette-embroidered-saree",
    name: "Entrancing Festive Wear Georgette Print Drape",
    category: "Party Wear",
    code: "SM-GEO-103",
    price: 1999,
    originalPrice: 4000,
    badge: "BUY 2 GET 1 FREE",
    description: "Alluring midnight black georgette saree enriched with delicate tone-on-tone foil prints and a rich scalloped zari lace.",
    fabric: "Soft Flowing Georgette",
    work: "Foil Floral Prints & Scallop Zari Border",
    sareeLength: "5.5 meters",
    blouseDetails: "Heavy woven brocade blouse piece included",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-04",
    slug: "glossy-copper-satin-silk-ajrakh",
    name: "Glossy Party Wear Pure Satin Silk Ajrakh Print",
    category: "Party Wear",
    code: "SM-SAT-104",
    price: 1999,
    originalPrice: 4000,
    badge: "BUY 2 GET 1 FREE",
    description: "Glamorous metallic bronze satin silk saree featuring traditional round medallion prints and golden border embellishments.",
    fabric: "High Glaze Satin Silk",
    work: "Medallion Ajrakh Prints",
    sareeLength: "5.5 meters",
    blouseDetails: "Coordinated printed satin blouse piece",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
    ],
    trending: true,
    featured: false,
    inStock: true,
  },
  {
    id: "sm-05",
    slug: "blush-pink-chanderi-cotton-embroidery",
    name: "Graceful Party Wear Chanderi Cotton Embroidery",
    category: "Chanderi Handloom",
    code: "SM-CHN-105",
    price: 2249,
    originalPrice: 4300,
    badge: "BUY 2 GET 1 FREE",
    description: "Pastel blush pink Chanderi saree highlighted with delicate floral resham embroidery, fine cutwork borders, and soft tassels.",
    fabric: "Pure Chanderi Silk-Cotton",
    work: "Floral Resham Thread Embroidery & Cutwork",
    sareeLength: "5.5 meters",
    blouseDetails: "Embroidered organza neck blouse piece (0.8m)",
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-06",
    slug: "kanjivaram-temple-border-mustard-silk",
    name: "Kanjivaram Heritage Temple Border Mustard Saree",
    category: "Kanjivaram Silk",
    code: "SM-KAN-106",
    price: 4299,
    originalPrice: 8500,
    badge: "BEST SELLER",
    description: "Vibrant festive mustard yellow Kanjivaram silk saree with traditional contrast purple korvai temple border and rich zari pallu.",
    fabric: "Pure Mulberry Silk",
    work: "Korvai Weaving with Pure Gold Zari",
    sareeLength: "5.5 meters",
    blouseDetails: "Contrast royal purple blouse piece with zari border",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    ],
    trending: false,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-07",
    slug: "sky-blue-organza-cutwork-embroidered-saree",
    name: "Sky Blue Handcrafted Organza Cutwork Saree",
    category: "Organza & Tissue",
    code: "SM-ORG-107",
    price: 2799,
    originalPrice: 5200,
    badge: "NEW ARRIVAL",
    description: "Airy ethereal powder blue organza saree accented with pearl work, silver gota patti, and intricate hand-finished floral cutwork.",
    fabric: "Premium Glass Organza",
    work: "Pearl & Silver Cutwork Embroidery",
    sareeLength: "5.5 meters",
    blouseDetails: "Heavy worked matching raw silk blouse piece",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
    ],
    trending: false,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-08",
    slug: "regal-emerald-bridal-paithani-silk-saree",
    name: "Regal Emerald Green Bridal Paithani Silk Saree",
    category: "Bridal Collection",
    code: "SM-BRD-108",
    price: 5499,
    originalPrice: 10999,
    badge: "EXCLUSIVE",
    description: "Majestic deep bottle green bridal silk saree featuring peacock motifs (mor bangadi) woven into a brilliant pure gold tissue pallu.",
    fabric: "Pure Silk Paithani Weave",
    work: "Handwoven Meenakari Peacocks & Zari Tissue",
    sareeLength: "5.5 meters",
    blouseDetails: "Running green silk blouse piece with mor border",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    ],
    trending: false,
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


