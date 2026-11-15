"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, MessageCircle, CheckCircle, Sparkles } from "lucide-react";
import { SareeProduct } from "@/data/products";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";

interface ProductQuickViewModalProps {
  product: SareeProduct | null;
  onClose: () => void;
}

export default function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  // Sync state when product opens
  useEffect(() => {
    if (product) {
      setSelectedImageIdx(0);
      setSelectedColor(product.colors?.[0]?.name);
    }
  }, [product]);

  if (!product) return null;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 z-10 flex flex-col md:flex-row max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 text-stone-700 hover:text-stone-900 flex items-center justify-center shadow-md transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 bg-stone-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-200">
          <div className="relative aspect-[3/4] w-full max-w-[260px] sm:max-w-[280px] rounded-xl overflow-hidden shadow-xs bg-white">
            <Image
              src={product.images[selectedImageIdx] || product.images[0] || "/images/hero-banner-2.jpg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 mt-3 overflow-x-auto max-w-full pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIdx(idx);
                    // Match corresponding color if any
                    const matchedColor = product.colors?.find((c) => c.imageIndex === idx);
                    if (matchedColor) setSelectedColor(matchedColor.name);
                  }}
                  className={`relative w-12 h-14 rounded-md overflow-hidden border-2 transition shrink-0 ${
                    selectedImageIdx === idx ? "border-[#58111A] scale-105" : "border-stone-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Saree Details */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              <span>{product.category}</span>
              {product.code && <span>• {product.code}</span>}
            </div>

            <h3 className="font-serif-luxury text-lg sm:text-2xl text-stone-900 leading-snug">
              {product.name}
            </h3>

            {/* Price section */}
            <div className="mt-2.5 flex items-baseline space-x-2.5">
              <span className="text-xl sm:text-2xl font-bold text-[#58111A]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {discountPercent && (
                <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Multi-Color Swatches (Method 1) */}
            {product.colors && product.colors.length > 1 && (
              <div className="mt-3.5 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-stone-800">Available Shades:</span>
                  <span className="text-stone-600 font-medium">{selectedColor}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  {product.colors.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      title={c.name}
                      onClick={() => {
                        setSelectedImageIdx(c.imageIndex);
                        setSelectedColor(c.name);
                      }}
                      style={{ backgroundColor: c.hex }}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        selectedColor === c.name
                          ? "ring-2 ring-offset-2 ring-[#58111A] scale-110"
                          : "border-stone-300 opacity-80 hover:opacity-100"
                      }`}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications checklist */}
            <div className="mt-3.5 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-800">
              {product.fabric && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Fabric:</span>
                  <span className="font-semibold">{product.fabric}</span>
                </div>
              )}
              {product.work && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Work & Border:</span>
                  <span className="font-semibold">{product.work}</span>
                </div>
              )}
              {product.sareeLength && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Saree Length:</span>
                  <span className="font-semibold">{product.sareeLength}</span>
                </div>
              )}
              {product.blouseDetails && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Blouse Piece:</span>
                  <span className="font-semibold">{product.blouseDetails}</span>
                </div>
              )}
            </div>

            {/* Trust tags */}
            <div className="mt-3.5 flex items-center space-x-3 text-[11px] text-[#58111A]">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>100% Pure Fabric</span>
              </span>
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Ready to Ship</span>
              </span>
            </div>
          </div>

          {/* WhatsApp Direct Action Button with Selected Color */}
          <div className="mt-5 pt-3 border-t border-stone-100">
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
              className="w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BE5C] text-white font-semibold text-xs sm:text-sm shadow-md transition"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span>
                Enquire {selectedColor ? `(${selectedColor})` : ""} on WhatsApp
              </span>
            </a>
            <p className="text-center text-[10px] text-stone-400 mt-1.5">
              WhatsApp Support: +91 7359345438
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
