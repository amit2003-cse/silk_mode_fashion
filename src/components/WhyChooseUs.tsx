import React from "react";
import { ShieldCheck, Sparkles, MessageCircle, Truck } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Sparkles,
      title: "Quality Craftsmanship",
      description: "Every saree is hand-inspected for authentic weave, pure zari, and flawless finishing.",
    },
    {
      icon: MessageCircle,
      title: "Direct WhatsApp Assistance",
      description: "Chat directly with our styling team for real product photos, drape videos, and styling queries.",
    },
    {
      icon: ShieldCheck,
      title: "Carefully Curated Collections",
      description: "Sourced directly from India's master weavers in Varanasi, Kanchipuram, and Chanderi.",
    },
    {
      icon: Truck,
      title: "Reliable Delivery Support",
      description: "Safe doorstep delivery across India with secure packaging and prompt order assistance.",
    },
  ];

  return (
    <section id="why-us" className="py-12 sm:py-16 bg-[#F3ECE0] border-b border-[#E8DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#2B2927]">
            Why Choose Silk Mode Fashion
          </h2>
          <p className="mt-2 text-sm text-[#6E675F]">
            Committed to preserving the soul of Indian handlooms with modern convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF7F2] p-6 rounded-xl border border-[#E8DEC8] hover:border-[#D4AF37] transition duration-300 text-center flex flex-col items-center shadow-2xs hover:shadow-xs"
              >
                <div className="w-12 h-12 rounded-full bg-[#58111A]/10 text-[#58111A] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#58111A]" />
                </div>
                <h3 className="text-sm font-bold text-[#2B2927] mb-2">{item.title}</h3>
                <p className="text-xs text-[#6E675F] leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

