"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2, Truck, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    totalCount,
    subtotal,
    shippingFee,
    totalAmount,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingTarget = 1000; // Free above ₹999
  const amountRemaining = Math.max(0, freeShippingTarget - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingTarget) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={closeCart}
      />

      <aside className="relative z-10 w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col border-l border-[#E8DEC8]">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-[#E8DEC8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#58111A]" />
            <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
              Your Shopping Bag ({totalCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-1.5 rounded-full bg-stone-100 text-stone-600 hover:text-stone-900"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-[#FAF6F0] border-b border-[#E8DEC8]">
            <div className="flex items-center gap-2 text-xs text-stone-700 mb-1.5">
              <Truck className="w-4 h-4 text-[#58111A] shrink-0" />
              {amountRemaining === 0 ? (
                <span className="font-semibold text-emerald-700">
                  Yay! You unlocked FREE All-India Shipping!
                </span>
              ) : (
                <span>
                  Add <strong>₹{amountRemaining.toLocaleString("en-IN")}</strong> more for{" "}
                  <strong>FREE Shipping</strong>
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#58111A] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <ShoppingBag className="w-12 h-12 text-stone-300 mb-3" />
              <p className="font-serif-luxury text-xl font-semibold text-stone-800">
                Your bag is empty
              </p>
              <p className="text-xs text-stone-500 mt-1 mb-5">
                Explore our handcrafted Banarasi, Kanjivaram, and Bridal collections.
              </p>
              <Link
                href="/collections"
                onClick={closeCart}
                className="bg-[#58111A] hover:bg-[#460D1B] text-white px-6 py-2.5 rounded-full text-xs font-semibold transition"
              >
                Explore Sarees
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.slug}-${item.colorName || "std"}`}
                className="bg-white border border-stone-200 rounded-xl p-3 flex gap-3 shadow-2xs"
              >
                <Link
                  href={`/products/${item.slug}`}
                  onClick={closeCart}
                  className="relative w-20 h-24 rounded-lg overflow-hidden bg-stone-100 shrink-0"
                >
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="text-xs font-semibold text-stone-900 line-clamp-2 hover:text-[#58111A]"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug, item.colorName)}
                        className="text-stone-400 hover:text-red-600 p-0.5 shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {item.colorName && (
                      <div className="flex items-center gap-1.5 mt-1">
                        {item.colorHex && (
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/15"
                            style={{ backgroundColor: item.colorHex }}
                          />
                        )}
                        <span className="text-[11px] text-stone-500 truncate">{item.colorName}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-[#58111A]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>

                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.slug, item.colorName, item.quantity - 1)
                        }
                        className="p-1.5 text-stone-600 hover:text-stone-900 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.maxStock}
                        onClick={() =>
                          updateQuantity(item.slug, item.colorName, item.quantity + 1)
                        }
                        className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-40 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Totals */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E8DEC8] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-1.5 border-t border-stone-100">
                <span>Total</span>
                <span className="text-[#58111A]">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full flex items-center justify-center gap-2 bg-[#58111A] hover:bg-[#460D1B] text-white py-3 rounded-xl text-sm font-semibold shadow-md transition"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
