"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageCircle, Eye } from "lucide-react";
import { SareeProduct } from "@/data/products";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";

interface ProductCardProps {
  product: SareeProduct;
  onQuickView?: (product: SareeProduct) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [currentImageIdx] = useState(0);
  const [imageError, setImageError] = useState(false);

  const formattedPrice = `Rs. ${product.price.toLocaleString("en-IN")}`;
  const formattedOriginalPrice = product.originalPrice
    ? `MRP ₹${product.originalPrice.toLocaleString("en-IN")}`
    : null;

  // Fallback image if remote URL fails
  const imageSource = imageError
    ? "/images/hero-banner-2.jpg"
    : product.images[currentImageIdx] || product.images[0] || "/images/hero-banner-2.jpg";

  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-stone-400 shadow-2xs hover:shadow-lg transition-all duration-300 w-full min-w-0">
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
        <Image
          src={imageSource}
          alt={product.name}
          fill
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Promo Badge on top-left (e.g. BUY 2 GET 1 FREE) */}
        {product.badge && (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-block bg-[#D32F2F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs tracking-tight uppercase max-w-[85px] sm:max-w-none truncate leading-tight">
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick View Floating Icon on top-right */}
        <div className="absolute top-2 right-2 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product);
            }}
            aria-label="Quick View"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:bg-white hover:text-[#58111A] transition shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Desktop Quick "View Details" Overlay Button */}
        <div className="hidden sm:block absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            type="button"
            onClick={() => onQuickView?.(product)}
            className="w-full py-2 px-3 rounded-lg bg-white/95 hover:bg-white text-stone-800 hover:text-[#58111A] text-xs font-semibold tracking-wider uppercase shadow-md transition text-center"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-2 sm:p-3.5 flex-1 flex flex-col justify-between bg-white min-w-0">
        <div className="min-w-0">
          {/* Category */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500 mb-1 truncate">
            <span className="truncate">{product.category}</span>
            {product.code && (
              <span className="hidden sm:inline text-[9px] uppercase font-mono text-stone-400 shrink-0 ml-1">
                {product.code}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView?.(product)}
            className="text-xs sm:text-sm font-medium text-stone-900 hover:text-[#58111A] line-clamp-1 sm:line-clamp-2 cursor-pointer transition leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price Container */}
          <div className="mt-1 sm:mt-1.5 flex items-baseline space-x-1.5 flex-wrap">
            {formattedOriginalPrice && (
              <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                {formattedOriginalPrice}
              </span>
            )}
            <span className="text-xs sm:text-sm font-bold text-[#58111A]">
              {formattedPrice}
            </span>
          </div>
        </div>

        {/* WhatsApp Direct Enquiry Action Button */}
        <div className="mt-2.5 pt-2 border-t border-stone-100">
          <a
            href={getProductWhatsAppUrl({
              name: product.name,
              price: product.price,
              category: product.category,
              code: product.code,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-1 py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[#25D366]/30 transition-all duration-200 text-[11px] sm:text-xs font-semibold group/btn truncate"
          >
            <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#25D366] group-hover/btn:text-white transition-colors shrink-0" />
            <span className="truncate">WhatsApp Enquiry</span>
          </a>
        </div>
      </div>
    </div>
  );
}
