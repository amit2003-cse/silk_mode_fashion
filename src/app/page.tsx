import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "SilkMode Fashion Surat | Pure Handcrafted Silk Sarees & Ethnic Wear",
  description:
    "Shop authentic Banarasi, Kanjivaram, Organza sarees, and bridal lehengas at manufacturer prices from SilkMode Fashion Surat. Direct artisan weaves & all-India delivery.",
  keywords: [
    "SilkMode Fashion",
    "SilkMode Fashion Surat",
    "Surat silk sarees",
    "handcrafted sarees Surat",
    "bridal lehenga Surat",
    "designer salwar suits Surat",
    "Surat saree manufacturer",
  ],
  alternates: {
    canonical: "https://www.silkmodefashion.in/",
  },
  openGraph: {
    title: "SilkMode Fashion Surat | Pure Handcrafted Silk Sarees & Ethnic Wear",
    description:
      "Shop authentic Banarasi, Kanjivaram, Organza sarees, and bridal lehengas at manufacturer prices from SilkMode Fashion Surat. Direct artisan weaves & all-India delivery.",
    url: "https://www.silkmodefashion.in/",
    siteName: "SilkMode Fashion",
    images: [
      {
        url: "https://www.silkmodefashion.in/images/products/kanjivaram-zari-tissue-4.jpg",
        width: 1200,
        height: 630,
        alt: "SilkMode Fashion Surat - Handcrafted Silk Sarees",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SilkMode Fashion Surat | Pure Handcrafted Silk Sarees & Ethnic Wear",
    description:
      "Shop authentic Banarasi, Kanjivaram, Organza sarees, and bridal lehengas at manufacturer prices from SilkMode Fashion Surat. Direct artisan weaves & all-India delivery.",
    images: ["https://www.silkmodefashion.in/images/products/kanjivaram-zari-tissue-4.jpg"],
  },
};

export default function HomePage() {
  return <HomeClient />;
}

