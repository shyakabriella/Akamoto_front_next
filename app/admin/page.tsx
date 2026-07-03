"use client";

import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";

function AdminDashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#EAEFEF] sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold text-xl text-[#25343F]">
              Akamoto
            </Link>
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Administrator
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-[#25343F]">{user?.name}</span>
              <span className="text-xs text-slate-400">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="text-xs font-semibold border border-slate-200 hover:border-[#25343F] hover:bg-slate-50 transition-colors text-slate-600 px-4 py-2 rounded-xl cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#25343F] tracking-tight">Admin Operations Control</h1>
          <p className="text-slate-500 text-sm mt-1">Oversee riders, manage tariff configurations, and monitor delivery quotes.</p>
        </motion.div>

        {/* Dashboard Widgets */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          {/* Card: Total Riders */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between h-36">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Riders</span>
              <div className="text-2xl font-black text-[#25343F] mt-2">12</div>
            </div>
            <span className="text-xs text-emerald-500 font-semibold">4 Online now</span>
          </div>

          {/* Card: Pending Riders */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between h-36">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Riders</span>
              <div className="text-2xl font-black text-[#FF9B51] mt-2">3</div>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Awaiting approval</span>
          </div>

          {/* Card: Total Deliveries */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between h-36">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Orders</span>
              <div className="text-2xl font-black text-[#25343F] mt-2">142</div>
            </div>
            <span className="text-xs text-[#FF9B51] font-semibold">9 Today</span>
          </div>

          {/* Card: Commission Earnings */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between h-36">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Accumulated Fees</span>
              <div className="text-2xl font-black text-emerald-600 mt-2">48,500 RWF</div>
            </div>
            <span className="text-xs text-slate-400 font-semibold">20% commission tier</span>
          </div>
        </div>

        {/* Administration Sections */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Section: Rider Approvals */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
            <h2 className="text-lg font-bold text-[#25343F] mb-4">Pending Approvals</h2>
            <div className="border border-slate-100 rounded-2xl p-6 text-center text-xs text-slate-400 font-medium">
              No rider registration documents currently pending verification.
            </div>
          </div>

          {/* Section: Active Pricing Rules */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
            <h2 className="text-lg font-bold text-[#25343F] mb-4">Pricing Rules & Tariffs</h2>
            <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
              <div className="bg-slate-50 p-3 font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100 flex justify-between">
                <span>Vehicle Type</span>
                <span>Base Price (3km)</span>
                <span>Extra per KM</span>
              </div>
              <div className="p-3.5 border-b border-slate-100 flex justify-between text-[#25343F] font-semibold">
                <span>Moto</span>
                <span>1,000 RWF</span>
                <span>200 RWF</span>
              </div>
              <div className="p-3.5 border-b border-slate-100 flex justify-between text-[#25343F] font-semibold">
                <span>Bicycle</span>
                <span>600 RWF</span>
                <span>100 RWF</span>
              </div>
              <div className="p-3.5 flex justify-between text-[#25343F] font-semibold">
                <span>Car / Van</span>
                <span>3,000 RWF</span>
                <span>500 RWF</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminDashboardContent />
    </AuthGuard>
  );
}
