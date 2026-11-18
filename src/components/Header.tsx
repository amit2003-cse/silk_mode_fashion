"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X, ArrowRight, MessageCircle } from "lucide-react";
import { PRODUCTS_DATA, SareeProduct } from "@/data/products";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

interface HeaderProps {
  onSelectProduct?: (product: SareeProduct) => void;
}

export default function Header({ onSelectProduct }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SareeProduct[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = PRODUCTS_DATA.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.fabric && p.fabric.toLowerCase().includes(q))
      );
      setSearchResults(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Navigation links
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/collections" },
    { label: "Silk Sarees", href: "/collections?category=Silk%20Saree" },
    { label: "Salwar Suits & Kurtis", href: "/collections?category=Salwar%20Suit" },
    { label: "Space Silk", href: "/collections?category=Space%20Silk" },
    { label: "Bandhani & Garchola", href: "/collections?category=Bandhani%20Silk" },
    { label: "Party Wear", href: "/collections?category=Party%20Wear" },
    { label: "Best Sellers", href: "/#bestsellers" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[84px] lg:min-h-[94px] py-1.5 lg:py-2">
            {/* Mobile Menu Button (Left on mobile) */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-stone-800 hover:text-[#58111A] focus:outline-none"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo - Vastrang style (Golden Emblem on top + Brand name below) */}
            <div className="lg:static absolute left-1/2 -translate-x-1/2 lg:translate-x-0 flex items-center justify-center z-10 shrink-0">
              <Link href="/" className="flex flex-col items-center justify-center group py-0.5 shrink-0">
                <div className="relative w-9.5 h-9.5 sm:w-10 sm:h-10 lg:w-11 lg:h-11 transition-transform group-hover:scale-105 duration-200">
                  <Image
                    src="/images/da66b080-7b45-45d1-bba8-14e0583018dc.png"
                    alt="Silk Mode Fashion Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="font-serif-luxury text-[13px] sm:text-[14px] lg:text-[14.5px] font-bold tracking-[0.22em] text-[#1F1E1D] uppercase leading-none mt-1.5 group-hover:text-[#58111A] transition-colors text-center whitespace-nowrap">
                  SILK MODE
                </span>
                <span className="text-[8px] sm:text-[8.5px] lg:text-[9px] tracking-[0.36em] text-[#6A635B] uppercase font-semibold leading-none mt-1 text-center whitespace-nowrap">
                  FASHION
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-3 xl:space-x-5.5 min-w-0">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] xl:text-sm font-medium tracking-normal text-stone-800 hover:text-[#58111A] relative py-1 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions: Search Input & WhatsApp Header Contact */}
            <div className="flex items-center space-x-2.5 xl:space-x-3 shrink-0">
              {/* Desktop Search Input (Exact Vastrang Style: "I'm looking for...") */}
              <div className="relative hidden md:block w-44 lg:w-48 xl:w-60">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="I'm looking for..."
                    className="w-full bg-stone-100/80 text-stone-900 placeholder-stone-400 text-sm pl-10 pr-4 py-2 rounded-full border border-stone-200 focus:outline-none focus:border-[#58111A] focus:bg-white transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 text-xs text-stone-400 hover:text-stone-700"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Dropdown search results */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-80 right-0 bg-white border border-stone-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
                    <div className="p-2 border-b border-stone-100 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                      Matching Products ({searchResults.length})
                    </div>
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          onSelectProduct?.(product);
                          setSearchQuery("");
                        }}
                        className="flex items-center p-3 hover:bg-stone-50 cursor-pointer transition space-x-3 border-b border-stone-100 last:border-b-0"
                      >
                        <div className="relative w-12 h-14 rounded overflow-hidden flex-shrink-0 bg-stone-100">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-stone-900 truncate">{product.name}</p>
                          <p className="text-xs text-stone-500">{product.category}</p>
                          <p className="text-xs font-bold text-[#58111A] mt-0.5">₹{product.price.toLocaleString("en-IN")}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 text-stone-800 hover:text-[#58111A]"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Header WhatsApp Quick Link */}
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center space-x-1.5 bg-[#58111A] hover:bg-[#460D1B] text-white px-4 py-2 rounded-full text-xs font-medium tracking-wide transition shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Enquire</span>
              </a>
            </div>
          </div>

          {/* Mobile Search Input Drawer */}
          {searchOpen && (
            <div className="md:hidden pb-4 pt-1">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="I'm looking for sarees, silk..."
                  /* Note: text-base prevents iOS Safari zoom */
                  className="w-full bg-stone-100 text-stone-900 placeholder-stone-400 text-base pl-10 pr-10 py-2.5 rounded-full border border-stone-200 focus:outline-none focus:border-[#58111A] focus:bg-white"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 bg-white border border-stone-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        onSelectProduct?.(product);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center p-3 border-b border-stone-100 hover:bg-stone-50 space-x-3 cursor-pointer"
                    >
                      <div className="relative w-12 h-14 rounded overflow-hidden flex-shrink-0 bg-stone-100">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-stone-900 truncate">{product.name}</p>
                        <p className="text-xs text-stone-500">{product.category}</p>
                        <p className="text-xs font-bold text-[#58111A] mt-0.5">₹{product.price.toLocaleString("en-IN")}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white border-r border-stone-200 shadow-2xl p-6 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-stone-200">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 group">
                  <div className="relative w-10 h-10 shrink-0">
                    <Image
                      src="/images/da66b080-7b45-45d1-bba8-14e0583018dc.png"
                      alt="Silk Mode Fashion"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif-luxury text-base font-bold tracking-[0.22em] text-[#1F1E1D] uppercase leading-tight group-hover:text-[#58111A] transition-colors">
                      SILK MODE
                    </span>
                    <span className="text-[10px] tracking-[0.35em] text-[#6A635B] uppercase font-semibold leading-tight mt-0.5">
                      FASHION
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-stone-700 hover:text-stone-900"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-6 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-base font-medium text-stone-800 hover:text-[#58111A] py-2 border-b border-stone-100"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-2">
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-[#25D366] text-white py-3 rounded-xl font-semibold shadow hover:bg-[#20BE5C] transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enquire on WhatsApp</span>
              </a>
              <p className="text-center text-xs text-stone-400">Direct Support: +91 7359345438</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
