"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  Check,
  Edit3,
  Loader2,
  Package,
  Plus,
  RotateCcw,
  ShieldAlert,
  ShoppingBag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { ProductColor } from "@/data/products";

interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  code: string;
  price: number;
  originalPrice: number | null;
  badge: string;
  description: string;
  fabric: string;
  images: string[];
  colors: ProductColor[];
  trending: boolean;
  featured: boolean;
  isActive: boolean;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  items: Array<{ name: string; colorName?: string; quantity: number }>;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  courierName: string;
  trackingNumber: string;
  createdAt: string;
}

interface AdminReturn {
  id: string;
  orderNumber: string;
  reason: string;
  description: string;
  proofImages: string[];
  status: string;
  refundAmount: number;
  paymentMethod: string;
  refundDetails: string;
  adminNote: string;
  createdAt: string;
}

export default function AdminPage() {
  const { user, loading: authLoading, openLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "returns">("products");

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [returns, setReturns] = useState<AdminReturn[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  // Product Modal State
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [pForm, setPForm] = useState({
    name: "",
    category: "Silk Saree",
    code: "",
    price: "",
    originalPrice: "",
    fabric: "",
    description: "",
    trending: false,
    featured: false,
    images: [] as string[],
    colors: [] as ProductColor[],
  });
  const [uploadingImg, setUploadingImg] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  const loadAll = useCallback(async () => {
    setLoadingData(true);
    try {
      const [pRes, oRes, rRes] = await Promise.all([
        fetch("/api/admin/products", { cache: "no-store" }),
        fetch(`/api/admin/orders?status=${encodeURIComponent(orderStatusFilter)}`, {
          cache: "no-store",
        }),
        fetch("/api/admin/returns", { cache: "no-store" }),
      ]);
      if (pRes.ok) {
        const pData = (await pRes.json()) as { products: AdminProduct[] };
        setProducts(pData.products);
      }
      if (oRes.ok) {
        const oData = (await oRes.json()) as { orders: AdminOrder[] };
        setOrders(oData.orders);
      }
      if (rRes.ok) {
        const rData = (await rRes.json()) as { returns: AdminReturn[] };
        setReturns(rData.returns);
      }
    } finally {
      setLoadingData(false);
    }
  }, [orderStatusFilter]);

  useEffect(() => {
    if (user?.role === "admin") {
      loadAll();
    }
  }, [user, loadAll]);

  const openNewProductModal = () => {
    setEditingProduct(null);
    setPForm({
      name: "",
      category: "Silk Saree",
      code: "",
      price: "",
      originalPrice: "",
      fabric: "",
      description: "",
      trending: false,
      featured: false,
      images: [],
      colors: [{ name: "Standard", hex: "#58111A", imageIndex: 0, sku: "", stock: 10 }],
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (p: AdminProduct) => {
    setEditingProduct(p);
    setPForm({
      name: p.name,
      category: p.category,
      code: p.code,
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      fabric: p.fabric,
      description: p.description,
      trending: p.trending,
      featured: p.featured,
      images: p.images,
      colors:
        p.colors.length > 0
          ? p.colors
          : [{ name: "Standard", hex: "#58111A", imageIndex: 0, sku: "", stock: 10 }],
    });
    setIsProductModalOpen(true);
  };

  const handleUploadProductImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const presignRes = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: "products",
          contentType: file.type || "image/jpeg",
          fileName: file.name,
        }),
      });
      const presign = (await presignRes.json()) as { uploadUrl?: string; publicUrl?: string };
      if (!presignRes.ok || !presign.uploadUrl || !presign.publicUrl) return;

      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/jpeg" },
        body: file,
      });
      if (putRes.ok) {
        setPForm((prev) => ({ ...prev, images: [...prev.images, presign.publicUrl!] }));
      }
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const payload = {
        name: pForm.name,
        category: pForm.category,
        code: pForm.code,
        price: Number(pForm.price),
        originalPrice: pForm.originalPrice ? Number(pForm.originalPrice) : null,
        fabric: pForm.fabric,
        description: pForm.description,
        trending: pForm.trending,
        featured: pForm.featured,
        images: pForm.images,
        colors: pForm.colors,
      };
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsProductModalOpen(false);
        setBannerMsg(editingProduct ? "Product updated." : "Product created.");
        await loadAll();
      }
    } finally {
      setSavingProduct(false);
    }
  };

  const handleToggleArchive = async (p: AdminProduct) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    await loadAll();
  };

  const handleUpdateOrder = async (order: AdminOrder) => {
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderStatus: order.orderStatus,
        courierName: order.courierName,
        trackingNumber: order.trackingNumber,
      }),
    });
    if (res.ok) {
      setBannerMsg(`Order ${order.orderNumber} updated.`);
      await loadAll();
    }
  };

  const handleUpdateReturn = async (ret: AdminReturn) => {
    const res = await fetch(`/api/admin/returns/${ret.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: ret.status, adminNote: ret.adminNote }),
    });
    if (res.ok) {
      setBannerMsg(`Return for ${ret.orderNumber} updated.`);
      await loadAll();
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQ.trim()) return true;
    const q = searchQ.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {authLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#58111A]" />
          </div>
        ) : !user ? (
          <div className="max-w-md mx-auto bg-white border border-[#E8DEC8] rounded-2xl p-8 text-center">
            <ShieldAlert className="w-10 h-10 text-[#58111A] mx-auto mb-3" />
            <h1 className="font-serif-luxury text-2xl font-bold">Admin Sign In Required</h1>
            <p className="text-xs text-stone-500 mt-1 mb-5">
              Please sign in with your admin account to continue.
            </p>
            <button
              type="button"
              onClick={openLoginModal}
              className="bg-[#58111A] text-white px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
            >
              Sign In
            </button>
          </div>
        ) : user.role !== "admin" ? (
          <div className="max-w-md mx-auto bg-white border border-red-200 rounded-2xl p-8 text-center">
            <ShieldAlert className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <h1 className="font-serif-luxury text-2xl font-bold text-red-700">
              403 — Access Denied
            </h1>
            <p className="text-xs text-stone-600 mt-1 mb-5">
              This panel is restricted to SilkMode Fashion administrators.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#58111A] text-white px-6 py-2.5 rounded-full text-xs font-semibold"
            >
              Return Home
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#58111A] font-semibold">
                  SilkMode Management
                </p>
                <h1 className="font-serif-luxury text-3xl font-bold text-stone-900">
                  Admin Dashboard
                </h1>
              </div>

              <div className="flex items-center gap-2 bg-white border border-[#E8DEC8] p-1 rounded-full">
                {(
                  [
                    { key: "products", label: `Products (${products.length})`, icon: ShoppingBag },
                    { key: "orders", label: `Orders (${orders.length})`, icon: Package },
                    { key: "returns", label: `Returns (${returns.length})`, icon: RotateCcw },
                  ] as const
                ).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                      activeTab === key
                        ? "bg-[#58111A] text-white"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {bannerMsg && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs text-emerald-800 flex items-center justify-between">
                <span>{bannerMsg}</span>
                <button type="button" onClick={() => setBannerMsg(null)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {loadingData && (
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Refreshing data...</span>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === "products" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                  <input
                    type="text"
                    placeholder="Search products by name, category, or code..."
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    className="flex-1 max-w-md px-4 py-2 text-base rounded-xl border border-stone-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={openNewProductModal}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#58111A] hover:bg-[#460D1B] text-white px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className={`bg-white border rounded-2xl p-4 flex gap-3 ${
                        p.isActive ? "border-[#E8DEC8]" : "border-red-200 opacity-65"
                      }`}
                    >
                      <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        <Image
                          src={p.images[0] || "/images/hero-banner-2.jpg"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] uppercase text-stone-400">
                            {p.category} {p.code ? `• ${p.code}` : ""}
                          </p>
                          <h3 className="text-xs font-bold text-stone-900 line-clamp-2">
                            {p.name}
                          </h3>
                          <p className="text-xs font-bold text-[#58111A] mt-1">
                            ₹{p.price.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[10px] text-stone-500 mt-0.5">
                            {p.colors.length} colour(s) • Total stock:{" "}
                            {p.colors.reduce((s, c) => s + (c.stock ?? 0), 0)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-300 text-[11px] font-semibold hover:border-[#58111A] cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleArchive(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-300 text-[11px] font-semibold hover:border-red-500 cursor-pointer"
                          >
                            <Archive className="w-3 h-3" /> {p.isActive ? "Archive" : "Restore"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-600">Filter Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-2 text-base rounded-xl border border-stone-300 bg-white"
                  >
                    {["all", "placed", "confirmed", "packed", "shipped", "delivered", "cancelled"].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s.toUpperCase()}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="space-y-3">
                  {orders.map((order, idx) => (
                    <div
                      key={order.id}
                      className="bg-white border border-[#E8DEC8] rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex flex-wrap justify-between gap-2 text-xs">
                        <div>
                          <span className="font-bold text-stone-900">{order.orderNumber}</span> •{" "}
                          <span>{order.customerName}</span> ({order.customerPhone})
                          <p className="text-[11px] text-stone-500">
                            ₹{order.totalAmount.toLocaleString("en-IN")} •{" "}
                            {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                          </p>
                        </div>
                        <span className="text-[11px] text-stone-400">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOrders((prev) =>
                              prev.map((o, i) => (i === idx ? { ...o, orderStatus: val } : o))
                            );
                          }}
                          className="px-3 py-2 text-base rounded-xl border border-stone-300 bg-white"
                        >
                          {["placed", "confirmed", "packed", "shipped", "delivered", "cancelled"].map(
                            (s) => (
                              <option key={s} value={s}>
                                {s.toUpperCase()}
                              </option>
                            )
                          )}
                        </select>
                        <input
                          type="text"
                          placeholder="Courier Name"
                          value={order.courierName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOrders((prev) =>
                              prev.map((o, i) => (i === idx ? { ...o, courierName: val } : o))
                            );
                          }}
                          className="px-3 py-2 text-base rounded-xl border border-stone-300"
                        />
                        <input
                          type="text"
                          placeholder="Tracking Number"
                          value={order.trackingNumber}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOrders((prev) =>
                              prev.map((o, i) => (i === idx ? { ...o, trackingNumber: val } : o))
                            );
                          }}
                          className="px-3 py-2 text-base rounded-xl border border-stone-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateOrder(order)}
                          className="inline-flex items-center justify-center gap-1 bg-[#58111A] hover:bg-[#460D1B] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RETURNS TAB */}
            {activeTab === "returns" && (
              <div className="space-y-3">
                {returns.length === 0 ? (
                  <p className="text-xs text-stone-500">No return requests yet.</p>
                ) : (
                  returns.map((ret, idx) => (
                    <div
                      key={ret.id}
                      className="bg-white border border-[#E8DEC8] rounded-2xl p-4 space-y-3 text-xs"
                    >
                      <div className="flex flex-wrap justify-between gap-2">
                        <div>
                          <p className="font-bold text-stone-900">
                            Order {ret.orderNumber} • ₹{ret.refundAmount.toLocaleString("en-IN")} (
                            {ret.paymentMethod.toUpperCase()})
                          </p>
                          <p className="text-stone-600">
                            Reason: <strong>{ret.reason.replace("_", " ")}</strong>
                          </p>
                          {ret.description && <p className="text-stone-500">{ret.description}</p>}
                          {ret.refundDetails && (
                            <p className="text-[#58111A] font-medium mt-1">
                              COD Refund Details: {ret.refundDetails}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {ret.proofImages.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-200 block"
                            >
                              <Image src={url} alt="Proof" fill className="object-cover" />
                            </a>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select
                          value={ret.status}
                          onChange={(e) => {
                            const val = e.target.value;
                            setReturns((prev) =>
                              prev.map((r, i) => (i === idx ? { ...r, status: val } : r))
                            );
                          }}
                          className="px-3 py-2 text-base rounded-xl border border-stone-300 bg-white"
                        >
                          {["requested", "approved", "rejected", "picked_up", "refunded"].map(
                            (s) => (
                              <option key={s} value={s}>
                                {s.toUpperCase()}
                              </option>
                            )
                          )}
                        </select>
                        <input
                          type="text"
                          placeholder="Admin note for customer"
                          value={ret.adminNote}
                          onChange={(e) => {
                            const val = e.target.value;
                            setReturns((prev) =>
                              prev.map((r, i) => (i === idx ? { ...r, adminNote: val } : r))
                            );
                          }}
                          className="px-3 py-2 text-base rounded-xl border border-stone-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateReturn(ret)}
                          className="bg-[#58111A] hover:bg-[#460D1B] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Update Return
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Product Create / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setIsProductModalOpen(false)}
          />
          <form
            onSubmit={handleSaveProduct}
            className="relative z-10 w-full max-w-2xl bg-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif-luxury text-xl font-bold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button type="button" onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Product Name"
                value={pForm.name}
                onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                className="px-3 py-2 text-base rounded-xl border border-stone-300"
              />
              <input
                type="text"
                required
                placeholder="Category (e.g. Silk Saree)"
                value={pForm.category}
                onChange={(e) => setPForm({ ...pForm, category: e.target.value })}
                className="px-3 py-2 text-base rounded-xl border border-stone-300"
              />
              <input
                type="number"
                required
                placeholder="Selling Price (INR)"
                value={pForm.price}
                onChange={(e) => setPForm({ ...pForm, price: e.target.value })}
                className="px-3 py-2 text-base rounded-xl border border-stone-300"
              />
              <input
                type="number"
                placeholder="MRP / Original Price"
                value={pForm.originalPrice}
                onChange={(e) => setPForm({ ...pForm, originalPrice: e.target.value })}
                className="px-3 py-2 text-base rounded-xl border border-stone-300"
              />
              <input
                type="text"
                placeholder="Design Code (SKU)"
                value={pForm.code}
                onChange={(e) => setPForm({ ...pForm, code: e.target.value })}
                className="px-3 py-2 text-base rounded-xl border border-stone-300"
              />
              <input
                type="text"
                placeholder="Fabric"
                value={pForm.fabric}
                onChange={(e) => setPForm({ ...pForm, fabric: e.target.value })}
                className="px-3 py-2 text-base rounded-xl border border-stone-300"
              />
            </div>

            <textarea
              rows={2}
              placeholder="Product Description"
              value={pForm.description}
              onChange={(e) => setPForm({ ...pForm, description: e.target.value })}
              className="w-full px-3 py-2 text-base rounded-xl border border-stone-300"
            />

            <div className="flex gap-4 text-xs">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={pForm.trending}
                  onChange={(e) => setPForm({ ...pForm, trending: e.target.checked })}
                />
                Trending
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={pForm.featured}
                  onChange={(e) => setPForm({ ...pForm, featured: e.target.checked })}
                />
                Featured Best Seller
              </label>
            </div>

            {/* R2 Image Upload */}
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-semibold cursor-pointer">
                <Upload className="w-4 h-4 text-[#58111A]" />
                <span>{uploadingImg ? "Uploading to R2..." : "Upload Product Image (R2)"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploadingImg}
                  onChange={handleUploadProductImage}
                  className="hidden"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {pForm.images.map((url, idx) => (
                  <div key={idx} className="relative w-16 h-20 rounded-lg overflow-hidden border">
                    <Image src={url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setPForm({
                          ...pForm,
                          images: pForm.images.filter((_, i) => i !== idx),
                        })
                      }
                      className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Colour Variants & Stock */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-stone-800">Colour Variants &amp; Stock</p>
                <button
                  type="button"
                  onClick={() =>
                    setPForm({
                      ...pForm,
                      colors: [
                        ...pForm.colors,
                        { name: "New Shade", hex: "#58111A", imageIndex: 0, sku: "", stock: 10 },
                      ],
                    })
                  }
                  className="text-xs font-semibold text-[#58111A] hover:underline cursor-pointer"
                >
                  + Add Colour
                </button>
              </div>
              {pForm.colors.map((c, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Colour Name"
                    value={c.name}
                    onChange={(e) => {
                      const next = [...pForm.colors];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setPForm({ ...pForm, colors: next });
                    }}
                    className="col-span-2 px-2.5 py-1.5 text-sm rounded-lg border border-stone-300"
                  />
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => {
                      const next = [...pForm.colors];
                      next[idx] = { ...next[idx], hex: e.target.value };
                      setPForm({ ...pForm, colors: next });
                    }}
                    className="h-9 w-full rounded border border-stone-300"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={c.stock ?? 0}
                    onChange={(e) => {
                      const next = [...pForm.colors];
                      next[idx] = { ...next[idx], stock: Number(e.target.value) };
                      setPForm({ ...pForm, colors: next });
                    }}
                    className="px-2.5 py-1.5 text-sm rounded-lg border border-stone-300"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPForm({
                        ...pForm,
                        colors: pForm.colors.filter((_, i) => i !== idx),
                      })
                    }
                    className="p-1.5 text-stone-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={savingProduct}
              className="w-full bg-[#58111A] hover:bg-[#460D1B] text-white py-3 rounded-xl text-sm font-semibold cursor-pointer"
            >
              {savingProduct ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
            </button>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}
