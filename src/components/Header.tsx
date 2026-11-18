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

const POPULAR_SEARCHES = [
  "Kanjivaram Silk",
  "Banarasi Brocade",
  "Bridal Lehenga",
  "Organza Saree",
  "Bandhani",
];

export default function Header({ onSelectProduct }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SareeProduct[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close desktop search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Concise navigation links tailored to fit cleanly without overlapping
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Sarees", href: "/collections" },
    { label: "Silk Sarees", href: "/collections?category=Silk%20Saree" },
    { label: "Salwar Suits", href: "/collections?category=Salwar%20Suit" },
    { label: "Space Silk", href: "/collections?category=Space%20Silk" },
    { label: "Bandhani", href: "/collections?category=Bandhani%20Silk" },
    { label: "Party Wear", href: "/collections?category=Party%20Wear" },
    { label: "Best Sellers", href: "/#bestsellers" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 lg:gap-3 xl:gap-6 min-h-[84px] lg:min-h-[94px] py-1.5 lg:py-2">
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

            {/* Desktop Navigation Links (Cleanly spaced without overlap) */}
            <nav className="hidden lg:flex items-center gap-x-2.5 xl:gap-x-4 2xl:gap-x-5.5 shrink min-w-0">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[12.5px] xl:text-[13.5px] font-medium tracking-normal text-stone-800 hover:text-[#58111A] relative py-1 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions: Search Input & WhatsApp Header Contact */}
            <div className="flex items-center space-x-2 lg:space-x-2.5 xl:space-x-3 shrink-0">
              {/* Desktop Search Input (Solid luxury pill with expand & dropdown) */}
              <div
                ref={searchContainerRef}
                className="relative hidden md:block w-36 lg:w-44 xl:w-56 focus-within:w-48 lg:focus-within:w-56 xl:focus-within:w-64 transition-all duration-200 z-30"
              >
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchFocused(true);
                    }}
                    placeholder="Search sarees, silks..."
                    className="w-full bg-[#F6F5F2] hover:bg-[#F0EEEA] focus:bg-white text-stone-900 placeholder:text-stone-400 text-xs xl:text-[13px] pl-8.5 pr-7 py-2 rounded-full border border-stone-200/90 focus:outline-none focus:border-[#58111A] focus:ring-2 focus:ring-[#58111A]/10 shadow-2xs transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 w-4 h-4 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 text-[10px] flex items-center justify-center transition"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Dropdown: Popular Searches (When empty & focused) */}
                {isSearchFocused && searchQuery.trim() === "" && (
                  <div className="absolute top-full mt-2 w-72 right-0 bg-white border border-stone-200/90 rounded-2xl shadow-xl z-50 p-3.5">
                    <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_SEARCHES.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setSearchQuery(item);
                            setIsSearchFocused(true);
                          }}
                          className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-[#58111A] hover:text-white text-stone-700 rounded-full transition cursor-pointer"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dropdown: Live Search Results */}
                {isSearchFocused && searchQuery.trim() !== "" && (
                  <div className="absolute top-full mt-2 w-80 right-0 bg-white border border-stone-200/90 rounded-2xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
                    <div className="p-2.5 bg-stone-50/80 border-b border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-600">
                      <span>Matching Products ({searchResults.length})</span>
                      <Link
                        href={`/collections?q=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery("");
                        }}
                        className="text-[#58111A] hover:underline text-[11px]"
                      >
                        View in Shop →
                      </Link>
                    </div>

                    {searchResults.length > 0 ? (
                      searchResults.slice(0, 6).map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={() => {
                            onSelectProduct?.(product);
                            setSearchQuery("");
                            setIsSearchFocused(false);
                          }}
                          className="flex items-center p-2.5 hover:bg-stone-50 cursor-pointer transition space-x-3 border-b border-stone-100 last:border-b-0 group"
                        >
                          <div className="relative w-11 h-13 rounded-md overflow-hidden flex-shrink-0 bg-stone-100">
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-200" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-stone-900 truncate group-hover:text-[#58111A] transition-colors">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-stone-500">{product.category}</p>
                            <p className="text-xs font-bold text-[#58111A] mt-0.5">₹{product.price.toLocaleString("en-IN")}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#58111A] group-hover:translate-x-0.5 transition" />
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-xs text-stone-500">No sarees found for &quot;{searchQuery}&quot;</p>
                        <p className="text-[11px] text-stone-400 mt-1">Try searching for &quot;Silk&quot;, &quot;Banarasi&quot;, or &quot;Lehenga&quot;</p>
                      </div>
                    )}
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
                className="hidden sm:inline-flex items-center space-x-1.5 bg-[#58111A] hover:bg-[#460D1B] text-white px-3.5 lg:px-4 py-2 rounded-full text-xs font-medium tracking-wide transition shadow-2xs shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span className="hidden xl:inline">Enquire</span>
                <span className="xl:hidden">Chat</span>
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
                  placeholder="Search sarees, silk, lehenga..."
                  /* Note: text-base prevents iOS Safari zoom */
                  className="w-full bg-[#F6F5F2] text-stone-900 placeholder-stone-400 text-sm pl-10 pr-10 py-2.5 rounded-full border border-stone-200 focus:outline-none focus:border-[#58111A] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Quick Tags when empty */}
              {searchQuery.trim() === "" && (
                <div className="mt-2.5 px-1">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                    Popular:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SEARCHES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSearchQuery(item)}
                        className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-[#58111A] hover:text-white text-stone-700 rounded-full transition"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Search Results */}
              {searchQuery.trim() !== "" && (
                <div className="mt-2 bg-white border border-stone-200/90 rounded-xl shadow-lg max-h-72 overflow-y-auto">
                  <div className="p-2 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-600">
                    <span>Found ({searchResults.length})</span>
                    <Link
                      href={`/collections?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="text-[#58111A] hover:underline text-[11px]"
                    >
                      View in Shop →
                    </Link>
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map((product) => (
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
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-xs text-stone-500">No sarees found for &quot;{searchQuery}&quot;</p>
                    </div>
                  )}
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
