import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | SilkMode Fashion",
  description:
    "How SilkMode Fashion collects, uses, and protects your personal, authentication, and order information.",
};

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-xs text-stone-500 mt-1">Last updated: November 2026</p>
          </div>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              1. Information We Collect
            </h2>
            <p>
              When you sign in via Google or Mobile OTP, browse, or place an order on SilkMode
              Fashion, we collect your name, email address, mobile number, and delivery address
              details needed to fulfill your order.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              2. How We Use Your Data
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To authenticate your account securely using HTTP-only session cookies.</li>
              <li>To process payments, deliver orders, and manage cancellations or 3-day returns.</li>
              <li>To send transactional order updates via SMS and email.</li>
            </ul>
          </section>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              3. Payments &amp; Third-Party Services
            </h2>
            <p>
              Online payments are processed securely by <strong>Razorpay</strong>; we do not store
              your card, UPI, or netbanking credentials on our servers. We never sell or rent your
              personal data to third parties.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              4. Contact for Privacy Requests
            </h2>
            <p>
              For data access or deletion requests, write to{" "}
              <a
                href="mailto:silkmodefashion06@gmail.com"
                className="text-[#58111A] font-semibold underline"
              >
                silkmodefashion06@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
