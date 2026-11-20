import React from "react";
import Image from "next/image";
import { MessageCircle, HeartHandshake } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function BrandStory() {
  return (
    <section id="about" className="py-14 sm:py-20 bg-[#FAF7F2] border-b border-[#E8DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Brand Visual Collage */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-2 border-[#E8DEC8] bg-stone-100">
              <Image
                src="/images/products/kanjivaram-zari-tissue-1.jpg"
                alt="SilkMode Fashion Surat - Master Artisan Handloom Heritage"
                fill
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
            {/* Floating Emblem */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:right-6 bg-[#58111A] text-[#FAF6F0] p-4 sm:p-5 rounded-2xl shadow-xl border border-[#D4AF37]/40 max-w-[200px] sm:max-w-[240px]">
              <div className="flex items-center space-x-2 text-[#D4AF37] mb-1">
                <HeartHandshake className="w-5 h-5" />
                <span className="text-[11px] font-bold tracking-widest uppercase">Pure Handlooms</span>
              </div>
              <p className="text-xs text-[#E6DDD0] leading-snug">
                Empowering generational Indian weavers since our inception.
              </p>
            </div>
          </div>

          {/* Story Text */}
          <div className="lg:pl-4">
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">
              The SilkMode Legacy
            </span>
            <h2 className="mt-2 font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#2B2927] leading-tight">
              Honoring India&apos;s Richest Weaving Traditions
            </h2>
            <div className="mt-4 space-y-3 text-sm text-[#6E675F] leading-relaxed">
              <p>
                At <strong className="text-[#2B2927]">SilkMode Fashion Surat</strong>, sarees are more than six yards of fabric; they are living heirlooms woven with love, culture, and centuries of indigenous craftsmanship direct from India&apos;s textile capital.
              </p>
              <p>
                From royal Banarasi brocades and heavy Kanjivaram silks to breezy party wear satins and organza drapes, SilkMode Fashion celebrates the woman who cherishes her roots while embracing contemporary grace.
              </p>
              <p>
                Every piece in our catalogue is thoughtfully curated for elegance, longevity, and pure drape comfort at genuine manufacturer prices.
              </p>
            </div>

            <div className="mt-8 flex items-center space-x-4">
              <a
                href={getGeneralWhatsAppUrl("Hello Silk Mode Fashion, I would love to know more about your brand and custom bridal services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#58111A] hover:bg-[#460D1B] text-[#FAF6F0] text-xs font-semibold tracking-wider uppercase transition shadow"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Chat with Founder</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

