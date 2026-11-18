"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { SareeProduct } from "@/data/products";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";

interface ProductCardProps {
  product: SareeProduct;
  onQuickView?: (product: SareeProduct) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const router = useRouter();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]?.name
  );
  const [imageError, setImageError] = useState(false);

  const formattedPrice = `Rs. ${product.price.toLocaleString("en-IN")}`;
  const formattedOriginalPrice = product.originalPrice
    ? `MRP ₹${product.originalPrice.toLocaleString("en-IN")}`
    : null;

  // Fallback image if remote URL fails
  const imageSource = imageError
    ? "/images/hero-banner-2.jpg"
    : product.images[currentImageIdx] || product.images[0] || "/images/hero-banner-2.jpg";

  const productUrl = `/products/${product.slug}`;

  // Card click navigates to dedicated Product Detail Page
  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if click wasn't on an interactive child element (button, a, input)
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    router.push(productUrl);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-stone-400 shadow-2xs hover:shadow-lg transition-all duration-300 w-full min-w-0 cursor-pointer"
    >
      {/* Product Image Frame */}
      <Link
        href={productUrl}
        className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden block"
      >
        <Image
          src={imageSource}
          alt={product.name}
          fill
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />



        {/* Desktop Quick "View Details" Overlay Button */}
        <div className="hidden sm:block absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <div className="w-full py-2 px-3 rounded-lg bg-white/95 text-stone-800 text-xs font-semibold tracking-wider uppercase shadow-md text-center">
            View Details
          </div>
        </div>
      </Link>

      {/* Card Info Section */}
      <div className="p-2 sm:p-3.5 flex-1 flex flex-col justify-between bg-white min-w-0">
        <div className="min-w-0">
          {/* Category & SKU Code */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500 mb-1 truncate">
            <span className="truncate">{product.category}</span>
            {product.code && (
              <span className="hidden sm:inline text-[9px] uppercase font-mono text-stone-400 shrink-0 ml-1">
                {product.code}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link href={productUrl} className="block group/link">
            <h3
              className="text-xs sm:text-sm font-medium text-stone-900 group-hover/link:text-[#58111A] line-clamp-1 sm:line-clamp-2 transition leading-snug"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>

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

          {/* Interactive Color Swatches (Method 1) */}
          {product.colors && product.colors.length > 1 && (
            <div className="mt-2 pt-1.5 border-t border-stone-100">
              <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                <span>{product.colors.length} Shades</span>
                <span className="font-semibold text-stone-800 truncate max-w-[90px]">{selectedColor}</span>
              </div>
              <div className="flex items-center flex-wrap gap-1.5">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    title={c.name}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIdx(c.imageIndex);
                      setSelectedColor(c.name);
                    }}
                    style={{ backgroundColor: c.hex }}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-transform cursor-pointer ${
                      currentImageIdx === c.imageIndex
                        ? "ring-2 ring-offset-1 ring-[#58111A] scale-110"
                        : "border-stone-300 opacity-80 hover:opacity-100"
                    }`}
                    aria-label={`Select ${c.name}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp Direct Enquiry Action Button */}
        <div className="mt-2.5 pt-2 border-t border-stone-100">
          <a
            href={getProductWhatsAppUrl({
              name: product.name,
              price: product.price,
              category: product.category,
              code: product.code,
              color: selectedColor,
            })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-center space-x-1 py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[#25D366]/30 transition-all duration-200 text-[11px] sm:text-xs font-semibold group/btn truncate cursor-pointer"
          >
            <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#25D366] group-hover/btn:text-white transition-colors shrink-0" />
            <span className="truncate">WhatsApp Enquiry</span>
          </a>
        </div>
      </div>
    </div>
  );
}
