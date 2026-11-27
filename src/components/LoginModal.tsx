"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Phone, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number>
          ) => void;
        };
      };
    };
  }
}

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, refreshUser } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoginModalOpen) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const initGoogle = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response.credential) return;
          setError(null);
          setSubmitting(true);
          try {
            const res = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential: response.credential }),
            });
            const data = (await res.json()) as { ok?: boolean; error?: string };
            if (!res.ok) {
              setError(data.error || "Google Sign-In failed.");
              return;
            }
            await refreshUser();
            closeLoginModal();
          } catch {
            setError("Network error during Google Sign-In.");
          } finally {
            setSubmitting(false);
          }
        },
      });
      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
      });
    };

    if (window.google?.accounts?.id) {
      initGoogle();
      return;
    }

    const existingScript = document.getElementById("google-gsi-script");
    if (existingScript) {
      existingScript.addEventListener("load", initGoogle);
      return () => existingScript.removeEventListener("load", initGoogle);
    }

    const script = document.createElement("script");
    script.id = "google-gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
  }, [isLoginModalOpen, closeLoginModal, refreshUser]);

  if (!isLoginModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok) {
        setError(data.error || "Unable to send OTP.");
        return;
      }
      setOtpSent(true);
      setInfo(data.message || "OTP sent to your mobile number.");
    } catch {
      setError("Network error while sending OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error || "Invalid OTP.");
        return;
      }
      await refreshUser();
      setOtpSent(false);
      setOtp("");
      setPhone("");
      closeLoginModal();
    } catch {
      setError("Network error while verifying OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={closeLoginModal}
      />
      <div className="relative z-10 w-full max-w-md bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl shadow-2xl p-6 sm:p-7">
        <button
          type="button"
          onClick={closeLoginModal}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 text-stone-600 hover:text-stone-900"
          aria-label="Close login modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#58111A] font-semibold">
            SilkMode Fashion
          </p>
          <h2 className="font-serif-luxury text-2xl font-bold text-stone-900 mt-1">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Track orders, save addresses &amp; enjoy faster checkout
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-700">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs text-emerald-700">
            {info}
          </div>
        )}

        {/* Google Sign-In Button */}
        <div className="flex flex-col items-center">
          <div ref={googleBtnRef} className="min-h-[44px] flex items-center justify-center" />
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-[#FDFBF7] px-3 text-stone-400 font-medium">
              Or continue with Mobile OTP
            </span>
          </div>
        </div>

        {/* Mobile OTP Form */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Mobile Number (India)
              </label>
              <div className="flex items-center rounded-xl border border-stone-300 bg-white focus-within:border-[#58111A] overflow-hidden">
                <span className="px-3 py-2.5 text-sm font-medium text-stone-500 bg-stone-50 border-r border-stone-200">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="9876543210"
                  required
                  className="w-full px-3 py-2.5 text-base text-stone-900 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting || phone.length < 10}
              className="w-full flex items-center justify-center gap-2 bg-[#58111A] hover:bg-[#460D1B] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
              <span>Send OTP</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Enter OTP sent to +91 {phone}
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 4-6 digit OTP"
                required
                className="w-full px-3.5 py-2.5 text-base text-stone-900 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#58111A]"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || otp.length < 4}
              className="w-full flex items-center justify-center gap-2 bg-[#58111A] hover:bg-[#460D1B] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>Verify &amp; Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setError(null);
              }}
              className="w-full text-xs text-stone-500 hover:text-[#58111A] py-1"
            >
              Change mobile number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
