"use client";
import React from "react";

export default function AnnouncementBar() {
  const announcements = [
    "Special Offer: Buy 2 Get 1 FREE 🎁 on Exclusive Handloom Sarees",
    "Direct Artisan Weaves & 100% Pure Fabrics",
    "Fast All India Delivery & Dedicated WhatsApp Support",
    "Discover Our Royal Banarasi & Kanjivaram Collection",
  ];

  return (
    <div className="bg-[#58111A] text-[#FAF6F0] py-2 overflow-hidden border-b border-[#701C29] text-xs font-medium tracking-wider relative select-none">
      <div className="animate-marquee flex items-center space-x-12 whitespace-nowrap">
        {/* Render repeated items to create an infinite right-to-left seamless marquee */}
        {[...announcements, ...announcements, ...announcements].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-8">
            <span className="inline-block tracking-wide">{item}</span>
            <span className="text-[#D4AF37] text-sm">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
