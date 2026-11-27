import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | SilkMode Fashion",
  description:
    "Terms of use, pricing, Cash on Delivery limits, and order policies for SilkMode Fashion.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#58111A] font-semibold">
              SilkMode Fashion • Surat
            </p>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-stone-500 mt-1">Last updated: November 2026</p>
          </div>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              1. Products &amp; Pricing
            </h2>
            <p>
              All prices are listed in Indian Rupees (INR). Product colours may vary slightly due
              to screen calibration and studio lighting. We reserve the right to update product
              prices and variant availability without prior notice.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              2. Payments &amp; Cash on Delivery (COD)
            </h2>
            <p>
              We accept online payments via Razorpay (UPI, Cards, NetBanking) and Cash on Delivery
              for orders up to <strong>₹10,000</strong>. Orders above ₹10,000 require online
              prepayment.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              3. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of India, with exclusive jurisdiction of the
              courts in <strong>Surat, Gujarat</strong>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
