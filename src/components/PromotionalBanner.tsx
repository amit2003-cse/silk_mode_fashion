"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Award } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/gtm";

export default function PromotionalBanner() {
  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 bg-[#230C12] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/promo-banner.jpg"
          alt="SilkMode Fashion Surat - Handloom Weaving Heritage"
          fill
          className="object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#230C12] via-[#230C12]/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center space-x-2 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-4">
            <Award className="w-4 h-4" />
            <span>Master Weaver Craftsmanship</span>
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#FAF6F0] font-normal leading-snug">
            Authentic Weaves From The Heart of Tradition
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#E6DDD0] leading-relaxed">
            Every saree at SilkMode Fashion Surat is woven with pure mulberry silk yarns, real zari brocades, and weeks of meticulous artisan dedication. Experience heirloom quality crafted for generations at direct manufacturer prices.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              href="#collections"
              className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#C5A059] text-[#2B1704] text-xs font-bold tracking-wider uppercase text-center transition shadow"
            >
              Discover Handlooms
            </Link>

            <a
              href={getGeneralWhatsAppUrl("Hello, I would like to enquire about your custom handloom saree collection.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ button_location: "promo_banner_stylist" })}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF6F0] text-xs font-semibold tracking-wider text-center transition border border-white/20"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Ask Our Stylist</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

