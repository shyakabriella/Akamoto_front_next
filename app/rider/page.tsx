"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { api } from "@/lib/api";
import { RiderProfile } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import StatusBadge from "@/components/ui/StatusBadge";
import { AlertCircle, ArrowRight, Package, TrendingUp, DollarSign, Truck, Star, Wifi } from "lucide-react";

// Mock data for weekly earnings
const weeklyEarningsData = [
  { day: "Mon", earnings: 4500 },
  { day: "Tue", earnings: 6200 },
  { day: "Wed", earnings: 3800 },
  { day: "Thu", earnings: 7500 },
  { day: "Fri", earnings: 8900 },
  { day: "Sat", earnings: 12000 },
  { day: "Sun", earnings: 5400 },
];

// Mock data for recent deliveries
const recentDeliveries = [
  { id: "DEL-001", pickup: "Nyabugogo", dropoff: "Remera", status: "DELIVERED", amount: 2400 },
  { id: "DEL-002", pickup: "Kigali Heights", dropoff: "Nyamirambo", status: "DELIVERED", amount: 3200 },
  { id: "DEL-003", pickup: "Kacyiru", dropoff: "Kimironko", status: "DELIVERED", amount: 1800 },
  { id: "DEL-004", pickup: "Downtown", dropoff: "Kanombe", status: "CANCELLED", amount: 0 },
  { id: "DEL-005", pickup: "Gisozi", dropoff: "Kicukiro", status: "IN TRANSIT", amount: 2000 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function RiderDashboardPage() {
  const [profile, setProfile] = useState<RiderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getRiderProfile();
        setProfile(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load rider profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <PageLoader label="Loading rider dashboard..." />;

  const needsProfile = !profile;
  const isPending = profile?.status === "pending";
  const isRejected = profile?.status === "rejected";
  const isApproved = profile?.status === "approved";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Welcome Message */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your deliveries and earnings</p>
      </motion.div>

      {error && <ErrorBanner message={error} />}

      {/* KPI Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Delivered Orders */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">All time</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{profile?.total_orders || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Delivered Orders</p>
        </div>

        {/* Pending Deliveries */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Truck className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">0</p>
          <p className="text-xs text-gray-500 mt-1">Pending Deliveries</p>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">All time</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{profile?.total_earnings ? `${profile.total_earnings.toLocaleString()} RWF` : "0 RWF"}</p>
          <p className="text-xs text-gray-500 mt-1">Total Paid</p>
        </div>

        {/* Commission */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Avg</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">20%</p>
          <p className="text-xs text-gray-500 mt-1">Commission Rate</p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Earnings Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Weekly Earnings</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyEarningsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="earnings" fill="#FF9B51" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Online Status Toggle */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Online Status</h2>
          <div className="flex flex-col items-center justify-center h-64">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${profile?.is_online ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Wifi className={`w-12 h-12 ${profile?.is_online ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <p className={`text-lg font-bold ${profile?.is_online ? 'text-green-600' : 'text-gray-500'}`}>
              {profile?.is_online ? 'Online' : 'Offline'}
            </p>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {profile?.is_online 
                ? 'You are receiving delivery requests' 
                : 'Go online to start receiving requests'}
            </p>
            <Link
              href="/rider/status"
              className="mt-4 bg-[#FF9B51] hover:bg-[#e8883e] text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {profile?.is_online ? 'Go Offline' : 'Go Online'}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Table */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Recent Deliveries</h2>
          <Link
            href="/rider/status"
            className="text-sm text-[#FF9B51] hover:text-[#e8883e] font-semibold flex items-center gap-1 cursor-pointer"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Delivery ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Pickup</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Dropoff</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{delivery.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{delivery.pickup}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{delivery.dropoff}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{delivery.amount.toLocaleString()} RWF</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        delivery.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : delivery.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : delivery.status === "IN TRANSIT"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.div>
  );
}
