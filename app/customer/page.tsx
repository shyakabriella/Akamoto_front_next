"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Wallet, Truck, CheckCircle2, Package, ArrowUpRight } from "lucide-react";

// Greeting helper
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Mock data for delivery status distribution
const deliveryStatusData = [
  { name: "Delivered", value: 45, color: "#10B981" },
  { name: "In Transit", value: 12, color: "#FF9B51" },
  { name: "Pending", value: 8, color: "#F59E0B" },
  { name: "Cancelled", value: 5, color: "#EF4444" },
];

// Mock data for recent activity
const recentActivity = [
  { id: "DEL-001", recipient: "Remera Giporoso", message: "HP EliteBook 840 (Laptop)", status: "DELIVERED" },
  { id: "DEL-002", recipient: "Nyamirambo", message: "iPhone 13 Pro (Phone)", status: "DELIVERED" },
  { id: "DEL-003", recipient: "Kimironko", message: "Corporate Contracts (Document)", status: "DELIVERED" },
  { id: "DEL-004", recipient: "Kanombe", message: "Fragile Electronics", status: "FAILED" },
  { id: "DEL-005", recipient: "Kacyiru", message: "Medical Supplies", status: "IN TRANSIT" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Welcome Message */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
        <p className="text-gray-500 text-sm mt-1">{getGreeting()}, {user?.name?.split(" ")[0] || "Customer"}</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Account Balance */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <button className="bg-[#FF9B51] hover:bg-[#e8883e] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
              Top Up
            </button>
          </div>
          <p className="text-2xl font-bold text-gray-800">0 RWF</p>
          <p className="text-xs text-gray-500 mt-1">Account Balance</p>
        </div>

        {/* Total Messages -> Active Deliveries */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Truck className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">This month</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">12</p>
          <p className="text-xs text-gray-500 mt-1">Active Deliveries</p>
        </div>

        {/* Active Groups -> Completed */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">All time</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">45</p>
          <p className="text-xs text-gray-500 mt-1">Completed</p>
        </div>

        {/* Total Contacts -> Total Spent */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">This month</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">5,000 RWF</p>
          <p className="text-xs text-gray-500 mt-1">Total Spent</p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Status Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deliveryStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/customer/new-delivery"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200"
            >
              <Package className="w-8 h-8 text-[#FF9B51] mb-2" />
              <span className="text-sm font-semibold text-gray-800">New Delivery</span>
            </a>
            <a
              href="/customer/active"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200"
            >
              <Truck className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-semibold text-gray-800">Track Package</span>
            </a>
            <a
              href="/customer/history"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200"
            >
              <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-semibold text-gray-800">History</span>
            </a>
            <a
              href="/customer/settings"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200"
            >
              <Wallet className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-semibold text-gray-800">Settings</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Table */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
          <a
            href="/customer/history"
            className="text-sm text-[#FF9B51] hover:text-[#e8883e] font-semibold flex items-center gap-1 cursor-pointer"
          >
            View All <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Delivery ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Destination</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Package</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{activity.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.recipient}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.message}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        activity.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : activity.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : activity.status === "IN TRANSIT"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {activity.status}
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
