"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight, Loader2, ArrowLeft, ShoppingBag } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

interface OrderListItem {
  id: string;
  orderNumber: string;
  items: Array<{ name: string; image: string; colorName?: string; quantity: number }>;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const STATUS_BADGE: Record<string, string> = {
  placed: "bg-stone-100 text-stone-700",
  confirmed: "bg-blue-50 text-blue-700",
  packed: "bg-amber-50 text-amber-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function OrdersPage() {
  const { user, loading: authLoading, openLoginModal } = useAuth();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    fetch("/api/orders", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data: { orders?: OrderListItem[] }) => {
        setOrders(data.orders ?? []);
      })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-[#58111A] mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>

        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mb-6">
          My Orders
        </h1>

        {loading || authLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#58111A]" />
          </div>
        ) : !user ? (
          <div className="bg-white border border-[#E8DEC8] rounded-2xl p-8 text-center">
            <Package className="w-10 h-10 text-[#58111A] mx-auto mb-3" />
            <p className="text-sm text-stone-600 mb-4">Sign in to view your order history.</p>
            <button
              type="button"
              onClick={openLoginModal}
              className="bg-[#58111A] text-white px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
            >
              Sign In
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-[#E8DEC8] rounded-2xl p-8 text-center">
            <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="font-serif-luxury text-xl font-semibold text-stone-800">
              No orders yet
            </p>
            <p className="text-xs text-stone-500 mt-1 mb-5">
              Once you place an order, you can track and manage it here.
            </p>
            <Link
              href="/collections"
              className="inline-block bg-[#58111A] text-white px-6 py-2.5 rounded-full text-xs font-semibold"
            >
              Browse Sarees
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const firstItem = order.items[0];
              const badgeClass =
                STATUS_BADGE[order.orderStatus] || "bg-stone-100 text-stone-700";

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white border border-[#E8DEC8] hover:border-[#58111A] rounded-2xl p-4 sm:p-5 transition shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <p className="text-xs font-bold text-stone-900">{order.orderNumber}</p>
                      <p className="text-[11px] text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${badgeClass}`}
                      >
                        {order.orderStatus}
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {firstItem && (
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                          <Image
                            src={firstItem.image}
                            alt={firstItem.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 text-xs">
                        <p className="font-semibold text-stone-800 truncate">
                          {firstItem?.name || "SilkMode Order"}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {order.items.length > 1
                            ? `+${order.items.length - 1} more item(s)`
                            : firstItem?.colorName || ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#58111A]">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] uppercase text-stone-400">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
