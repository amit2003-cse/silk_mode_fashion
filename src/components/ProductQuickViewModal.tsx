"use client";

import React, { useState } from "react";
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

  if (!product) return null;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAF7F2] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E8DEC8] z-10 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 text-stone-700 hover:text-stone-900 flex items-center justify-center shadow transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 bg-white flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#E8DEC8]">
          <div className="relative aspect-[3/4] w-full max-w-[280px] rounded-xl overflow-hidden shadow-xs bg-stone-100">
            <Image
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 mt-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative w-12 h-14 rounded-md overflow-hidden border-2 transition ${
                    selectedImageIdx === idx ? "border-[#58111A]" : "border-stone-200 opacity-60"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Saree Details */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-semibold text-[#8F877C] uppercase tracking-wider mb-1">
              <span>{product.category}</span>
              {product.code && <span>• {product.code}</span>}
            </div>

            <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#2B2927] leading-snug">
              {product.name}
            </h3>

            {/* Price section */}
            <div className="mt-3 flex items-baseline space-x-3">
              <span className="text-2xl font-bold text-[#58111A]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#8F877C] line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {discountPercent && (
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-xs sm:text-sm text-[#6E675F] leading-relaxed">
              {product.description}
            </p>

            {/* Specifications checklist */}
            <div className="mt-4 pt-3 border-t border-[#E8DEC8] space-y-2 text-xs text-[#2B2927]">
              {product.fabric && (
                <div className="flex justify-between">
                  <span className="text-[#8F877C]">Fabric:</span>
                  <span className="font-semibold">{product.fabric}</span>
                </div>
              )}
              {product.work && (
                <div className="flex justify-between">
                  <span className="text-[#8F877C]">Work & Border:</span>
                  <span className="font-semibold">{product.work}</span>
                </div>
              )}
              {product.sareeLength && (
                <div className="flex justify-between">
                  <span className="text-[#8F877C]">Saree Length:</span>
                  <span className="font-semibold">{product.sareeLength}</span>
                </div>
              )}
              {product.blouseDetails && (
                <div className="flex justify-between">
                  <span className="text-[#8F877C]">Blouse Piece:</span>
                  <span className="font-semibold">{product.blouseDetails}</span>
                </div>
              )}
            </div>

            {/* Trust tags */}
            <div className="mt-4 flex items-center space-x-3 text-[11px] text-[#58111A]">
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

          {/* WhatsApp Direct Action Button */}
          <div className="mt-6 pt-4 border-t border-[#E8DEC8]">
            <a
              href={getProductWhatsAppUrl({
                name: product.name,
                price: product.price,
                category: product.category,
                code: product.code,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BE5C] text-white font-semibold text-sm shadow-md transition"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Enquire & Order on WhatsApp</span>
            </a>
            <p className="text-center text-[10px] text-[#8F877C] mt-2">
              WhatsApp support: +91 7359345438
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

