"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Plus, Trash2, LogOut, User, Shield, Loader2, ArrowLeft } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, loading, openLoginModal, refreshUser, logout } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: true,
  });
  const [addrError, setAddrError] = useState<string | null>(null);
  const [savingAddr, setSavingAddr] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setProfileMsg(data.error || "Could not update profile.");
      } else {
        await refreshUser();
        setProfileMsg("Profile updated.");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrError(null);
    setSavingAddr(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addrForm),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setAddrError(data.error || "Failed to save address.");
        return;
      }
      await refreshUser();
      setShowAddressForm(false);
      setAddrForm({
        label: "Home",
        fullName: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    } finally {
      setSavingAddr(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    await fetch(`/api/account/addresses?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await refreshUser();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-[#58111A] mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#58111A]" />
          </div>
        ) : !user ? (
          <div className="bg-white border border-[#E8DEC8] rounded-2xl p-8 text-center shadow-xs">
            <User className="w-10 h-10 text-[#58111A] mx-auto mb-3" />
            <h1 className="font-serif-luxury text-2xl font-bold text-stone-900">
              Sign in to manage your account
            </h1>
            <p className="text-sm text-stone-500 mt-1 mb-5">
              View your saved delivery addresses, orders, and profile details.
            </p>
            <button
              type="button"
              onClick={openLoginModal}
              className="bg-[#58111A] hover:bg-[#460D1B] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer"
            >
              Sign In / Register
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-luxury text-2xl font-bold text-stone-900">
                    {user.name || "SilkMode Customer"}
                  </h1>
                  {user.role === "admin" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#58111A]/10 text-[#58111A]">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {user.email || ""} {user.email && user.phone ? "•" : ""}{" "}
                  {user.phone ? `+91 ${user.phone}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 hover:border-[#58111A] hover:text-[#58111A] transition cursor-pointer self-start"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Profile Edit Form */}
            <form
              onSubmit={handleSaveProfile}
              className="bg-white border border-[#E8DEC8] rounded-2xl p-6 shadow-xs space-y-4"
            >
              <h2 className="font-serif-luxury text-lg font-bold text-stone-900">
                Profile Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-base rounded-xl border border-stone-300 focus:outline-none focus:border-[#58111A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Mobile Number (10 digits)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2 text-base rounded-xl border border-stone-300 focus:outline-none focus:border-[#58111A]"
                  />
                </div>
              </div>
              {profileMsg && <p className="text-xs text-[#58111A]">{profileMsg}</p>}
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-[#58111A] hover:bg-[#460D1B] text-white px-5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </form>

            {/* Saved Addresses */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-luxury text-lg font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#58111A]" />
                  <span>Saved Delivery Addresses</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#58111A] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddressForm ? "Cancel" : "Add Address"}</span>
                </button>
              </div>

              {showAddressForm && (
                <form
                  onSubmit={handleAddAddress}
                  className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8DEC8] space-y-3"
                >
                  {addrError && <p className="text-xs text-red-600">{addrError}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Label (Home / Office)"
                      value={addrForm.label}
                      onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })}
                      className="px-3 py-2 text-base rounded-lg border border-stone-300 bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={addrForm.fullName}
                      onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })}
                      className="px-3 py-2 text-base rounded-lg border border-stone-300 bg-white"
                    />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit Phone"
                      value={addrForm.phone}
                      onChange={(e) =>
                        setAddrForm({ ...addrForm, phone: e.target.value.replace(/\D/g, "") })
                      }
                      className="px-3 py-2 text-base rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Address Line 1 (House No, Street, Area)"
                    value={addrForm.line1}
                    onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })}
                    className="w-full px-3 py-2 text-base rounded-lg border border-stone-300 bg-white"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={addrForm.city}
                      onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                      className="px-3 py-2 text-base rounded-lg border border-stone-300 bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={addrForm.state}
                      onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                      className="px-3 py-2 text-base rounded-lg border border-stone-300 bg-white"
                    />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="6-digit Pincode"
                      value={addrForm.pincode}
                      onChange={(e) =>
                        setAddrForm({ ...addrForm, pincode: e.target.value.replace(/\D/g, "") })
                      }
                      className="px-3 py-2 text-base rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={savingAddr}
                    className="bg-[#58111A] hover:bg-[#460D1B] text-white px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    {savingAddr ? "Saving..." : "Save Address"}
                  </button>
                </form>
              )}

              {(user.addresses?.length ?? 0) === 0 ? (
                <p className="text-xs text-stone-500">No saved addresses yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.addresses?.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-xl border border-stone-200 flex justify-between items-start gap-3"
                    >
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-[#58111A]/10 text-[#58111A] text-[10px] font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-stone-800">
                          {addr.fullName} • +91 {addr.phone}
                        </p>
                        <p className="text-stone-600">
                          {addr.line1}
                          {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} -{" "}
                          {addr.pincode}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600"
                        aria-label="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
