"use client";

import React from "react";
import Link from "next/link";
import { PRODUCTS_DATA, SareeProduct } from "@/data/products";
import ProductCard from "./ProductCard";

interface TrendingCollectionProps {
  onQuickView: (product: SareeProduct) => void;
}

export default function TrendingCollection({ onQuickView }: TrendingCollectionProps) {
  // Take trending items
  const trendingProducts = PRODUCTS_DATA.filter((p) => p.trending);

  return (
    <section id="trending" className="py-14 sm:py-20 bg-stone-50/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Trending Collection
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-500 font-normal">
            Our most-loved trending sarees, chosen by thousands.
          </p>
        </div>

        {/* Product Cards Grid:
            Desktop: 4 columns
            Mobile: 2 columns (Exact vastrang layout)
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>

        {/* Bottom Decorative Slider Track & View All Pill Button (Vastrang style) */}
        <div className="mt-12 flex flex-col items-center">
          {/* Slider track indicator */}
          <div className="w-44 sm:w-64 h-1 bg-stone-200 rounded-full overflow-hidden mb-6">
            <div className="w-1/2 h-full bg-stone-800 rounded-full" />
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center justify-center px-9 py-3 rounded-full bg-[#6B3E39] hover:bg-[#542F2B] text-white font-medium text-sm tracking-wide transition shadow hover:shadow-md cursor-pointer"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
