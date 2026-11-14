export interface CollectionItem {
  id: string;
  name: string;
  tagline: string;
  image: string;
  count?: string;
  slug: string;
}

export const COLLECTIONS_DATA: CollectionItem[] = [
  {
    id: "banarasi",
    name: "Banarasi Silk",
    tagline: "Royal Zari & Heritage Weaves",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    count: "45+ Designs",
    slug: "banarasi-silk",
  },
  {
    id: "kanjivaram",
    name: "Kanjivaram Silk",
    tagline: "Temple Borders & Pure Silk",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    count: "38+ Designs",
    slug: "kanjivaram-silk",
  },
  {
    id: "bridal",
    name: "Bridal Collection",
    tagline: "Regal Elegance for Weddings",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    count: "50+ Designs",
    slug: "bridal-collection",
  },
  {
    id: "organza",
    name: "Organza & Tissue",
    tagline: "Lightweight Grace & Embroidery",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
    count: "32+ Designs",
    slug: "organza-tissue",
  },
  {
    id: "chanderi",
    name: "Chanderi Handloom",
    tagline: "Timeless Sheer Texture",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    count: "28+ Designs",
    slug: "chanderi-handloom",
  },
  {
    id: "partywear",
    name: "Party Wear & Satin",
    tagline: "Contemporary Drape & Sheen",
    image: "https://images.unsplash.com/photo-1610030469668-93510cb2866c?auto=format&fit=crop&w=800&q=80",
    count: "40+ Designs",
    slug: "party-wear",
  },
];

