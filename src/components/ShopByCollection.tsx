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
    <section id="collections" className="py-14 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Vastrang Style) */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Shop by Collection
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-500 font-normal">
            Discover designer sarees for every occasion.
          </p>
        </div>

        {/* Circular Collection Cards Grid:
            Desktop: 6 in a single balanced row
            Mobile: 3 columns x 2 rows (Exact vastrang layout)
        */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
          {COLLECTIONS_DATA.map((item: CollectionItem) => (
            <Link
              key={item.id}
              href="/collections"
              onClick={() => onSelectCategory?.(item.name)}
              className="group flex flex-col items-center text-center cursor-pointer w-full max-w-[160px]"
            >
              {/* Circular Image Container (Slightly larger, matching Vastrang) */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden p-1 border-2 border-stone-200 group-hover:border-[#58111A] transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:scale-105 bg-stone-100">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Title below circle */}
              <h3 className="mt-3.5 text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-[#58111A] transition-colors leading-tight">
                {item.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
