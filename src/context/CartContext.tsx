"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SareeProduct } from "@/data/products";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  category: string;
  code?: string;
  price: number;
  originalPrice?: number;
  image: string;
  colorName?: string;
  colorHex?: string;
  quantity: number;
  maxStock: number;
}

const GUEST_CART_KEY = "sm_guest_cart";
export const BUY_NOW_STORAGE_KEY = "sm_buy_now";

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: SareeProduct, colorName?: string, quantity?: number) => void;
  buyNow: (product: SareeProduct, colorName?: string, quantity?: number) => void;
  updateQuantity: (slug: string, colorName: string | undefined, quantity: number) => void;
  removeItem: (slug: string, colorName?: string) => void;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function getVariantInfo(product: SareeProduct, colorName?: string) {
  const colorObj =
    (colorName ? product.colors?.find((c) => c.name === colorName) : undefined) ||
    product.colors?.[0];
  const imgIdx = colorObj?.imageIndex ?? 0;
  const maxStock = product.inStock === false ? 0 : (colorObj?.stock ?? 10);
  return {
    colorName: colorObj?.name,
    colorHex: colorObj?.hex,
    image: product.images[imgIdx] || product.images[0] || "/images/hero-banner-2.jpg",
    maxStock,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const prevUserIdRef = useRef<string | null>(null);

  // Load initial guest cart on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(GUEST_CART_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore invalid storage
    }
  }, []);

  // Merge guest cart into MongoDB when user signs in
  useEffect(() => {
    if (authLoading) return;
    const currentUserId = user?.id ?? null;

    if (currentUserId && prevUserIdRef.current !== currentUserId) {
      prevUserIdRef.current = currentUserId;
      let guestItems: CartItem[] = [];
      try {
        const raw = localStorage.getItem(GUEST_CART_KEY);
        if (raw) guestItems = JSON.parse(raw) as CartItem[];
      } catch {
        guestItems = [];
      }

      const sync = async () => {
        try {
          if (guestItems.length > 0) {
            const res = await fetch("/api/cart/merge", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: guestItems.map((i) => ({
                  slug: i.slug,
                  colorName: i.colorName,
                  quantity: i.quantity,
                })),
              }),
            });
            if (res.ok) {
              const data = (await res.json()) as { items: CartItem[] };
              setItems(data.items);
              localStorage.removeItem(GUEST_CART_KEY);
            }
          } else {
            const res = await fetch("/api/cart", { cache: "no-store" });
            if (res.ok) {
              const data = (await res.json()) as { items: CartItem[] };
              setItems(data.items);
            }
          }
        } catch {
          // keep local state on transient network error
        }
      };
      sync();
    } else if (!currentUserId) {
      prevUserIdRef.current = null;
    }
  }, [user, authLoading]);

  const persistCart = useCallback(
    async (nextItems: CartItem[]) => {
      if (user) {
        try {
          await fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: nextItems.map((i) => ({
                slug: i.slug,
                colorName: i.colorName,
                quantity: i.quantity,
              })),
            }),
          });
        } catch {
          // ignore
        }
      } else {
        try {
          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextItems));
        } catch {
          // ignore
        }
      }
    },
    [user]
  );

  const addToCart = useCallback(
    (product: SareeProduct, colorName?: string, quantity = 1) => {
      const variant = getVariantInfo(product, colorName);
      if (variant.maxStock <= 0) return;

      setItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.slug === product.slug && (i.colorName || "") === (variant.colorName || "")
        );
        let next: CartItem[];
        if (idx >= 0) {
          next = prev.map((item, i) =>
            i === idx
              ? { ...item, quantity: Math.min(item.quantity + quantity, variant.maxStock), maxStock: variant.maxStock }
              : item
          );
        } else {
          next = [
            ...prev,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              category: product.category,
              code: product.code,
              price: product.price,
              originalPrice: product.originalPrice,
              image: variant.image,
              colorName: variant.colorName,
              colorHex: variant.colorHex,
              quantity: Math.min(Math.max(1, quantity), variant.maxStock),
              maxStock: variant.maxStock,
            },
          ];
        }
        persistCart(next);
        return next;
      });
      setIsCartOpen(true);
    },
    [persistCart]
  );

  const buyNow = useCallback(
    (product: SareeProduct, colorName?: string, quantity = 1) => {
      const variant = getVariantInfo(product, colorName);
      if (variant.maxStock <= 0) return;

      const buyNowItem: CartItem = {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        code: product.code,
        price: product.price,
        originalPrice: product.originalPrice,
        image: variant.image,
        colorName: variant.colorName,
        colorHex: variant.colorHex,
        quantity: Math.min(Math.max(1, quantity), variant.maxStock),
        maxStock: variant.maxStock,
      };
      try {
        sessionStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify(buyNowItem));
      } catch {
        // ignore
      }
      router.push("/checkout?mode=buy_now");
    },
    [router]
  );

  const updateQuantity = useCallback(
    (slug: string, colorName: string | undefined, quantity: number) => {
      setItems((prev) => {
        const next = prev
          .map((item) => {
            if (item.slug === slug && (item.colorName || "") === (colorName || "")) {
              if (quantity <= 0) return null;
              return { ...item, quantity: Math.min(quantity, item.maxStock) };
            }
            return item;
          })
          .filter((i): i is CartItem => i !== null);
        persistCart(next);
        return next;
      });
    },
    [persistCart]
  );

  const removeItem = useCallback(
    (slug: string, colorName?: string) => {
      setItems((prev) => {
        const next = prev.filter(
          (item) => !(item.slug === slug && (item.colorName || "") === (colorName || ""))
        );
        persistCart(next);
        return next;
      });
    },
    [persistCart]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    if (user) {
      await fetch("/api/cart", { method: "DELETE" });
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
    }
  }, [user]);

  const { totalCount, subtotal, shippingFee, totalAmount } = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const sub = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    // Business rule: Free shipping above ₹999; ₹99 fixed charge for ₹999 and below
    const ship = sub === 0 || sub > 999 ? 0 : 99;
    return {
      totalCount: count,
      subtotal: sub,
      shippingFee: ship,
      totalAmount: sub + ship,
    };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        shippingFee,
        totalAmount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        buyNow,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
