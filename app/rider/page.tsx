"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

function RiderDashboardContent() {
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch initial profile to check online status if backend supports it
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await api.getProfile();
        // Assume backend profile returns rider status details
        // If not, default to offline
      } catch (err) {
        console.error("Could not fetch profile for online status state", err);
      }
    }
    checkStatus();
  }, []);

  const handleToggleOnline = async () => {
    setIsToggling(true);
    setError("");
    setStatusMessage("");
    try {
      if (isOnline) {
        const res = await api.goOffline();
        setIsOnline(false);
        setStatusMessage("You are now offline. You won't receive delivery requests.");
      } else {
        const res = await api.goOnline();
        setIsOnline(true);
        setStatusMessage("You are online! Waiting for nearby delivery requests...");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update status. Please make sure your profile is approved.");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#EAEFEF] sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold text-xl text-[#25343F]">
              Akamoto
            </Link>
            <span className="bg-[#brand-orange] bg-slate-800 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Rider
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
          className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#25343F] tracking-tight">Rider Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your online status and deliver packages.</p>
          </div>

          {/* Online/Offline Toggle */}
          <div className="flex items-center gap-3 bg-white p-3 px-5 rounded-2xl shadow-sm border border-slate-100 self-start">
            <span className={`w-3.5 h-3.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
            <span className="text-sm font-bold text-[#25343F]">
              Status: {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
            <button
              onClick={handleToggleOnline}
              disabled={isToggling}
              className={`ml-4 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition-all ${
                isOnline
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {isToggling ? "Updating..." : isOnline ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </motion.div>

        {statusMessage && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-4 rounded-2xl text-sm mb-6 font-medium">
            {statusMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-2xl text-sm mb-6 font-medium">
            {error}
          </div>
        )}

        {/* Dashboard Widgets */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Active Job card */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between h-48">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#FF9B51]/10 flex items-center justify-center text-[#FF9B51] mb-4">
                📍
              </div>
              <h2 className="text-lg font-bold text-[#25343F]">Active Delivery Task</h2>
              <p className="text-xs text-slate-500 mt-1">Your current matched pickup details will show up here.</p>
            </div>
            <div className="text-xs text-slate-400 font-semibold mt-4">No active delivery matched</div>
          </div>

          {/* Rider Stats card */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between h-48">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#EAEFEF] flex items-center justify-center text-[#25343F] mb-4">
                📈
              </div>
              <h2 className="text-lg font-bold text-[#25343F]">Your Daily Earnings</h2>
              <p className="text-xs text-slate-500 mt-1">Total completed trips and earnings for today.</p>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold mt-4">
              <span className="text-slate-400">0 Trips</span>
              <span className="text-[#FF9B51] font-black text-lg">0 RWF</span>
            </div>
          </div>
        </div>

        {/* Available Orders Section */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
          <h2 className="text-lg font-bold text-[#25343F] mb-4">Pending Deliveries in Your Area</h2>
          <div className="border border-slate-100 rounded-2xl p-8 text-center text-xs text-slate-400 font-medium">
            {isOnline
              ? "Scanning for requests... Keep this page open to receive matches."
              : "Go online to start receiving delivery job offers."}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function RiderDashboard() {
  return (
    <AuthGuard allowedRoles={["rider"]}>
      <RiderDashboardContent />
    </AuthGuard>
  );
}
