"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, Mail, ChevronDown } from "lucide-react";
import { CLIENT_PHONE, getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/gtm";

export default function Footer() {
  const [customerCareOpen, setCustomerCareOpen] = useState(false);
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);

  return (
    <footer className="bg-[#58111A] text-[#FAF6F0] pt-12 sm:pt-16 pb-12 sm:pb-16 border-t border-[#701C29]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#701C29]">
          {/* Brand & Need Help Section (Matching screenshot 7) */}
          <div className="lg:col-span-6 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-3.5 group">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/images/da66b080-7b45-45d1-bba8-14e0583018dc.png"
                  alt="Silk Mode Fashion"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury text-lg font-bold tracking-[0.2em] text-[#F3E5C8] uppercase leading-tight group-hover:text-white transition-colors">
                  SILK MODE
                </span>
                <span className="text-[9.5px] tracking-[0.35em] text-[#D4AF37] uppercase font-semibold leading-tight mt-0.5">
                  FASHION • SURAT
                </span>
              </div>
            </Link>

            <h3 className="text-xl sm:text-2xl font-serif-luxury text-[#E0C788] pt-2">
              Need Help?
            </h3>

            <p className="text-xs sm:text-sm text-[#E6DDD0] leading-relaxed max-w-md">
              We&apos;re here to make your saree shopping experience smooth and hassle-free. If you have any questions about our weaves, customization, orders, or delivery, our team is always ready to assist you.
            </p>

            <p className="text-xs text-[#D9CCB4]">
              Silk Mode Fashion is a premium brand dedicated to authentic Indian handlooms and designer sarees.
            </p>

            {/* Direct Contact Details */}
            <div className="pt-2 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <a href={`tel:+91${CLIENT_PHONE}`} className="hover:text-[#D4AF37] transition font-medium">
                  +91 {CLIENT_PHONE}
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ button_location: "footer_contact_direct" })}
                  className="hover:text-[#D4AF37] transition"
                >
                  WhatsApp: +91 {CLIENT_PHONE} (Instant Support)
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <a href="mailto:silkmodefashion06@gmail.com" className="hover:text-[#D4AF37] transition">
                  silkmodefashion06@gmail.com
                </a>
              </div>
            </div>

            {/* Social Link - Official Instagram */}
            <div className="pt-3">
              <a
                href="https://www.instagram.com/silkmode_fashion?utm_source=qr&jplx=dGxwbTUyNm5zcTlj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2.5 px-3.5 py-2 rounded-full border border-white/30 hover:border-[#D4AF37] hover:bg-white/10 transition text-white group"
                aria-label="Follow Silk Mode Fashion on Instagram"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-stone-300 uppercase tracking-widest font-medium">Follow on Instagram</span>
                  <span className="text-xs font-semibold text-[#D4AF37] group-hover:underline">@silkmode_fashion</span>
                </div>
              </a>
            </div>
          </div>

          {/* Customer Care Accordion / Column */}
          <div className="lg:col-span-3 border-t lg:border-t-0 border-[#701C29] pt-4 lg:pt-0">
            <button
              type="button"
              onClick={() => setCustomerCareOpen(!customerCareOpen)}
              className="w-full flex items-center justify-between text-base font-semibold text-[#E0C788] py-2 lg:py-0 lg:cursor-default"
            >
              <span>Customer Care</span>
              <ChevronDown
                className={`w-4 h-4 text-[#D4AF37] lg:hidden transition-transform duration-200 ${
                  customerCareOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`mt-3 space-y-2.5 text-xs text-[#E6DDD0] ${
                customerCareOpen ? "block" : "hidden lg:block"
              }`}
            >
              <li>
                <a
                  href={getGeneralWhatsAppUrl("Track my saree order")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ button_location: "footer_customer_care_track_order" })}
                  className="hover:text-white transition"
                >
                  Track My Order
                </a>
              </li>
              <li>
                <a
                  href={getGeneralWhatsAppUrl("Saree fabric & care query")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ button_location: "footer_customer_care_fabric_guide" })}
                  className="hover:text-white transition"
                >
                  Fabric & Care Guide
                </a>
              </li>
              <li>
                <a
                  href={getGeneralWhatsAppUrl("Custom blouse stitching enquiry")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ button_location: "footer_customer_care_custom_blouse" })}
                  className="hover:text-white transition"
                >
                  Custom Blouse Stitching
                </a>
              </li>
              <li>
                <a
                  href={getGeneralWhatsAppUrl("Shipping & Delivery assistance")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ button_location: "footer_customer_care_shipping" })}
                  className="hover:text-white transition"
                >
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a
                  href={getGeneralWhatsAppUrl("Returns & Exchange query")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ button_location: "footer_customer_care_returns" })}
                  className="hover:text-white transition"
                >
                  Returns & Exchanges
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links Accordion / Column */}
          <div className="lg:col-span-3 border-t lg:border-t-0 border-[#701C29] pt-4 lg:pt-0">
            <button
              type="button"
              onClick={() => setQuickLinksOpen(!quickLinksOpen)}
              className="w-full flex items-center justify-between text-base font-semibold text-[#E0C788] py-2 lg:py-0 lg:cursor-default"
            >
              <span>Quick Links</span>
              <ChevronDown
                className={`w-4 h-4 text-[#D4AF37] lg:hidden transition-transform duration-200 ${
                  quickLinksOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`mt-3 space-y-2.5 text-xs text-[#E6DDD0] ${
                quickLinksOpen ? "block" : "hidden lg:block"
              }`}
            >
              <li>
                <Link href="#collections" className="hover:text-white transition">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="#trending" className="hover:text-white transition">
                  Trending Sarees
                </Link>
              </li>
              <li>
                <Link href="#bestsellers" className="hover:text-white transition">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-white transition">
                  About Silk Mode Fashion
                </Link>
              </li>
              <li>
                <Link href="#why-us" className="hover:text-white transition">
                  Why Choose Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D9CCB4] space-y-2 sm:space-y-0 text-center sm:text-left">
          <p>© 2026, Silk Mode Fashion. All rights reserved.</p>
          <p className="text-[11px] text-[#D9CCB4]/80">
            Handcrafted with love for Indian Heritage Weaves.
          </p>
        </div>
      </div>
    </footer>
  );
}

