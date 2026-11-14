"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: number;
  tagline: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  desktopImage: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    tagline: "FESTIVE SAREE COLLECTION",
    title: "Elegance Woven in",
    titleHighlight: "Tradition",
    subtitle: "Discover sarees that celebrate timeless craftsmanship and contemporary elegance.",
    ctaText: "SHOP NOW",
    ctaLink: "/collections",
    desktopImage: "/images/hero-banner.jpg",
  },
  {
    id: 2,
    tagline: "ROYAL BRIDAL & WEDDING EDITS",
    title: "Pure Handloom",
    titleHighlight: "Masterpieces",
    subtitle: "Exquisite Banarasi and Kanjivaram silks with authentic gold zari brocade.",
    ctaText: "EXPLORE COLLECTION",
    ctaLink: "/collections",
    desktopImage: "/images/hero-banner-2.jpg",
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[520px] sm:h-[600px] md:h-[660px] lg:h-[720px] overflow-hidden bg-[#180A0E] select-none"
    >
      {/* Slides Container */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <Image
                src={slide.desktopImage}
                alt={slide.title}
                fill
                priority={index === 0}
                className={`object-cover object-[68%_center] md:object-center transform transition-transform duration-7000 ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />

              {/* Editorial Gradients (inspired by vastrang dark-to-translucent overlay) */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/25 md:from-black/80 md:via-black/35 md:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 md:hidden" />
            </div>

            {/* Slide Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
                <div className="max-w-xl md:max-w-2xl text-left">
                  {/* Tagline Badge */}
                  <div className="inline-block mb-3 sm:mb-4">
                    <span className="text-[#E0C788] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase border-b border-[#C5A059]/60 pb-1">
                      {slide.tagline}
                    </span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-[1.12] tracking-tight">
                    {slide.title} <br className="hidden sm:inline" />
                    <span className="italic text-[#E0C788] font-serif font-light">
                      {slide.titleHighlight}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-[#E6DDD0] font-light leading-relaxed max-w-lg">
                    {slide.subtitle}
                  </p>

                  {/* Gold Rectangular SHOP NOW Button (Exact Vastrang Style) */}
                  <div className="mt-6 sm:mt-8">
                    <Link
                      href={slide.ctaLink}
                      className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#C5A059] hover:to-[#B38E46] text-[#241305] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 rounded-xs"
                    >
                      {slide.ctaText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows: Left (<) and Right (>) (Matching Vastrang Screenshots) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-[#2B2927] hover:text-[#58111A] flex items-center justify-center shadow-lg transition-all duration-200 backdrop-blur-xs transform active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-[#2B2927] hover:text-[#58111A] flex items-center justify-center shadow-lg transition-all duration-200 backdrop-blur-xs transform active:scale-95"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Dots Indicator at Bottom */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2.5">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === idx
                ? "w-8 h-2 bg-[#D4AF37]"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
