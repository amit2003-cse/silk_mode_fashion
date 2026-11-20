import React from "react";

export default function BrandElegance() {
  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title with artistic brush underline */}
        <div className="inline-block relative">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Discover Timeless Elegance with{" "}
            <span className="relative inline-block text-stone-900">
              SilkMode Fashion Surat
              {/* Artistic Yellow/Gold Brush Underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-[#E5A93C] overflow-visible"
                viewBox="0 0 240 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 8.5C50 3.5 150 2 237 7.5C180 11.5 80 10.5 15 10"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
        </div>

        {/* Narrative Copy (Vastrang style) */}
        <div className="mt-8 space-y-4 max-w-3xl mx-auto text-xs sm:text-sm md:text-base text-stone-600 leading-relaxed">
          <p>
            At <strong className="text-stone-800">SilkMode Fashion</strong>, we bring you a carefully curated collection of authentic Surat designer sarees and bridal wear crafted for weddings, festivals, parties, and every special occasion. From luxurious fabrics to elegant craftsmanship, every saree is designed to celebrate the beauty of Indian tradition with a modern touch.
          </p>
          <p className="font-medium text-stone-800">
            Enjoy <span className="font-bold text-[#58111A]">Free Shipping Across India</span>, <span className="font-bold text-[#58111A]">Cash on Delivery</span>, and shop with confidence from a brand trusted by <span className="font-bold text-[#58111A]">2 Lakh+ Happy Customers</span>.
          </p>
          <p>
            Explore our latest collections and find the perfect saree to make every moment unforgettable.
          </p>
        </div>
      </div>
    </section>
  );
}
