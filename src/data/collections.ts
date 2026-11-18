export interface CollectionItem {
  id: string;
  name: string;
  tagline: string;
  image: string;
  count?: string;
  slug: string;
  categoryFilter?: string;
}

export const COLLECTIONS_DATA: CollectionItem[] = [
  {
    id: "silk-sarees",
    name: "Silk Sarees",
    tagline: "Banarasi & Heritage Weaves",
    image: "/images/products/kanjivaram-zari-tissue-1.jpg",
    count: "Pure Silk",
    slug: "silk-sarees",
    categoryFilter: "Silk Saree",
  },
  {
    id: "salwar-suits",
    name: "Salwar Suits",
    tagline: "Muslin & Chanderi 3-Piece Sets",
    image: "/images/products/fendy-beads-plazzo-set-1.jpg",
    count: "New Arrival",
    slug: "salwar-suits",
    categoryFilter: "Salwar Suit",
  },
  {
    id: "space-silk",
    name: "Space Silk",
    tagline: "Zari, Jarkhan & Sequins",
    image: "/images/products/space-silk-2d-lavender-drape.jpg",
    count: "Trending",
    slug: "space-silk",
    categoryFilter: "Space Silk",
  },
  {
    id: "bandhani-garchola",
    name: "Bandhani & Garchola",
    tagline: "Traditional Modal & Kutchi",
    image: "/images/products/gaji-silk-bandhej-lehariya-1.jpg",
    count: "Artisanal",
    slug: "bandhani-garchola",
    categoryFilter: "Bandhani Silk",
  },
  {
    id: "party-wear",
    name: "Party Wear",
    tagline: "Star Georgette & Embroidered",
    image: "/images/products/georgette-blooming-jarkan-model.jpg",
    count: "Festive Drape",
    slug: "party-wear",
    categoryFilter: "Party Wear",
  },
  {
    id: "bridal-collection",
    name: "Bridal Collection",
    tagline: "Royal Zari & Heavy Embroidery",
    image: "/images/products/bridal-lehenga-3116a-portrait.jpg",
    count: "Bridal Special",
    slug: "bridal-collection",
    categoryFilter: "Bridal Lehenga",
  },
];
