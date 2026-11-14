"use client";

import React from "react";
import Link from "next/link";
import { Home, ShoppingBag, LayoutGrid, MessageCircle } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-[#E8DEC8] py-2 px-6 shadow-lg">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        {/* Home */}
        <Link
          href="/"
          className="flex flex-col items-center text-[#58111A] group"
        >
          <Home className="w-5 h-5 mb-1 group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-semibold tracking-tight">Home</span>
        </Link>

        {/* Shop / Trending */}
        <Link
          href="/collections"
          className="flex flex-col items-center text-[#6E675F] hover:text-[#58111A] group"
        >
          <ShoppingBag className="w-5 h-5 mb-1 group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-medium tracking-tight">Shop</span>
        </Link>

        {/* Collections */}
        <Link
          href="/collections"
          className="flex flex-col items-center text-[#6E675F] hover:text-[#58111A] group"
        >
          <LayoutGrid className="w-5 h-5 mb-1 group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-medium tracking-tight">Collections</span>
        </Link>

        {/* Help / WhatsApp */}
        <a
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-[#25D366] hover:text-[#20BE5C] group"
        >
          <MessageCircle className="w-5 h-5 mb-1 group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-medium tracking-tight">Help</span>
        </a>
      </div>
    </nav>
  );
}
