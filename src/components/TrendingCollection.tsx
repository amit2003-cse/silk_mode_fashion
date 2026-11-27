"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRODUCTS_DATA, SareeProduct } from "@/data/products";
import ProductCard from "./ProductCard";

interface TrendingCollectionProps {
  products?: SareeProduct[];
  onQuickView: (product: SareeProduct) => void;
}

// 5 Curated Top-Tier Best Products
const CURATED_IDS = [
  "sm-kan-01", // Designed Kanjivaram Rich Tissue Embroidery
  "sm-geo-19", // Pure Viscose Georgette with Patola Checks & Jarkan Mirror
  "sm-msl-29", // Elegant Muslin Suit Set with Delicate Aari Embroidery
  "sm-ban-43", // Soft Banarasi Silk Saree with Self Weaving Motifs
  "sm-spc-51", // Space Silk Saree with Sparkling Jarkhan Work
];

export default function TrendingCollection({
  products = PRODUCTS_DATA,
  onQuickView,
}: TrendingCollectionProps) {
  const [showAll, setShowAll] = useState(false);

  // Top 5 curated products
  const topCurated = CURATED_IDS
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is SareeProduct => Boolean(p));

  // Fallback in case any id is missing
  const initialProducts = topCurated.length >= 4 ? topCurated : products.slice(0, 5);

  // Active products list
  const displayedProducts = showAll ? products : initialProducts;

  return (
    <section id="trending" className="py-12 sm:py-20 bg-stone-50/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#58111A]">
            Direct Surat Weaves
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mt-1">
            Trending Collection
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-stone-500 font-normal">
            {showAll
              ? `Showing all ${products.length} handcrafted sarees and designer suits.`
              : "Handpicked signature sarees & suits, adored by our customers."}
          </p>
        </div>

        {/* Product Cards Grid:
            Desktop: 4 columns (or 5 if 5 items on single row, responsive)
            Mobile: 2 columns (Exact Vastrang layout)
        */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>

        {/* Bottom Decorative Slider Track & View All Button */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center">
          {/* Progress / Slider Track Indicator */}
          <div className="w-44 sm:w-64 h-1 bg-stone-200 rounded-full overflow-hidden mb-5">
            <div
              className={`h-full bg-[#58111A] rounded-full transition-all duration-500 ${
                showAll ? "w-full" : "w-1/4"
              }`}
            />
          </div>

          {!showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center justify-center px-9 py-3 rounded-full bg-[#58111A] hover:bg-[#430D14] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              View All ({products.length} Products)
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAll(false);
                  document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center px-7 py-2.5 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-medium text-xs sm:text-sm transition shadow-xs cursor-pointer"
              >
                Show Top Picks Only
              </button>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-8 py-2.5 rounded-full bg-[#58111A] hover:bg-[#430D14] text-white font-semibold text-xs sm:text-sm transition shadow hover:shadow-md"
              >
                Open Full Catalog with Filters →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
