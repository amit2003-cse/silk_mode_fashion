import React from "react";
import Image from "next/image";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const INSTA_LOOKBOOK = [
  {
    src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    title: "Royal Crimson Handloom Silk",
  },
  {
    src: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    title: "Bridal Red Paithani Saree",
  },
  {
    src: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
    title: "Temple Border Pure Kanjivaram",
  },
  {
    src: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80",
    title: "Floral Organza Pastel Drape",
  },
  {
    src: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    title: "Festive Midnight Black Georgette",
  },
  {
    src: "https://images.unsplash.com/photo-1610030469668-93510cb2866c?auto=format&fit=crop&w=600&q=80",
    title: "Mustard Silk Festive Saree",
  },
  // Row 2
  {
    src: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
    title: "Unboxing pure silk collection",
  },
  {
    src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    title: "Intricate cutwork pallu",
  },
  {
    src: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    title: "Traditional korvai weaving",
  },
  {
    src: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80",
    title: "Customer bridal look",
  },
  {
    src: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    title: "Festive pooja ready look",
  },
  {
    src: "https://images.unsplash.com/photo-1610030469668-93510cb2866c?auto=format&fit=crop&w=600&q=80",
    title: "Handloom packaging dispatch",
  },
];

export default function InstagramSection() {
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Follow Us on Instagram
          </h2>

          {/* Vastrang-style Maroon Pill Button */}
          <div className="mt-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-7 py-2.5 rounded-full bg-[#6B3E39] hover:bg-[#542F2B] text-white text-xs sm:text-sm font-medium transition shadow-xs"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow @silkmodefashion</span>
            </a>
          </div>
        </div>

        {/* 12-image grid (3 cols mobile, 6 cols desktop, exactly matching Vastrang Screenshot 4) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
          {INSTA_LOOKBOOK.map((item, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-lg overflow-hidden bg-stone-100 shadow-2xs hover:shadow-md transition"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                className="object-cover group-hover:scale-108 transition-transform duration-500"
              />
              {/* Instagram Hover Overlay */}
              <div className="absolute inset-0 bg-[#58111A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                <InstagramIcon className="w-6 h-6 text-[#D4AF37] mb-1" />
                <span className="text-[10px] line-clamp-2 leading-tight font-medium">
                  {item.title}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
