"use client";

import React, { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ShopByCollection from "@/components/ShopByCollection";
import TrendingCollection from "@/components/TrendingCollection";
import CustomerReviews from "@/components/CustomerReviews";
import BrandElegance from "@/components/BrandElegance";
import PromotionalBanner from "@/components/PromotionalBanner";
import BestSellers from "@/components/BestSellers";
import WhyChooseUs from "@/components/WhyChooseUs";
import BrandStory from "@/components/BrandStory";
import InstagramSection from "@/components/InstagramSection";
import Footer from "@/components/Footer";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import { SareeProduct } from "@/data/products";

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<SareeProduct | null>(null);

  const handleQuickView = (product: SareeProduct) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleSelectCategory = (categoryName: string) => {
    const element = document.getElementById("trending");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white text-stone-900">
      {/* 1. Marquee Announcement Bar (right-to-left continuous scroll) */}
      <AnnouncementBar />

      {/* 2. White Clean Header (Vastrang style with search input) */}
      <Header onSelectProduct={handleQuickView} />

      {/* 3. Auto-Swapping 2-Slide Hero Carousel with Next/Prev Arrows */}
      <HeroBanner />

      {/* 4. Shop by Collection (6 circles desktop, 3x2 mobile) */}
      <ShopByCollection onSelectCategory={handleSelectCategory} />

      {/* 5. Trending Collection (4 columns desktop, 2 columns mobile) */}
      <TrendingCollection onQuickView={handleQuickView} />

      {/* 6. "Our customers love us" - 2 Rows of Moving Review Cards */}
      <CustomerReviews />

      {/* 7. "Discover Timeless Elegance with Silk Mode Fashion" with Gold Brush Underline */}
      <BrandElegance />

      {/* 8. Handloom Heritage Promotional Banner */}
      <PromotionalBanner />

      {/* 9. Best Sellers & Featured Weaves */}
      <BestSellers onQuickView={handleQuickView} />

      {/* 10. Why Choose Us Trust Pillars */}
      <WhyChooseUs />

      {/* 11. Silk Mode Fashion Brand Heritage Story */}
      <BrandStory />

      {/* 12. Follow Us on Instagram (12-Image Rich Lookbook Grid) */}
      <InstagramSection />

      {/* 13. Luxury Wine/Maroon Footer with Contact +91 7359345438 */}
      <Footer />

      {/* Interactive Saree Quick View Modal */}
      <ProductQuickViewModal product={selectedProduct} onClose={handleCloseModal} />
    </main>
  );
}
