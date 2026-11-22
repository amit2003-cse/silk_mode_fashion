"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, LayoutGrid, MessageCircle, X, ChevronRight, Sparkles } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/gtm";

const CATEGORIES_LIST = [
  { name: "All Products", href: "/collections", count: "All Weaves", icon: "✨" },
  { name: "Silk Sarees", href: "/collections?category=Silk%20Saree", count: "Banarasi, Paithani, Khadi", icon: "🥻" },
  { name: "Salwar Suits & Kurtis", href: "/collections?category=Salwar%20Suit", count: "Muslin, Chanderi, Rayon", icon: "👗" },
  { name: "Space Silk Sarees", href: "/collections?category=Space%20Silk", count: "Zari, Jarkhan & Beads", icon: "🌟" },
  { name: "Bandhani & Garchola", href: "/collections?category=Bandhani%20Silk", count: "Modal Silk & Dhupiyan", icon: "💎" },
  { name: "Party Wear & Georgette", href: "/collections?category=Party%20Wear", count: "Sequins & Gotta Patti", icon: "🎉" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const isHome = pathname === "/";
  const isShop = pathname === "/collections" && !categoriesOpen;

  return (
    <>
      {/* Interactive Categories Bottom Sheet */}
      {categoriesOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setCategoriesOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl p-5 z-10 max-h-[80vh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#58111A]" />
                <h3 className="font-serif-luxury font-bold text-stone-900 text-base tracking-wide">
                  Browse by Category
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCategoriesOpen(false)}
                className="p-1.5 rounded-full bg-stone-100 text-stone-600 hover:text-stone-900"
                aria-label="Close categories"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Items List */}
            <div className="mt-3 divide-y divide-stone-100 overflow-y-auto">
              {CATEGORIES_LIST.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setCategoriesOpen(false)}
                  className="flex items-center justify-between py-3.5 px-2 hover:bg-stone-50 rounded-xl transition group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{cat.icon}</span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-stone-900 group-hover:text-[#58111A] transition">
                        {cat.name}
                      </p>
                      <p className="text-[11px] text-stone-500">{cat.count}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#58111A] transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>

            {/* Bottom Direct Wholesale Note */}
            <div className="mt-4 pt-3 border-t border-stone-100 text-center">
              <p className="text-[11px] text-stone-500">
                Direct Surat Manufacturer Price • Free All-India Shipping
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-[#E8DEC8] py-2 px-6 shadow-lg">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center group transition-colors ${
              isHome ? "text-[#58111A]" : "text-[#6E675F] hover:text-[#58111A]"
            }`}
          >
            <Home className="w-5 h-5 mb-1 group-active:scale-90 transition-transform" />
            <span className={`text-[10px] tracking-tight ${isHome ? "font-bold" : "font-medium"}`}>
              Home
            </span>
          </Link>

          {/* 2. Categories */}
          <button
            type="button"
            onClick={() => setCategoriesOpen(true)}
            className={`flex flex-col items-center group transition-colors cursor-pointer ${
              categoriesOpen ? "text-[#58111A]" : "text-[#6E675F] hover:text-[#58111A]"
            }`}
          >
            <LayoutGrid className="w-5 h-5 mb-1 group-active:scale-90 transition-transform" />
            <span className={`text-[10px] tracking-tight ${categoriesOpen ? "font-bold" : "font-medium"}`}>
              Categories
            </span>
          </button>

          {/* 3. Shop */}
          <Link
            href="/collections"
            className={`flex flex-col items-center group transition-colors ${
              isShop ? "text-[#58111A]" : "text-[#6E675F] hover:text-[#58111A]"
            }`}
          >
            <ShoppingBag className="w-5 h-5 mb-1 group-active:scale-90 transition-transform" />
            <span className={`text-[10px] tracking-tight ${isShop ? "font-bold" : "font-medium"}`}>
              Shop
            </span>
          </Link>

          {/* 4. WhatsApp */}
          <a
            href={getGeneralWhatsAppUrl("Hello Silk Mode Fashion, I am browsing your website and would like assistance.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ button_location: "mobile_bottom_nav" })}
            className="flex flex-col items-center text-[#25D366] hover:text-[#20BE5C] group transition-colors"
          >
            <MessageCircle className="w-5 h-5 mb-1 fill-[#25D366]/10 text-[#25D366] group-active:scale-90 transition-transform" />
            <span className="text-[10px] font-bold tracking-tight text-[#25D366]">
              WhatsApp
            </span>
          </a>
        </div>
      </nav>
    </>
  );
}
