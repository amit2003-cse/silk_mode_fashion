"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  Share2,
  Check,
  ShieldCheck,
  Truck,
  Video,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  ChevronDown,
  Info,
  Maximize2,
  X,
  PhoneCall,
  Star,
} from "lucide-react";
import { SareeProduct } from "@/data/products";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

interface ProductDetailClientProps {
  product: SareeProduct;
  relatedProducts: SareeProduct[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]?.name
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "story" | "care">("specs");

  // Format pricing
  const formattedPrice = `₹${product.price.toLocaleString("en-IN")}`;
  const formattedOriginalPrice = product.originalPrice
    ? `₹${product.originalPrice.toLocaleString("en-IN")}`
    : null;
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  const savingsAmount = product.originalPrice
    ? `₹${(product.originalPrice - product.price).toLocaleString("en-IN")}`
    : null;

  // Active image fallback
  const activeImage = imageError
    ? "/images/hero-banner-2.jpg"
    : product.images[selectedImageIdx] || product.images[0] || "/images/hero-banner-2.jpg";

  // Share handler
  const handleShare = async () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${product.name} | Silk Mode Fashion`,
            text: `Look at this beautiful saree from Silk Mode Fashion: ${product.name}`,
            url: window.location.href,
          });
          return;
        } catch {
          // Fallback to clipboard
        }
      }
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // WhatsApp link generator
  const currentWhatsAppUrl = getProductWhatsAppUrl({
    name: product.name,
    price: product.price,
    category: product.category,
    code: product.code,
    color: selectedColor,
  });

  // WhatsApp video inspection link
  const videoCallWhatsAppUrl = `https://wa.me/917359345438?text=${encodeURIComponent(
    `Namaste Silk Mode Fashion! 🙏\nI am interested in *${product.name}* (Code: ${product.code || "SM"}).\nCan I please request a quick live video call or video clip to inspect the saree's drape and real shine?`
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Header */}
      <Header />

      {/* 3. Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between text-xs sm:text-sm text-stone-500 overflow-x-auto">
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <Link
              href="/"
              className="hover:text-[#58111A] transition flex items-center font-medium"
            >
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <Link
              href="/collections"
              className="hover:text-[#58111A] transition font-medium"
            >
              Collections
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-stone-400 font-medium truncate max-w-[120px] sm:max-w-[200px]">
              {product.category}
            </span>
            <ChevronRight className="w-3 h-3 text-stone-400 hidden sm:inline" />
            <span className="text-[#58111A] font-semibold truncate max-w-[160px] sm:max-w-[240px] hidden sm:inline">
              {product.name}
            </span>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#58111A] hover:underline shrink-0 ml-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Sarees</span>
          </Link>
        </div>
      </div>

      {/* 4. Main Product Details Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: MEDIA GALLERY ================= */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image Container */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm group">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Promo Badge on top-left */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block bg-[#D32F2F] text-white text-xs font-bold px-3 py-1 rounded-sm shadow-md tracking-wider uppercase">
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Floating Action Buttons on top-right */}
              <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                {/* Full-Screen Lightbox Button */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="Enlarge Photo"
                  className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:text-[#58111A] hover:bg-white shadow-md transition cursor-pointer"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share Saree"
                  className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:text-[#58111A] hover:bg-white shadow-md transition cursor-pointer"
                  title="Share Link"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Click to Zoom Pill Indicator */}
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-[11px] font-medium text-stone-700 shadow-xs flex items-center space-x-1.5 opacity-90 hover:opacity-100 cursor-pointer transition"
              >
                <Maximize2 className="w-3 h-3 text-[#58111A]" />
                <span>Tap to view full resolution</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-thin">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedImageIdx === idx
                        ? "border-[#58111A] ring-2 ring-[#58111A]/20 shadow-md scale-102"
                        : "border-stone-200 opacity-70 hover:opacity-100 hover:border-stone-400"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Direct Manufacturer Tag */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 flex items-center space-x-3 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <p>
                <strong>Direct Surat Manufacturer Price:</strong> Crafted in Surat textile hub with zero retail markup. Free all-India insured shipping on prepaid inquiries.
              </p>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PRODUCT INFO & ORDERING ================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header / Titles */}
            <div className="border-b border-stone-200 pb-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#58111A] bg-[#58111A]/10 px-2.5 py-0.5 rounded-full">
                  {product.category}
                </span>
                {product.code && (
                  <span className="text-xs font-mono font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                    SKU: {product.code}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating & Social Proof */}
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center text-amber-500 space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-800">4.9</span>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs text-stone-500">128 Verified Surat Handloom Buyers</span>
              </div>

              {/* Pricing Box */}
              <div className="mt-4 flex items-baseline space-x-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-[#58111A]">
                  {formattedPrice}
                </span>

                {formattedOriginalPrice && (
                  <span className="text-base sm:text-lg text-stone-400 line-through">
                    {formattedOriginalPrice}
                  </span>
                )}

                {discountPercent && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-stone-500 font-medium">
                Inclusive of all taxes · Free Express Shipping Across India
              </p>
            </div>

            {/* Festive Promo Offer Card */}
            <div className="rounded-xl bg-gradient-to-r from-[#58111A]/10 via-amber-500/10 to-[#58111A]/10 border border-[#58111A]/20 p-3.5">
              <div className="flex items-start space-x-2.5">
                <span className="text-lg">🎁</span>
                <div className="text-xs">
                  <h4 className="font-bold text-[#58111A]">Special Festive Celebration Offer</h4>
                  <p className="text-stone-700 mt-0.5">
                    <strong>BUY 2 GET 1 FREE:</strong> Add any 3 sarees to your cart or inquiry and pay for only 2! Applicable on WhatsApp prepaid orders.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Colorways Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">
                    Selected Color:{" "}
                    <span className="text-[#58111A] font-bold">{selectedColor || "Standard"}</span>
                  </span>
                  <span className="text-stone-400 text-[11px]">
                    {product.colors.length} shades available
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  {product.colors.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c.name);
                        setSelectedImageIdx(c.imageIndex);
                      }}
                      className={`group flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer ${
                        selectedColor === c.name
                          ? "border-[#58111A] bg-[#58111A]/5 text-[#58111A] ring-2 ring-[#58111A]/20 font-bold"
                          : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PRIMARY CONVERSION CTA: Enquire on WhatsApp */}
            <div className="space-y-3 pt-2">
              <a
                href={currentWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-base shadow-lg shadow-[#25D366]/25 hover:shadow-xl hover:shadow-[#25D366]/35 transition-all duration-300 transform active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                <span>Enquire & Order on WhatsApp</span>
              </a>

              {/* Secondary CTA: Video Call Request */}
              <a
                href={videoCallWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-xs transition shadow-2xs hover:border-stone-400 cursor-pointer"
              >
                <Video className="w-4 h-4 text-[#58111A]" />
                <span>Request Live Saree Video Inspection on WhatsApp</span>
              </a>

              {/* Reassurance text */}
              <p className="text-center text-[11px] text-stone-500">
                ⚡ Direct chat with Surat weaver team · Real time response · Custom blouse stitching available
              </p>
            </div>

            {/* 4 Pillars Trust Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200">
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-stone-200/80">
                <Truck className="w-4 h-4 text-[#58111A] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h5 className="font-bold text-stone-900">Free Express Delivery</h5>
                  <p className="text-stone-500 text-[11px] mt-0.5">Dispatched within 24-48 hrs</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-stone-200/80">
                <ShieldCheck className="w-4 h-4 text-[#58111A] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h5 className="font-bold text-stone-900">100% Pure Silk Assurance</h5>
                  <p className="text-stone-500 text-[11px] mt-0.5">Certified master handloom</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-stone-200/80">
                <Video className="w-4 h-4 text-[#58111A] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h5 className="font-bold text-stone-900">Live Video Inspection</h5>
                  <p className="text-stone-500 text-[11px] mt-0.5">Check drape before packing</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-stone-200/80">
                <Sparkles className="w-4 h-4 text-[#58111A] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h5 className="font-bold text-stone-900">Direct Surat Price</h5>
                  <p className="text-stone-500 text-[11px] mt-0.5">Zero middlemen commission</p>
                </div>
              </div>
            </div>

            {/* Product Specifications & Story Tabs */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center space-x-2 border-b border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("specs")}
                  className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    activeTab === "specs"
                      ? "text-[#58111A] border-b-2 border-[#58111A]"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  Specifications
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("story")}
                  className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    activeTab === "story"
                      ? "text-[#58111A] border-b-2 border-[#58111A]"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  Description
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("care")}
                  className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    activeTab === "care"
                      ? "text-[#58111A] border-b-2 border-[#58111A]"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  Care & Wash
                </button>
              </div>

              <div className="pt-4 text-xs text-stone-700 leading-relaxed">
                {activeTab === "specs" && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-3 py-1.5 border-b border-stone-100">
                      <span className="font-semibold text-stone-500">Fabric</span>
                      <span className="col-span-2 text-stone-900 font-medium">
                        {product.fabric || "Premium Handloom Silk"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 py-1.5 border-b border-stone-100">
                      <span className="font-semibold text-stone-500">Weave & Work</span>
                      <span className="col-span-2 text-stone-900 font-medium">
                        {product.work || "Intricate Zari Handloom Weaving"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 py-1.5 border-b border-stone-100">
                      <span className="font-semibold text-stone-500">
                        {product.category.toLowerCase().includes("lehenga") ? "Flair & Sizing" : "Length"}
                      </span>
                      <span className="col-span-2 text-stone-900 font-medium">
                        {product.sareeLength || "5.5 Meters Standard"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 py-1.5 border-b border-stone-100">
                      <span className="font-semibold text-stone-500">Blouse Piece</span>
                      <span className="col-span-2 text-stone-900 font-medium">
                        {product.blouseDetails || "0.8m Matching Unstitched Blouse Piece Included"}
                      </span>
                    </div>
                    {product.weight && (
                      <div className="grid grid-cols-3 py-1.5 border-b border-stone-100">
                        <span className="font-semibold text-stone-500">Weight</span>
                        <span className="col-span-2 text-stone-900 font-medium">
                          {product.weight}
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-3 py-1.5 border-b border-stone-100">
                      <span className="font-semibold text-stone-500">Occasion</span>
                      <span className="col-span-2 text-stone-900 font-medium">
                        Festivals, Weddings, Ceremonies, Reception & Party Wear
                      </span>
                    </div>
                    <div className="grid grid-cols-3 py-1.5">
                      <span className="font-semibold text-stone-500">Origin</span>
                      <span className="col-span-2 text-stone-900 font-medium">
                        Surat, Gujarat, India (Silk Mode Fashion Weaving Atelier)
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "story" && (
                  <div className="space-y-3">
                    <p>{product.description}</p>
                    <p className="text-stone-600">
                      This masterwork saree is woven with traditional precision, combining timeless Indian heritage motifs with fluid modern elegance. Drapes gracefully with rich fall, making it a proud heirloom to cherish.
                    </p>
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="space-y-2">
                    <p className="font-bold text-stone-900">How to Care for Your Handcrafted Saree:</p>
                    <ul className="list-disc pl-4 space-y-1 text-stone-600">
                      <li>Dry clean only for the first few washes to preserve zari brilliance and fabric luster.</li>
                      <li>Store in a clean, breathable cotton or muslin bag.</li>
                      <li>Avoid spraying perfumes, deodorants, or direct liquids onto the zari border.</li>
                      <li>Iron on low-medium reverse heat with a protective cloth layer.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ================= RELATED / RECOMMENDED SAREES ================= */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-12 border-t border-stone-200">
            <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                You May Also Like
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-stone-500">
                Explore hand-selected sarees that beautifully match this style.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ================= FULL-SCREEN IMAGE LIGHTBOX MODAL ================= */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close Lightbox"
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative w-full max-w-3xl max-h-[85vh] aspect-[3/4] sm:aspect-[4/5]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          <p className="mt-4 text-xs text-white/70 font-medium">
            {product.name} · {selectedColor || "Primary Shade"}
          </p>
        </div>
      )}

      {/* ================= STICKY MOBILE BOTTOM ENQUIRY BAR ================= */}
      <div className="md:hidden fixed bottom-16 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2.5 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
          <div className="relative w-10 h-12 rounded overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
            <Image src={activeImage} alt={product.name} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#58111A] leading-tight">{formattedPrice}</p>
            <p className="text-[10px] text-stone-500 truncate max-w-[120px]">{product.name}</p>
          </div>
        </div>

        <a
          href={currentWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-[#25D366] text-white font-bold text-xs shrink-0 shadow-md active:scale-95 transition"
        >
          <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
          <span>Enquire on WhatsApp</span>
        </a>
      </div>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
