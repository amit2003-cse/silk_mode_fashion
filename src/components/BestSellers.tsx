"use client";

import React from "react";
import { PRODUCTS_DATA, SareeProduct } from "@/data/products";
import ProductCard from "./ProductCard";

interface BestSellersProps {
  onQuickView: (product: SareeProduct) => void;
}

export default function BestSellers({ onQuickView }: BestSellersProps) {
  // Select featured products
  const bestSellerProducts = PRODUCTS_DATA.filter((p) => p.featured);

  return (
    <section id="bestsellers" className="py-12 sm:py-16 md:py-20 bg-[#FAF7F2] border-b border-[#E8DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-normal text-[#2B2927] tracking-tight">
            Best Sellers & Featured Weaves
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#6E675F]">
            Timeless bridal silks and celebratory weaves that never go out of style.
          </p>
        </div>

        {/* 4 columns desktop / 2 columns mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      </div>
    </section>
  );
}

