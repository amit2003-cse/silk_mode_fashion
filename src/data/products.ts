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
  {
    id: "sm-st-08",
    slug: "designer-maslin-aari-work-suit-set-original-mirror",
    name: "Designer Maslin Silk Aari Work Suit Set with Original Mirror Detailing",
    category: "Salwar Suit",
    code: "SM-SUT-199",
    price: 1999,
    originalPrice: 3999,
    badge: "SIZES UP TO 10XL",
    description: "Beautiful digital print and intricate Aari work Designer Suit Set, crafted in premium Maslin fabric enhanced with original mirror work detailing. Complete 3-piece luxury set including Top Kurta, Bottom, and Dupatta. Available in sizes M 40 up to 10XL 60.",
    fabric: "Premium Maslin with Aari Work",
    work: "Digital Print, Intricate Hand Aari Work & Original Mirror Detailing",
    sareeLength: "Complete 3-Piece Set: Top Kurta, Bottom Trouser & Dupatta",
    blouseDetails: "Sizes: L 38 / M 40 / XL 42 / XXL 44 / 3XL 46 / 4XL 48 / 5XL 50 / 6XL 52 / 7XL 54 / 8XL 56 / 9XL 58 / 10XL 60",
    weight: "0.850 kg",
    images: [
      "/images/products/maslin-suit-model-front.jpg",
      "/images/products/maslin-suit-model-walk.jpg",
      "/images/products/maslin-suit-flatlay-detail.jpg",
    ],
    colors: [
      { name: "Coffee Beige & Rust", hex: "#5A2E28", imageIndex: 0 },
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-stn-09",
    slug: "fendy-satin-silk-c-pallu-embroidery-saree",
    name: "Party & Wedding Wear Soft Fendy Satin Silk Saree with C-Pallu Embroidery",
    category: "Party Wear",
    code: "SM-FEN-299",
    price: 2999,
    originalPrice: 5999,
    badge: "C-PALLU EMBROIDERY",
    description: "Party & Wedding Wear Soft Fendy Satin silk saree featuring exquisite C-pallu embroidery with fine piping border. Paired with a 1.20 mtr unstitched Mono Banglory silk heavy embroidered blouse piece. Premium luxury drape crafted for grand wedding receptions and festive soirées.",
    fabric: "Soft Fendy Satin Silk",
    work: "C-Pallu Embroidery with Piping Border & Heritage Motifs",
    sareeLength: "5.5 meters cut",
    blouseDetails: "Mono Banglory Silk with Embroidery (1.20 mtr unstitched)",
    weight: "0.750 kg",
    images: [
      "/images/products/fendy-satin-cream-model-stand.jpg",
      "/images/products/fendy-satin-cream-model-seat.jpg",
      "/images/products/fendy-satin-cream-model-pose.jpg",
      "/images/products/fendy-satin-cream-flatlay.jpg",
      "/images/products/fendy-satin-cream-fold.jpg",
      "/images/products/fendy-satin-copper-model-stand.jpg",
      "/images/products/fendy-satin-copper-model-front.jpg",
      "/images/products/fendy-satin-copper-flatlay.jpg",
      "/images/products/fendy-satin-copper-fold.jpg",
    ],
    colors: [
      { name: "Ivory Cream", hex: "#F3EFE6", imageIndex: 0 },
      { name: "Copper Rust", hex: "#A84C2B", imageIndex: 5 },
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-lhg-10",
    slug: "designer-handwork-chandnia-silk-lehenga-choli",
    name: "Designer Handwork Chandnia Silk Lehenga Choli with Crystal Beads Work",
    category: "Bridal Lehenga",
    code: "3111-A / 3111-B / 3111-C",
    price: 11599,
    originalPrice: 24999,
    badge: "DESIGNER HANDWORK",
    description: "Designer Handwork Lehenga Choli crafted in premium Chandnia Silk. Exquisitely adorned with handwork motifs, crystal beads work, multi-thread embroidery, and intricate dori & sequins work. Standard cancan and canvas attached (free size up to 42). Complete with 1-meter unstitched blouse featuring front and back work, and 2.5-meter Chandnia Silk dupatta with four-side lace and butti work all over.",
    fabric: "Chandnia Silk (Lehenga, Blouse & Dupatta)",
    work: "Handwork Motif, Crystal Beads Work, Multi Thread Work, Dori & Sequins Work",
    sareeLength: "Lehenga: Free Size up to 42 (Standard Cancan & Canvas Attached)",
    blouseDetails: "Chandnia Silk with Same Work (1 Meter Unstitched, Front & Back Work)",
    weight: "Heavy Designer Weight (Cancan & Canvas Attached)",
    images: [
      "/images/products/chandnia-lehenga-3111a-front.jpg",
      "/images/products/chandnia-lehenga-3111a-detail.jpg",
      "/images/products/chandnia-lehenga-3111b-front.jpg",
      "/images/products/chandnia-lehenga-3111b-back.jpg",
      "/images/products/chandnia-lehenga-3111c-front.jpg",
      "/images/products/chandnia-lehenga-3111c-back.jpg",
    ],
    colors: [
      { name: "Mauve Rose (3111-A)", hex: "#8A5657", imageIndex: 0 },
      { name: "Antique Bronze Ochre (3111-B)", hex: "#9B7243", imageIndex: 2 },
      { name: "Slate Teal Cyan (3111-C)", hex: "#3C676E", imageIndex: 4 },
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-bdj-11",
    slug: "mina-kari-chauthera-bandhej-dhupiyan-silk-saree",
    name: "Mina Kari Chauthera Bandhej Dhupiyan Silk Saree",
    category: "Bandhani Silk",
    code: "SM-BDJ-350",
    price: 3500,
    originalPrice: 6999,
    badge: "MINA KARI CHAUTHERA",
    description: "Mina Kari Chauthera Bandhej Saree crafted in premium Dhupiyan Silk. 100% smooth texture with rich vibrant colors and pure handloom look. Features traditional Bandhej tie-dye dots with exquisite Banarasi Mina Kari Chauthera border and grand woven pallu. Complete with matching blouse piece.",
    fabric: "Dhupiyan Silk (100% Smooth)",
    work: "Traditional Bandhej with Banarasi Mina Kari Chauthera Zari Border & Pallu",
    sareeLength: "6.50 Meters (Including Blouse) | Width: 44–46 Inches",
    blouseDetails: "Running Dhupiyan Silk Blouse with Mina Kari Border",
    weight: "0.750 kg | Wash Care: Dry Clean Only",
    images: [
      "/images/products/bandhej-dhupiyan-rani-pink.jpg",
      "/images/products/bandhej-dhupiyan-rose-pink.jpg",
      "/images/products/bandhej-dhupiyan-maroon.jpg",
      "/images/products/bandhej-dhupiyan-mustard-yellow.jpg",
      "/images/products/bandhej-dhupiyan-navy-blue.jpg",
      "/images/products/bandhej-dhupiyan-mehendi-green.jpg",
      "/images/products/bandhej-dhupiyan-peacock-teal.jpg",
      "/images/products/bandhej-dhupiyan-bottle-green.jpg",
    ],
    colors: [
      { name: "Rani Pink", hex: "#C71585", imageIndex: 0 },
      { name: "Rose Pink", hex: "#E3287A", imageIndex: 1 },
      { name: "Maroon Wine", hex: "#7B1E28", imageIndex: 2 },
      { name: "Mustard Haldi", hex: "#C88E18", imageIndex: 3 },
      { name: "Navy Blue", hex: "#162D50", imageIndex: 4 },
      { name: "Mehendi Green", hex: "#56652B", imageIndex: 5 },
      { name: "Peacock Teal", hex: "#0C6D82", imageIndex: 6 },
      { name: "Bottle Green", hex: "#183D28", imageIndex: 7 },
    ],
    trending: true,
    featured: true,
    inStock: true,
  },
  {
    id: "sm-geo-12",
    slug: "star-georgette-multi-embroidery-saree-contrast-blouse",
    name: "Star Georgette Multi Embroidery Work Saree With Contrast Blouse",
    category: "Party Wear",
    code: "SM-STR-159",
    price: 1590,
    originalPrice: 3200,
    badge: "CUTWORK EMBROIDERY",
    description: "Star Georgette Multi Embroidery Work Saree crafted in lightweight flowy star georgette fabric. Features beautiful multi-color floral thread embroidery with intricate scalloped cutwork border and all-over delicate buttis. Paired with a contrast heavy designer embroidered blouse piece.",
    fabric: "Star Georgette (Lightweight & Graceful)",
    work: "Multi-Thread Embroidery with Scalloped Cutwork Border & All-over Buttis",
    sareeLength: "5.5 Meters Cut",
    blouseDetails: "0.80 Meter Contrast Heavy Embroidered Blouse Piece",
    weight: "0.650 kg",
    images: [
      "/images/products/star-georgette-lavender-fold.jpg",
      "/images/products/star-georgette-lavender-drape.jpg",
      "/images/products/star-georgette-beige-fold.jpg",
      "/images/products/star-georgette-beige-drape.jpg",
      "/images/products/star-georgette-teal-fold.jpg",
      "/images/products/star-georgette-teal-drape.jpg",
      "/images/products/star-georgette-olive-fold.jpg",
      "/images/products/star-georgette-olive-drape.jpg",
      "/images/products/star-georgette-mauve-fold.jpg",
      "/images/products/star-georgette-mauve-drape.jpg",
      "/images/products/star-georgette-pista-fold.jpg",
      "/images/products/star-georgette-pista-drape.jpg",
    ],
    colors: [
      { name: "Lilac Lavender", hex: "#9A7CA8", imageIndex: 0 },
      { name: "Champagne Beige", hex: "#C7B492", imageIndex: 2 },
      { name: "Sea Teal Green", hex: "#357B75", imageIndex: 4 },
      { name: "Olive Mehndi Green", hex: "#8D8828", imageIndex: 6 },
      { name: "Dusty Rose Mauve", hex: "#9B5A73", imageIndex: 8 },
      { name: "Mint Pista Green", hex: "#88A866", imageIndex: 10 },
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


