"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS_DATA, CollectionItem } from "@/data/collections";

interface ShopByCollectionProps {
  onSelectCategory?: (categoryName: string) => void;
}

export default function ShopByCollection({ onSelectCategory }: ShopByCollectionProps) {
  return (
    <section id="categories" className="py-12 sm:py-18 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#58111A]">
            Curated Weaves
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mt-1">
            Shop by Category
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-500 font-normal">
            Explore authentic Surat sarees, designer salwar suits & bridal collections.
          </p>
        </div>

        {/* Circular Collection Cards Grid:
            Desktop: 6 in a single balanced row
            Mobile: 3 columns x 2 rows (Exact Vastrang layout)
        */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-6 lg:gap-7 justify-items-center">
          {COLLECTIONS_DATA.map((item: CollectionItem) => {
            const targetUrl = item.categoryFilter
              ? `/collections?category=${encodeURIComponent(item.categoryFilter)}`
              : "/collections";

            return (
              <Link
                key={item.id}
                href={targetUrl}
                onClick={() => onSelectCategory?.(item.categoryFilter || item.name)}
                className="group flex flex-col items-center text-center cursor-pointer w-full max-w-[150px]"
              >
                {/* Circular Image Container */}
                <div className="relative w-22 h-22 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden p-1 border-2 border-stone-200 group-hover:border-[#58111A] transition-all duration-300 shadow-2xs group-hover:shadow-md group-hover:scale-105 bg-stone-50">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 88px, (max-width: 768px) 120px, 150px"
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Title below circle */}
                <h3 className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs md:text-sm font-semibold text-stone-900 group-hover:text-[#58111A] transition-colors leading-tight">
                  {item.name}
                </h3>
                {item.count && (
                  <span className="text-[10px] text-stone-400 font-medium hidden sm:block mt-0.5">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
