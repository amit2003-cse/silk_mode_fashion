"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  RotateCcw,
  Truck,
  Upload,
  XCircle,
} from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

interface OrderDetail {
  id: string;
  orderNumber: string;
  items: Array<{
    productId: string;
    slug: string;
    name: string;
    colorName?: string;
    priceAtPurchase: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: "razorpay" | "cod";
  paymentStatus: string;
  orderStatus: string;
  trackingNumber: string | null;
  courierName: string | null;
  statusHistory: Array<{ status: string; at: string; note?: string }>;
  deliveredAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
}

interface ReturnRequestInfo {
  id: string;
  reason: string;
  description: string;
  proofImages: string[];
  status: string;
  refundAmount: number;
  adminNote: string | null;
  createdAt: string;
}

const CANCELLABLE = new Set(["placed", "confirmed", "packed"]);
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [returnRequest, setReturnRequest] = useState<ReturnRequestInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnReason, setReturnReason] = useState("damaged");
  const [returnDesc, setReturnDesc] = useState("");
  const [refundUpiOrBank, setRefundUpiOrBank] = useState("");
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [submittingReturn, setSubmittingReturn] = useState(false);

  const loadOrder = useCallback(async () => {
    if (!params?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${params.id}`, { cache: "no-store" });
      const data = (await res.json()) as {
        order?: OrderDetail;
        returnRequest?: ReturnRequestInfo | null;
        error?: string;
      };
      if (!res.ok || !data.order) {
        setError(data.error || "Order not found.");
      } else {
        setOrder(data.order);
        setReturnRequest(data.returnRequest ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    if (!authLoading && user) {
      loadOrder();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user, loadOrder]);

  const handleCancelOrder = async () => {
    if (!order) return;
    setError(null);
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason || "Cancelled by customer" }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error || "Could not cancel order.");
        return;
      }
      await loadOrder();
    } finally {
      setCancelling(false);
    }
  };

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || proofImages.length >= 3) return;
    setError(null);
    setUploadingPhoto(true);
    try {
      const presignRes = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: "returns",
          contentType: file.type || "image/jpeg",
          fileName: file.name,
        }),
      });
      const presignData = (await presignRes.json()) as {
        uploadUrl?: string;
        publicUrl?: string;
        error?: string;
      };
      if (!presignRes.ok || !presignData.uploadUrl || !presignData.publicUrl) {
        setError(presignData.error || "Failed to prepare photo upload.");
        return;
      }

      const uploadRes = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/jpeg" },
        body: file,
      });
      if (!uploadRes.ok) {
        setError("Photo upload to storage failed.");
        return;
      }

      setProofImages((prev) => [...prev, presignData.publicUrl!]);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setError(null);
    setSubmittingReturn(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: returnReason,
          description: returnDesc,
          proofImages,
          refundUpiOrBank: order.paymentMethod === "cod" ? refundUpiOrBank : undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error || "Failed to submit return request.");
        return;
      }
      setShowReturnForm(false);
      await loadOrder();
    } finally {
      setSubmittingReturn(false);
    }
  };

  const canCancel = order ? CANCELLABLE.has(order.orderStatus) : false;
  const canReturn =
    order &&
    order.orderStatus === "delivered" &&
    order.deliveredAt &&
    !returnRequest &&
    Date.now() - new Date(order.deliveredAt).getTime() <= THREE_DAYS_MS;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-[#58111A] mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Orders</span>
        </Link>

        {loading || authLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#58111A]" />
          </div>
        ) : !order ? (
          <div className="bg-white border border-[#E8DEC8] rounded-2xl p-8 text-center">
            <p className="text-sm text-stone-600">{error || "Order not found."}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700">
                {error}
              </div>
            )}

            {/* Header */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs text-stone-500">Order Number</p>
                <h1 className="font-serif-luxury text-2xl font-bold text-stone-900">
                  {order.orderNumber}
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  • {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                </p>
              </div>
              <span className="self-start sm:self-center px-3.5 py-1 rounded-full bg-[#58111A]/10 text-[#58111A] text-xs font-bold uppercase">
                {order.orderStatus}
              </span>
            </div>

            {/* Tracking */}
            {order.trackingNumber && (
              <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 flex items-center gap-3 text-xs">
                <Truck className="w-5 h-5 text-[#58111A] shrink-0" />
                <div>
                  <p className="font-bold text-stone-900">
                    Shipped via {order.courierName || "Courier Partner"}
                  </p>
                  <p className="text-stone-600">Tracking ID: {order.trackingNumber}</p>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 space-y-4">
              <h2 className="font-serif-luxury text-lg font-bold text-stone-900">Items</h2>
              <div className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 text-xs">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-semibold text-stone-900 hover:text-[#58111A]"
                        >
                          {item.name}
                        </Link>
                        {item.colorName && (
                          <p className="text-[11px] text-stone-500">Shade: {item.colorName}</p>
                        )}
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          Qty: {item.quantity} × ₹{item.priceAtPurchase.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-[#58111A] shrink-0">
                      ₹{(item.priceAtPurchase * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-stone-200 text-xs space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-1">
                  <span>Total</span>
                  <span className="text-[#58111A]">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 text-xs space-y-1">
              <h2 className="font-serif-luxury text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[#58111A]" />
                <span>Delivery Address</span>
              </h2>
              <p className="font-bold text-stone-800">
                {order.shippingAddress.fullName} (+91 {order.shippingAddress.phone})
              </p>
              <p className="text-stone-600">
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.pincode}
              </p>
            </div>

            {/* Pre-Shipment Cancellation */}
            {canCancel && (
              <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 space-y-3">
                <h2 className="font-serif-luxury text-lg font-bold text-stone-900 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Cancel Order</span>
                </h2>
                <p className="text-xs text-stone-500">
                  Orders can be cancelled before shipment. Paid online orders are refunded automatically.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Reason for cancellation (optional)"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-base rounded-xl border border-stone-300"
                  />
                  <button
                    type="button"
                    disabled={cancelling}
                    onClick={handleCancelOrder}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-60"
                  >
                    {cancelling ? "Cancelling..." : "Confirm Cancellation"}
                  </button>
                </div>
              </div>
            )}

            {/* Existing Return Status */}
            {returnRequest && (
              <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 space-y-2 text-xs">
                <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
                  Return Request ({returnRequest.status.toUpperCase()})
                </h2>
                <p className="text-stone-600">
                  Reason: <strong>{returnRequest.reason.replace("_", " ")}</strong>
                </p>
                {returnRequest.description && (
                  <p className="text-stone-600">{returnRequest.description}</p>
                )}
                {returnRequest.adminNote && (
                  <p className="text-[#58111A] font-medium">Note: {returnRequest.adminNote}</p>
                )}
              </div>
            )}

            {/* 3-Day Return Form */}
            {canReturn && (
              <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif-luxury text-lg font-bold text-stone-900 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-[#58111A]" />
                      <span>Request Return / Refund</span>
                    </h2>
                    <p className="text-xs text-stone-500">
                      Eligible within 3 days of delivery for damaged, wrong, or incorrect-colour items.
                    </p>
                  </div>
                  {!showReturnForm && (
                    <button
                      type="button"
                      onClick={() => setShowReturnForm(true)}
                      className="px-4 py-2 rounded-xl bg-[#58111A] text-white text-xs font-semibold cursor-pointer"
                    >
                      Request Return
                    </button>
                  )}
                </div>

                {showReturnForm && (
                  <form onSubmit={handleSubmitReturn} className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Issue Type
                      </label>
                      <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-base rounded-xl border border-stone-300 bg-white"
                      >
                        <option value="damaged">Damaged Product</option>
                        <option value="wrong_product">Wrong Product Delivered</option>
                        <option value="incorrect_color">Incorrect Colour Delivered</option>
                      </select>
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Describe the issue..."
                      value={returnDesc}
                      onChange={(e) => setReturnDesc(e.target.value)}
                      className="w-full px-3.5 py-2 text-base rounded-xl border border-stone-300"
                    />

                    {order.paymentMethod === "cod" && (
                      <input
                        type="text"
                        required
                        placeholder="Your UPI ID or Bank Account + IFSC for COD refund"
                        value={refundUpiOrBank}
                        onChange={(e) => setRefundUpiOrBank(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-base rounded-xl border border-stone-300"
                      />
                    )}

                    <div className="space-y-2">
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold cursor-pointer">
                        <Upload className="w-4 h-4 text-[#58111A]" />
                        <span>
                          {uploadingPhoto
                            ? "Uploading..."
                            : `Upload Proof Photo (${proofImages.length}/3)`}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={uploadingPhoto || proofImages.length >= 3}
                          onChange={handleUploadProof}
                          className="hidden"
                        />
                      </label>
                      {proofImages.length > 0 && (
                        <div className="flex gap-2">
                          {proofImages.map((url, i) => (
                            <div
                              key={i}
                              className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-200"
                            >
                              <Image src={url} alt="Proof" fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReturn || proofImages.length === 0}
                      className="bg-[#58111A] hover:bg-[#460D1B] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      {submittingReturn ? "Submitting..." : "Submit Return Request"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
