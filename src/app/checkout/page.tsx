"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  Truck,
  Wallet,
  ArrowLeft,
} from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { BUY_NOW_STORAGE_KEY, CartItem, useCart } from "@/context/CartContext";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("mode") === "buy_now";

  const { user, loading: authLoading, openLoginModal } = useAuth();
  const { items: cartItems, clearCart } = useCart();

  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    totalAmount: number;
    paymentMethod: string;
  } | null>(null);

  useEffect(() => {
    if (isBuyNow) {
      try {
        const raw = sessionStorage.getItem(BUY_NOW_STORAGE_KEY);
        if (raw) setBuyNowItem(JSON.parse(raw) as CartItem);
      } catch {
        setBuyNowItem(null);
      }
    }
  }, [isBuyNow]);

  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddressId(def.id);
    } else if (user) {
      setSelectedAddressId("new");
      setAddressForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const activeItems = useMemo(() => {
    if (isBuyNow) return buyNowItem ? [buyNowItem] : [];
    return cartItems;
  }, [isBuyNow, buyNowItem, cartItems]);

  const subtotal = useMemo(
    () => activeItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [activeItems]
  );
  const shippingFee = subtotal === 0 || subtotal > 999 ? 0 : 99;
  const totalAmount = subtotal + shippingFee;
  const isCodAllowed = totalAmount <= 10000;

  useEffect(() => {
    if (!isCodAllowed && paymentMethod === "cod") {
      setPaymentMethod("razorpay");
    }
  }, [isCodAllowed, paymentMethod]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      openLoginModal();
      return;
    }

    const chosenAddress =
      selectedAddressId !== "new"
        ? user.addresses?.find((a) => a.id === selectedAddressId)
        : addressForm;

    if (!chosenAddress) {
      setError("Please select or enter a shipping address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: isBuyNow ? "buy_now" : "cart",
          paymentMethod,
          shippingAddress: chosenAddress,
          items: activeItems.map((i) => ({
            slug: i.slug,
            colorName: i.colorName,
            quantity: i.quantity,
          })),
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        orderNumber?: string;
        totalAmount?: number;
        razorpayOrderId?: string | null;
        razorpayKeyId?: string | null;
      };

      if (!res.ok || !data.orderNumber) {
        setError(data.error || "Failed to place order.");
        return;
      }

      if (paymentMethod === "cod") {
        if (isBuyNow) {
          sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
        } else {
          await clearCart();
        }
        setConfirmedOrder({
          orderNumber: data.orderNumber,
          totalAmount: data.totalAmount ?? totalAmount,
          paymentMethod: "cod",
        });
        return;
      }

      // Razorpay Flow
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay || !data.razorpayOrderId || !data.razorpayKeyId) {
        setError("Unable to open Razorpay checkout. Please try again.");
        return;
      }

      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        amount: Math.round((data.totalAmount ?? totalAmount) * 100),
        currency: "INR",
        name: "SilkMode Fashion",
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: chosenAddress.fullName,
          email: user.email || undefined,
          contact: chosenAddress.phone,
        },
        theme: { color: "#58111A" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = (await verifyRes.json()) as {
            ok?: boolean;
            orderNumber?: string;
            error?: string;
          };
          if (!verifyRes.ok) {
            setError(verifyData.error || "Payment verification failed.");
            return;
          }
          if (isBuyNow) {
            sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
          } else {
            await clearCart();
          }
          setConfirmedOrder({
            orderNumber: verifyData.orderNumber || data.orderNumber!,
            totalAmount: data.totalAmount ?? totalAmount,
            paymentMethod: "razorpay",
          });
        },
      });
      rzp.open();
    } catch {
      setError("Network error while placing order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-xl mx-auto bg-white border border-[#E8DEC8] rounded-2xl p-8 text-center shadow-sm my-8">
        <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#58111A] font-semibold">
          Order Confirmed
        </p>
        <h1 className="font-serif-luxury text-3xl font-bold text-stone-900 mt-1">
          Thank You for Your Order!
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          Order Number: <strong className="text-stone-900">{confirmedOrder.orderNumber}</strong>
        </p>
        <p className="text-xs text-stone-500 mt-1">
          Total: ₹{confirmedOrder.totalAmount.toLocaleString("en-IN")} •{" "}
          {confirmedOrder.paymentMethod.toUpperCase()}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/orders"
            className="px-6 py-2.5 rounded-full bg-[#58111A] hover:bg-[#460D1B] text-white text-xs font-semibold transition"
          >
            View My Orders
          </Link>
          <Link
            href="/collections"
            className="px-6 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:border-[#58111A] text-xs font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/collections"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-[#58111A] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Shop</span>
      </Link>

      <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mb-6">
        Checkout
      </h1>

      {activeItems.length === 0 ? (
        <div className="bg-white border border-[#E8DEC8] rounded-2xl p-8 text-center">
          <p className="text-sm text-stone-600 mb-4">Your checkout bag is empty.</p>
          <Link
            href="/collections"
            className="inline-block bg-[#58111A] text-white px-6 py-2.5 rounded-full text-xs font-semibold"
          >
            Explore Sarees
          </Link>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Auth, Address & Payment */}
          <div className="lg:col-span-7 space-y-6">
            {!authLoading && !user && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                <p className="text-xs text-amber-900">
                  Please sign in with Google or Mobile OTP to complete your order.
                </p>
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="bg-[#58111A] text-white px-4 py-2 rounded-full text-xs font-semibold shrink-0 cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Shipping Address */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 space-y-4">
              <h2 className="font-serif-luxury text-lg font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#58111A]" />
                <span>Delivery Address</span>
              </h2>

              {user?.addresses && user.addresses.length > 0 && (
                <div className="space-y-2">
                  {user.addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                        selectedAddressId === addr.id
                          ? "border-[#58111A] bg-[#58111A]/5"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-[#58111A]"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-stone-900">
                          {addr.label} — {addr.fullName} (+91 {addr.phone})
                        </p>
                        <p className="text-stone-600 mt-0.5">
                          {addr.line1}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                    </label>
                  ))}

                  <label className="flex items-center gap-2 text-xs font-semibold text-[#58111A] pt-1 cursor-pointer">
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={selectedAddressId === "new"}
                      onChange={() => setSelectedAddressId("new")}
                      className="accent-[#58111A]"
                    />
                    <span>Use a new delivery address</span>
                  </label>
                </div>
              )}

              {selectedAddressId === "new" && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={addressForm.fullName}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, fullName: e.target.value })
                      }
                      className="px-3.5 py-2.5 text-base rounded-xl border border-stone-300"
                    />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit Mobile Number"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="px-3.5 py-2.5 text-base rounded-xl border border-stone-300"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="House No, Street, Area"
                    value={addressForm.line1}
                    onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base rounded-xl border border-stone-300"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="px-3.5 py-2.5 text-base rounded-xl border border-stone-300"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="px-3.5 py-2.5 text-base rounded-xl border border-stone-300"
                    />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="6-digit Pincode"
                      value={addressForm.pincode}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          pincode: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="px-3.5 py-2.5 text-base rounded-xl border border-stone-300"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 space-y-3">
              <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
                Payment Method
              </h2>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer ${
                  paymentMethod === "razorpay"
                    ? "border-[#58111A] bg-[#58111A]/5"
                    : "border-stone-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                    className="accent-[#58111A]"
                  />
                  <div>
                    <p className="text-xs font-bold text-stone-900">
                      Pay Online (UPI / Cards / NetBanking)
                    </p>
                    <p className="text-[11px] text-stone-500">Secured by Razorpay</p>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-[#58111A]" />
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border ${
                  !isCodAllowed ? "opacity-50 cursor-not-allowed bg-stone-50" : "cursor-pointer"
                } ${
                  paymentMethod === "cod" ? "border-[#58111A] bg-[#58111A]/5" : "border-stone-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    disabled={!isCodAllowed}
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-[#58111A]"
                  />
                  <div>
                    <p className="text-xs font-bold text-stone-900">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-stone-500">
                      {isCodAllowed
                        ? "Available up to ₹10,000 • No extra COD fee"
                        : "COD is only available for orders up to ₹10,000"}
                    </p>
                  </div>
                </div>
                <Wallet className="w-5 h-5 text-[#58111A]" />
              </label>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 space-y-4 sticky top-24">
              <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
                Order Summary ({activeItems.length})
              </h2>

              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
                {activeItems.map((item) => (
                  <div
                    key={`${item.slug}-${item.colorName || "std"}`}
                    className="py-3 flex gap-3"
                  >
                    <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-stone-900 line-clamp-2">{item.name}</p>
                      {item.colorName && (
                        <p className="text-[11px] text-stone-500 mt-0.5">Shade: {item.colorName}</p>
                      )}
                      <p className="text-[11px] text-stone-600 mt-1">
                        Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-[#58111A] shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Shipping
                  </span>
                  <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Payable</span>
                  <span className="text-[#58111A]">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-[#58111A] hover:bg-[#460D1B] disabled:opacity-60 text-white py-3.5 rounded-xl text-sm font-bold shadow-md transition cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>
                  {paymentMethod === "cod"
                    ? `Place COD Order (₹${totalAmount.toLocaleString("en-IN")})`
                    : `Pay ₹${totalAmount.toLocaleString("en-IN")} Online`}
                </span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-[#58111A]" />
            </div>
          }
        >
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
