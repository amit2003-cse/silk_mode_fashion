import type { Metadata } from "next";
import { Mail, MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CLIENT_PHONE, getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us | SilkMode Fashion Surat",
  description:
    "Contact SilkMode Fashion Surat for order support, returns, and saree enquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#58111A] font-semibold">
              SilkMode Fashion
            </p>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Contact Us
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              We are happy to assist you with orders, sizing, and fabric queries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8DEC8] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <Phone className="w-4 h-4 text-[#58111A]" />
                <span>Phone Support</span>
              </div>
              <a href={`tel:+91${CLIENT_PHONE}`} className="text-[#58111A] font-medium block">
                +91 {CLIENT_PHONE}
              </a>
            </div>

            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8DEC8] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <Mail className="w-4 h-4 text-[#58111A]" />
                <span>Email Support</span>
              </div>
              <a
                href="mailto:silkmodefashion06@gmail.com"
                className="text-[#58111A] font-medium block"
              >
                silkmodefashion06@gmail.com
              </a>
            </div>

            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8DEC8] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <MapPin className="w-4 h-4 text-[#58111A]" />
                <span>Location</span>
              </div>
              <p className="text-stone-600 text-xs">
                SilkMode Fashion, Textile Market Hub, Surat, Gujarat, India
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8DEC8] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <Clock className="w-4 h-4 text-[#58111A]" />
                <span>Support Hours</span>
              </div>
              <p className="text-stone-600 text-xs">Monday – Saturday, 10:00 AM – 7:00 PM IST</p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={getGeneralWhatsAppUrl("Hello SilkMode Fashion, I need help with an enquiry.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BE5C] text-white text-xs font-bold shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
