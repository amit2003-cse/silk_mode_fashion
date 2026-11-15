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


