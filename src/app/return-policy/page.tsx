import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Return, Refund & Cancellation Policy | SilkMode Fashion",
  description:
    "Read SilkMode Fashion's pre-shipment cancellation, 3-day return eligibility, and refund policy.",
};

export default function ReturnPolicyPage() {
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
              Return, Refund &amp; Cancellation Policy
            </h1>
            <p className="text-xs text-stone-500 mt-1">Last updated: November 2026</p>
          </div>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              1. Order Cancellation (Before Shipment)
            </h2>
            <p>
              You can cancel your order anytime before it is shipped from your{" "}
              <Link href="/orders" className="text-[#58111A] font-semibold underline">
                My Orders
              </Link>{" "}
              page (while the order status is <strong>Placed</strong>, <strong>Confirmed</strong>,
              or <strong>Packed</strong>). Once an order is marked <strong>Shipped</strong>,
              cancellation is not permitted.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              2. 3-Day Return Eligibility
            </h2>
            <p>
              We accept return requests within <strong>3 days (72 hours) of delivery</strong>{" "}
              strictly for the following reasons:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Damaged or defective product received</li>
              <li>Wrong product delivered</li>
              <li>Incorrect colour delivered compared to your ordered shade</li>
            </ul>
            <p>
              To submit a return request, open your delivered order under{" "}
              <Link href="/orders" className="text-[#58111A] font-semibold underline">
                My Orders
              </Link>{" "}
              and upload <strong>1–3 clear proof photos</strong> showing the issue. Items must be
              unused, unwashed, and in original packaging with tags intact.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              3. Refund Processing
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Online Payments (Razorpay):</strong> Refunds for approved returns or
                pre-shipment cancellations are credited back to the original payment method within{" "}
                <strong>5–7 business days</strong>.
              </li>
              <li>
                <strong>Cash on Delivery (COD) Orders:</strong> For approved COD returns, please
                submit your <strong>UPI ID or Bank Account + IFSC</strong> in the return form.
                Refunds are processed manually via bank/UPI transfer within{" "}
                <strong>5–7 business days</strong> after quality verification.
              </li>
            </ul>
          </section>

          <section className="space-y-2 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              4. Need Assistance?
            </h2>
            <p>
              Email us at{" "}
              <a
                href="mailto:silkmodefashion06@gmail.com"
                className="text-[#58111A] font-semibold underline"
              >
                silkmodefashion06@gmail.com
              </a>{" "}
              or call/WhatsApp <strong>+91 7359345438</strong>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
