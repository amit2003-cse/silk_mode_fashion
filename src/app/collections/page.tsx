"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Filter, ChevronDown, LayoutGrid, List, X, Check, MessageCircle, ArrowLeft } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import { PRODUCTS_DATA, SareeProduct } from "@/data/products";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";
type ViewMode = "grid" | "list";

function CollectionsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<SareeProduct[]>(PRODUCTS_DATA);
  const [selectedProduct, setSelectedProduct] = useState<SareeProduct | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { products?: SareeProduct[] } | null) => {
        if (active && data?.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        // keep static fallback
      });
    return () => {
      active = false;
    };
  }, []);
  
  // Applied filters (active on the page)
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  
  // Draft filters (held inside drawer until "Apply Filters" is clicked)
  const [draftCategory, setDraftCategory] = useState<string>("All");
  const [draftPriceRange, setDraftPriceRange] = useState<string>("all");

  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid"); // Default is 2 columns on mobile
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Available categories
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  // Auto-sync category from URL query parameters (e.g. ?category=Salwar%20Suit)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && categories.includes(cat)) {
      setSelectedCategory(cat);
      setDraftCategory(cat);
    } else if (!cat) {
      setSelectedCategory("All");
      setDraftCategory("All");
    }
  }, [searchParams]);

  // Open drawer and sync draft with currently applied filter
  const openFilterDrawer = () => {
    setDraftCategory(selectedCategory);
    setDraftPriceRange(selectedPriceRange);
    setFilterDrawerOpen(true);
  };

  // Close drawer without applying
  const closeFilterDrawer = () => {
    setDraftCategory(selectedCategory);
    setDraftPriceRange(selectedPriceRange);
    setFilterDrawerOpen(false);
  };

  // Explicitly apply draft filters when clicking "Apply Filters" button
  const handleApplyFilters = () => {
    setSelectedCategory(draftCategory);
    setSelectedPriceRange(draftPriceRange);
    setFilterDrawerOpen(false);
  };

  // Reset filters
  const handleResetDraft = () => {
    setDraftCategory("All");
    setDraftPriceRange("all");
  };

  const handleResetApplied = () => {
    setSelectedCategory("All");
    setSelectedPriceRange("all");
    setDraftCategory("All");
    setDraftPriceRange("all");
  };

  // Calculate matching count for the draft filters in drawer
  const draftMatchCount = useMemo(() => {
    return products.filter((product) => {
      if (draftCategory !== "All" && product.category !== draftCategory) return false;
      if (draftPriceRange === "under-2500" && product.price >= 2500) return false;
      if (draftPriceRange === "2500-4000" && (product.price < 2500 || product.price > 4000)) return false;
      if (draftPriceRange === "above-4000" && product.price <= 4000) return false;
      return true;
    }).length;
  }, [products, draftCategory, draftPriceRange]);

  // Filter and Sort logic for the actual page
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }
      // Price filter
      if (selectedPriceRange === "under-2500" && product.price >= 2500) return false;
      if (selectedPriceRange === "2500-4000" && (product.price < 2500 || product.price > 4000)) return false;
      if (selectedPriceRange === "above-4000" && product.price <= 4000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return 0; // "featured" maintains default curated order
    });
  }, [products, selectedCategory, selectedPriceRange, sortBy]);

  const activeFilterCount =
    (selectedCategory !== "All" ? 1 : 0) + (selectedPriceRange !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 w-full overflow-x-hidden">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Brand Header */}
      <Header onSelectProduct={setSelectedProduct} />

      {/* Breadcrumb & Promotional Top Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full pt-4 min-w-0">
        {/* Breadcrumb link */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs text-stone-500 mb-3 truncate">
          <Link href="/" className="hover:text-[#58111A] flex items-center space-x-1 shrink-0">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium truncate">All Sarees & Collections</span>
        </div>

        {/* Top Collection Banner */}
        <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-r from-[#58111A] via-[#752430] to-[#58111A] p-3.5 sm:p-6 text-white shadow-xs mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
          <div className="mb-2.5 sm:mb-0">
            <span className="inline-block bg-[#E5A93C] text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase mb-1">
              Surat Textile Hub
            </span>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight">
              AUTHENTIC HANDLOOM & LUXURY WEAVES 🪡
            </h1>
            <p className="text-[11px] sm:text-xs text-stone-200 mt-0.5">
              Direct from Surat manufacturer with zero retail markup • Free all-India delivery
            </p>
          </div>
          <a
            href={getGeneralWhatsAppUrl("Hello Silk Mode Fashion, I would like to enquire about your handcrafted sarees and suits collection.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white text-[#58111A] hover:bg-stone-100 rounded-full text-xs font-bold transition shadow-xs shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>

        {/* Responsive Toolbar: Fits perfectly even on 320px screens with zero horizontal overflow */}
        <div className="sticky top-18 md:top-20 z-30 bg-white/95 backdrop-blur-md py-2.5 border-y border-stone-200 mb-4 sm:mb-6 flex items-center justify-between gap-1.5 sm:gap-3">
          <div className="flex items-center space-x-1.5 sm:space-x-3 min-w-0 flex-1">
            {/* Filter Pill Button */}
            <button
              type="button"
              onClick={openFilterDrawer}
              className="inline-flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:py-2 rounded-lg bg-[#6B3E39] hover:bg-[#542F2B] text-white text-xs sm:text-sm font-semibold transition shadow-xs shrink-0"
            >
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white text-[#58111A] text-[10px] sm:text-[11px] font-bold flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort by Dropdown */}
            <div className="relative min-w-0 flex-1 sm:flex-none">
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="w-full sm:w-auto inline-flex items-center justify-between space-x-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border border-stone-300 bg-white text-xs sm:text-sm font-medium text-stone-800 hover:border-stone-400 transition"
              >
                <span className="truncate">
                  Sort:{" "}
                  <strong className="text-stone-900 font-semibold">
                    {sortBy === "featured"
                      ? "Featured"
                      : sortBy === "price-asc"
                      ? "Low to High"
                      : sortBy === "price-desc"
                      ? "High to Low"
                      : "A-Z"}
                  </strong>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0 ml-1" />
              </button>

              {sortDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-stone-200 rounded-xl shadow-xl z-40 py-1 overflow-hidden">
                  {[
                    { label: "Featured", value: "featured" },
                    { label: "Price: Low to High", value: "price-asc" },
                    { label: "Price: High to Low", value: "price-desc" },
                    { label: "Alphabetical: A-Z", value: "name-asc" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value as SortOption);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between transition ${
                        sortBy === opt.value
                          ? "bg-stone-100 text-[#58111A] font-bold"
                          : "text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && <Check className="w-3.5 h-3.5 text-[#58111A]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* View Toggle Icons (Grid vs List - Default is 2 Column Grid on Mobile) */}
          <div className="flex items-center space-x-0.5 border border-stone-300 rounded-lg p-0.5 sm:p-1 bg-stone-50 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid View (Default 2 Columns)"
              className={`p-1 sm:p-1.5 rounded transition ${
                viewMode === "grid"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-400 hover:text-stone-700"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List View (1 Column)"
              className={`p-1 sm:p-1.5 rounded transition ${
                viewMode === "list"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-400 hover:text-stone-700"
              }`}
            >
              <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center space-x-2 flex-wrap mb-4 pb-2 border-b border-stone-100">
            <span className="text-[11px] sm:text-xs text-stone-500">Active:</span>
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[11px] sm:text-xs">
                <span>{selectedCategory}</span>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setDraftCategory("All");
                  }}
                  className="hover:text-black ml-1"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedPriceRange !== "all" && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[11px] sm:text-xs">
                <span>
                  {selectedPriceRange === "under-2500"
                    ? "Under ₹2,500"
                    : selectedPriceRange === "2500-4000"
                    ? "₹2,500 - ₹4,000"
                    : "Above ₹4,000"}
                </span>
                <button
                  onClick={() => {
                    setSelectedPriceRange("all");
                    setDraftPriceRange("all");
                  }}
                  className="hover:text-black ml-1"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              onClick={handleResetApplied}
              className="text-[11px] sm:text-xs text-[#58111A] hover:underline font-semibold ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Product Count info */}
        <div className="mb-3 text-xs text-stone-500">
          Showing <strong className="text-stone-900">{filteredProducts.length}</strong> handcrafted sarees
        </div>

        {/* Product Grid:
            Default view is 2 COLUMNS ON MOBILE (grid-cols-2) and 4 on desktop!
            If List view is selected, it switches to 1 column on mobile!
        */}
        {filteredProducts.length > 0 ? (
          <div
            className={`grid gap-2 sm:gap-4 lg:gap-6 mb-16 ${
              viewMode === "grid"
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-stone-50 rounded-2xl border border-stone-200 mb-16 px-4">
            <p className="text-sm sm:text-base font-semibold text-stone-700">No sarees match this filter.</p>
            <p className="text-xs text-stone-500 mt-1">Try clearing your filters to see more designs.</p>
            <button
              onClick={handleResetApplied}
              className="mt-4 px-6 py-2 rounded-full bg-[#58111A] text-white text-xs font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Slide-over Drawer (Deferred Apply on Button Click) */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={closeFilterDrawer}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto">
            <div className="w-full sm:w-96 bg-white shadow-2xl p-5 sm:p-6 flex flex-col justify-between h-full">
              <div className="overflow-y-auto flex-1 pr-1">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">Filter Sarees</h3>
                  <button
                    onClick={closeFilterDrawer}
                    className="p-1 text-stone-400 hover:text-stone-700"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories Filter (Updates draft state only) */}
                <div className="py-5 border-b border-stone-200">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                    By Fabric & Collection
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setDraftCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                          draftCategory === cat
                            ? "bg-[#6B3E39] text-white shadow-xs"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter (Updates draft state only - DOES NOT APPLY UNTIL CLICKING APPLY) */}
                <div className="py-5 border-b border-stone-200">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                    By Price Range
                  </h4>
                  <div className="space-y-2.5">
                    {[
                      { label: "All Prices", value: "all" },
                      { label: "Under ₹2,500", value: "under-2500" },
                      { label: "₹2,500 - ₹4,000", value: "2500-4000" },
                      { label: "Above ₹4,000", value: "above-4000" },
                    ].map((range) => (
                      <label
                        key={range.value}
                        className="flex items-center space-x-2.5 text-xs text-stone-700 cursor-pointer select-none"
                      >
                        <input
                          type="radio"
                          name="price-range"
                          checked={draftPriceRange === range.value}
                          onChange={() => setDraftPriceRange(range.value)}
                          className="w-4 h-4 accent-[#6B3E39]"
                        />
                        <span>{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Action Buttons: Apply Filters explicitly commits the selection */}
              <div className="pt-4 border-t border-stone-200 flex items-center space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={handleResetDraft}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="w-1/2 py-2.5 rounded-xl bg-[#6B3E39] hover:bg-[#542F2B] text-white text-xs font-bold shadow transition"
                >
                  Apply Filters ({draftMatchCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saree Quick View Modal */}
      <ProductQuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CollectionsContent />
    </Suspense>
  );
}
