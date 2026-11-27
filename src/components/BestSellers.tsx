"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRODUCTS_DATA, SareeProduct } from "@/data/products";
import ProductCard from "./ProductCard";

interface BestSellersProps {
  products?: SareeProduct[];
  onQuickView: (product: SareeProduct) => void;
}

// 6 Top Curated Best Sellers
const BEST_SELLER_CURATED_IDS = [
  "sm-lhg-05", // Royal Bridal Gadhwal Silk Lehenga
  "sm-kan-01", // Designed Kanjivaram Rich Tissue Saree
  "sm-khd-02", // Premium Soft Khadi Raw Silk Saree
  "sm-geo-03", // Georgette Blooming Heavy Embroidery & Real Jarkan Saree
  "sm-fnd-38", // Fendy Silk Beads & Sequence Cutwork Kurti Plazzo Set
  "sm-kut-46", // Traditional Kutchi Garchola Modal Silk Saree
];

export default function BestSellers({
  products = PRODUCTS_DATA,
  onQuickView,
}: BestSellersProps) {
  const [showAll, setShowAll] = useState(false);

  // All featured products
  const allFeaturedProducts = products.filter((p) => p.featured);

  // Top 6 handpicked products
  const topCurated = BEST_SELLER_CURATED_IDS
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is SareeProduct => Boolean(p));

  const initialProducts = topCurated.length >= 4 ? topCurated : allFeaturedProducts.slice(0, 6);

  // Active products list
  const displayedProducts = showAll ? allFeaturedProducts : initialProducts;

  return (
    <section id="bestsellers" className="py-12 sm:py-16 md:py-20 bg-[#FAF7F2] border-b border-[#E8DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#58111A]">
            Timeless Classics
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-normal text-[#2B2927] tracking-tight mt-1">
            Best Sellers & Featured Weaves
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-[#6E675F]">
            {showAll
              ? `Showing all ${allFeaturedProducts.length} featured bridal silks and celebratory weaves.`
              : "Timeless bridal silks and celebratory weaves that never go out of style."}
          </p>
        </div>

        {/* 6 columns on large screen for 6 initial picks / 4 cols on desktop / 2 cols mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>

        {/* Bottom Progress Track & View All Button */}
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
              View All Best Sellers ({allFeaturedProducts.length} Products)
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAll(false);
                  document.getElementById("bestsellers")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center px-7 py-2.5 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-medium text-xs sm:text-sm transition shadow-xs cursor-pointer"
              >
                Show Top 6 Only
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
