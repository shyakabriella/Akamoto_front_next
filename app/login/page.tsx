"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const loggedUser = await login(phone, password);
      // Success! Dynamic role-based redirection
      if (loggedUser && loggedUser.role) {
        router.push(`/${loggedUser.role}`);
      } else {
        setError("Login succeeded but user role is undefined.");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || "Invalid phone number or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            Welcome back
          </span>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Manage your local city deliveries
          </h1>
          <p className="text-white/60 mb-8 leading-relaxed text-sm">
            Continue managing your active deliveries or pick up your next delivery request.
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
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 md:p-20">
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

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#25343F] tracking-tight">Welcome back</h2>
            <p className="text-slate-500 mt-2 text-sm">Sign in to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-[#25343F] mb-2 uppercase tracking-wide">
                Phone Number
              </label>
              <div className="flex w-full rounded-xl border border-slate-200 bg-slate-50 focus-within:border-[#FF9B51] focus-within:ring-1 focus-within:ring-[#FF9B51] focus-within:bg-white shadow-sm transition-all duration-150 focus-within:-translate-y-[1px] overflow-hidden">
                <div className="px-4 py-3 bg-slate-100/50 border-r border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600 select-none">
                  +250
                </div>
                <input
                  type="tel"
                  required
                  maxLength={9}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="788 000 000"
                  className="w-full px-3 py-3 outline-none bg-transparent text-sm text-[#25343F]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#25343F] uppercase tracking-wide">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#FF9B51] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none transition-all duration-150 bg-slate-50 focus:bg-white text-sm text-[#25343F] shadow-sm pr-10 focus:-translate-y-[1px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.024 10.024 0 014.162-5.382m4.24-1.082A10.025 10.025 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-7-9a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Navigation link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-[#FF9B51] hover:underline">
                Create one
              </Link>
            </p>
          </div>

          {/* Bottom Trust info */}
          <div className="mt-8 space-y-2">
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
      </div>
    </div>
  );
}
