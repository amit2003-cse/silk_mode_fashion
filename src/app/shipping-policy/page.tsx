import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | SilkMode Fashion",
  description:
    "Shipping rates, free delivery threshold above ₹999, and dispatch timelines for SilkMode Fashion Surat.",
};

export default function ShippingPolicyPage() {
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
              Shipping &amp; Delivery Policy
            </h1>
            <p className="text-xs text-stone-500 mt-1">Last updated: November 2026</p>
          </div>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              1. Shipping Charges
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Orders above ₹999:</strong> FREE All-India Shipping.
              </li>
              <li>
                <strong>Orders of ₹999 and below:</strong> Fixed delivery charge of{" "}
                <strong>₹99</strong>.
              </li>
            </ul>
          </section>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              2. Dispatch &amp; Delivery Timelines
            </h2>
            <p>
              All confirmed orders are dispatched from our Surat facility within{" "}
              <strong>24–48 business hours</strong>. Standard delivery takes{" "}
              <strong>3–7 business days</strong> across India depending on your serviceable pincode.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              3. Order Tracking
            </h2>
            <p>
              Once shipped, your courier partner and tracking number are sent via SMS/Email and
              visible anytime on your{" "}
              <Link href="/orders" className="text-[#58111A] font-semibold underline">
                My Orders
              </Link>{" "}
              page.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
