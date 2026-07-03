"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { GeneratedCredentials } from "@/lib/api";

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<"customer" | "rider">("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Holds generated credentials from response
  const [credentials, setCredentials] = useState<GeneratedCredentials | null>(null);

  useEffect(() => {
    const initialRole = searchParams.get("role");
    if (initialRole === "rider") {
      setRole("rider");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const data = await register(fullName, email, phone, role);
      if (data && data.generated_credentials) {
        setCredentials(data.generated_credentials);
      } else {
        setError("Registration succeeded but no credentials were returned.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Render Credentials success screen
  if (credentials) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center text-2xl mb-4">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-[#25343F] tracking-tight">Account Created!</h2>
          <p className="text-slate-500 mt-2 text-sm">
            For security, Akamoto has generated credentials for your new account.
          </p>
        </div>

        <div className="bg-[#EAEFEF]/30 border border-[#BFC9D1]/30 rounded-2xl p-5 space-y-4 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#25343F]/50">
            Your login details:
          </p>

          {/* Phone Detail */}
          <div>
            <label className="block text-[10px] font-bold text-[#25343F]/60 uppercase mb-1">
              Registered Phone
            </label>
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-sm">
              <span className="font-mono text-[#25343F] font-medium">+{credentials.phone}</span>
              <button
                type="button"
                onClick={() => handleCopy("+" + credentials.phone, "phone")}
                className="text-xs text-[#FF9B51] hover:text-[#25343F] font-semibold cursor-pointer"
              >
                {copiedField === "phone" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Username Detail */}
          <div>
            <label className="block text-[10px] font-bold text-[#25343F]/60 uppercase mb-1">
              Generated Username
            </label>
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-sm">
              <span className="font-mono text-[#25343F] font-medium">{credentials.username}</span>
              <button
                type="button"
                onClick={() => handleCopy(credentials.username, "username")}
                className="text-xs text-[#FF9B51] hover:text-[#25343F] font-semibold cursor-pointer"
              >
                {copiedField === "username" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Generated Password Detail */}
          <div>
            <label className="block text-[10px] font-bold text-[#25343F]/60 uppercase mb-1">
              Generated Password
            </label>
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#FF9B51] bg-[#FF9B51]/5 text-sm">
              <span className="font-mono font-bold text-[#25343F] select-all tracking-wider text-base">
                {credentials.password}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(credentials.password, "password")}
                className="text-xs text-[#FF9B51] hover:text-[#25343F] font-bold cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-[#FF9B51]/30 shadow-sm"
              >
                {copiedField === "password" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#FF9B51]/10 border border-[#FF9B51]/20 rounded-2xl p-4 mb-6 text-xs text-[#25343F]/80 flex gap-2">
          <span className="text-[#FF9B51] font-bold text-base leading-none">⚠️</span>
          <span>
            Please copy and save the password now. You will need it to sign in to your dashboard.
          </span>
        </div>

        <button
          onClick={() => router.push("/login")}
          className="w-full bg-[#25343F] hover:bg-[#1a252d] text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          Proceed to Sign In
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100"
    >
      {/* Logo on mobile only */}
      <div className="lg:hidden mb-8">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#25343F]">
          Akamoto
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#25343F] tracking-tight">Create your account</h2>
        <p className="text-slate-500 mt-2 text-sm">Let&apos;s get you started.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#25343F] mb-2 uppercase tracking-wide">
            Who are you?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`py-3 px-4 rounded-xl border text-center font-medium text-xs transition-all cursor-pointer ${
                role === "customer"
                  ? "border-[#FF9B51] bg-[#FF9B51]/5 text-[#FF9B51] font-semibold"
                  : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
              }`}
            >
              I want to send deliveries
            </button>
            <button
              type="button"
              onClick={() => setRole("rider")}
              className={`py-3 px-4 rounded-xl border text-center font-medium text-xs transition-all cursor-pointer ${
                role === "rider"
                  ? "border-[#FF9B51] bg-[#FF9B51]/5 text-[#FF9B51] font-semibold"
                  : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
              }`}
            >
              I want to become a rider
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[#25343F] mb-1.5 uppercase tracking-wide">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Aline Uwase"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none transition-all duration-150 bg-slate-50 focus:bg-white text-sm text-[#25343F] shadow-sm focus:-translate-y-[1px]"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#25343F] mb-1.5 uppercase tracking-wide">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aline@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none transition-all duration-150 bg-slate-50 focus:bg-white text-sm text-[#25343F] shadow-sm focus:-translate-y-[1px]"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-[#25343F] mb-1.5 uppercase tracking-wide">
            Phone Number
          </label>
          <div className="flex w-full rounded-xl border border-slate-200 bg-slate-50 focus-within:border-[#FF9B51] focus-within:ring-1 focus-within:ring-[#FF9B51] focus-within:bg-white shadow-sm transition-all duration-150 focus-within:-translate-y-[1px] overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100/50 border-r border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600 select-none">
              +250
            </div>
            <input
              type="tel"
              required
              maxLength={9}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="788 000 000"
              className="w-full px-3 py-2.5 outline-none bg-transparent text-sm text-[#25343F]"
            />
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 text-[11px] text-[#25343F]/60 flex gap-2">
          <span>ℹ️</span>
          <span>
            Akamoto will auto-generate your username and secure password, which will be shown on the next screen.
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#25343F] hover:bg-[#1a252d] text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-150 shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Navigation link */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#FF9B51] hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      {/* Bottom Trust info */}
      <div className="mt-6 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Secure account</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Your information is encrypted</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 font-sans">
      {/* Left Side (Brand Panel) */}
      <div className="hidden lg:flex flex-col justify-between bg-[#25343F] p-12 text-white relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FF9B51]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#BFC9D1]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Wordmark */}
        <div className="relative">
          <Link href="/" className="font-bold text-xl tracking-tight text-white">
            Akamoto
          </Link>
        </div>

        {/* Center Illustration and text */}
        <div className="relative my-auto max-w-md">
          <span className="text-[#FF9B51] font-semibold text-sm uppercase tracking-wider mb-2 block">
            Join Akamoto
          </span>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Fast, reliable local city deliveries
          </h1>
          <p className="text-white/60 mb-8 leading-relaxed text-sm">
            Whether you are sending packages or becoming a rider, you are only a few steps away.
          </p>
        </div>

        {/* Bottom Trust Cards */}
        <div className="relative grid grid-cols-3 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className="text-xs font-semibold text-white">Live tracking</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className="text-xs font-semibold text-white">Trusted riders</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className="text-xs font-semibold text-white">Fast delivery</p>
          </div>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <Suspense
          fallback={
            <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-[#FF9B51]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
