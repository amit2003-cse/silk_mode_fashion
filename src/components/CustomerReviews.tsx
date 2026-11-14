"use client";

import React from "react";
import { Star, CheckCircle } from "lucide-react";

interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  stars: number;
  review: string;
}

const REVIEWS_ROW_1: ReviewItem[] = [
  {
    id: "r1",
    name: "Sonali B.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    stars: 5,
    review: "Amazing beautiful saree as seen in the picture 👍",
  },
  {
    id: "r2",
    name: "Deepti L.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    stars: 5,
    review: "This saree looked so amazing! Pure fabric feel.",
  },
  {
    id: "r3",
    name: "Sree S.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
    stars: 5,
    review: "Amazing product go for it, nice and quick delivery thank you",
  },
  {
    id: "r4",
    name: "Raghav M.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    stars: 5,
    review: "Beautiful saree!! Gifted to my wife and she loved it.",
  },
  {
    id: "r5",
    name: "Meenakshi K.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    stars: 5,
    review: "Zari work is very clean and rich. Value for money!",
  },
];

const REVIEWS_ROW_2: ReviewItem[] = [
  {
    id: "r6",
    name: "Hira K.",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=120&q=80",
    stars: 5,
    review: "Sari is very beautiful ❤️ I also want to buy it again",
  },
  {
    id: "r7",
    name: "Nisha P.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    stars: 5,
    review: "Thanku for the saree it's very beautiful and light drape",
  },
  {
    id: "r8",
    name: "Pooja Sharma",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
    stars: 5,
    review: "Colors are vibrant and fabric is so soft. Super happy!",
  },
  {
    id: "r9",
    name: "Anjali Roy",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80",
    stars: 5,
    review: "WhatsApp team answered all my questions patiently with real videos.",
  },
  {
    id: "r10",
    name: "Kavita Verma",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80",
    stars: 5,
    review: "Received the order in 3 days. Exactly as shown!",
  },
];

export default function CustomerReviews() {
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
          Our customers love us
        </h2>
        <p className="mt-2 text-sm sm:text-base text-stone-600 font-medium">
          <span className="font-semibold text-stone-800">4.7 star</span> Based on{" "}
          <span className="underline decoration-stone-400">845 reviews</span>
        </p>
      </div>

      {/* Row 1: Horizontal scrolling review cards */}
      <div className="overflow-hidden py-2">
        <div className="animate-marquee flex space-x-4 sm:space-x-6 w-max">
          {[...REVIEWS_ROW_1, ...REVIEWS_ROW_1, ...REVIEWS_ROW_1].map((review, idx) => (
            <div
              key={`${review.id}-${idx}`}
              className="flex items-center space-x-3.5 bg-stone-50/80 hover:bg-stone-100/90 border border-stone-200/80 rounded-full py-2.5 px-4 sm:py-3 sm:px-5 shadow-2xs transition shrink-0 max-w-sm sm:max-w-md"
            >
              <img
                src={review.avatar}
                alt={review.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-stone-200"
              />
              <div className="text-left min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                    {review.name}
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-stone-900 fill-stone-900 text-white shrink-0" />
                  <div className="flex text-amber-500 pl-1">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-600 truncate mt-0.5 max-w-[240px] sm:max-w-[300px]">
                  {review.review}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Staggered scrolling review cards */}
      <div className="overflow-hidden py-2 mt-2">
        <div
          className="animate-marquee flex space-x-4 sm:space-x-6 w-max"
          style={{ animationDirection: "reverse", animationDuration: "28s" }}
        >
          {[...REVIEWS_ROW_2, ...REVIEWS_ROW_2, ...REVIEWS_ROW_2].map((review, idx) => (
            <div
              key={`${review.id}-${idx}`}
              className="flex items-center space-x-3.5 bg-stone-50/80 hover:bg-stone-100/90 border border-stone-200/80 rounded-full py-2.5 px-4 sm:py-3 sm:px-5 shadow-2xs transition shrink-0 max-w-sm sm:max-w-md"
            >
              <img
                src={review.avatar}
                alt={review.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-stone-200"
              />
              <div className="text-left min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                    {review.name}
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-stone-900 fill-stone-900 text-white shrink-0" />
                  <div className="flex text-amber-500 pl-1">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-600 truncate mt-0.5 max-w-[240px] sm:max-w-[300px]">
                  {review.review}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
