"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { fetchPricingRules, fetchRiders } from "@/lib/admin-data";
import {
  MOCK_ADMIN_CLIENTS,
  MOCK_ADMIN_ORDERS,
  MOCK_DISPUTES,
  MOCK_EMERGENCIES,
  getActiveOrders,
} from "@/lib/mock-admin-orders";
import { PricingRule, RiderProfile } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Users,
  Clock,
  Package,
  UserCircle,
  AlertTriangle,
  PhoneCall,
  Truck,
  DollarSign,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [riders, setRiders] = useState<RiderProfile[]>([]);
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [riderList, ruleList] = await Promise.all([fetchRiders(), fetchPricingRules()]);
        setRiders(riderList);
        setRules(ruleList);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <PageLoader label="Loading admin dashboard..." />;

  const pendingRiders = riders.filter((r) => r.status === "pending");
  const activeDeliveries = getActiveOrders();
  const openDisputes = MOCK_DISPUTES.filter((d) => d.status !== "resolved");
  const activeEmergencies = MOCK_EMERGENCIES.filter((e) => !e.resolved);
  const failedOrders = MOCK_ADMIN_ORDERS.filter((o) => o.status === "failed");
  const onlineRiders = riders.filter((r) => r.status === "approved" && r.is_online).length;

  // Mock data for hourly order volume (today)
  const hourlyOrderData = [
    { hour: "6AM", orders: 12 },
    { hour: "8AM", orders: 45 },
    { hour: "10AM", orders: 78 },
    { hour: "12PM", orders: 92 },
    { hour: "2PM", orders: 85 },
    { hour: "4PM", orders: 67 },
    { hour: "6PM", orders: 54 },
    { hour: "8PM", orders: 38 },
  ];

  // Mock data for delivery status breakdown
  const deliveryStatusData = [
    { name: "Active", value: activeDeliveries.length, color: "#FF9B51" },
    { name: "Pending", value: MOCK_ADMIN_ORDERS.filter((o) => o.status === "pending").length, color: "#F59E0B" },
    { name: "Completed", value: MOCK_ADMIN_ORDERS.filter((o) => o.status === "delivered").length, color: "#10B981" },
    { name: "Failed", value: failedOrders.length, color: "#EF4444" },
  ];

  // Mock data for live activity feed
  const liveActivity = [
    { id: 1, type: "order", message: "New order #ORD-4321 placed by John Doe", time: "2 min ago", icon: Package, color: "text-blue-600" },
    { id: 2, type: "delivery", message: "Order #ORD-4320 delivered by Eric Manzi", time: "5 min ago", icon: CheckCircle, color: "text-green-600" },
    { id: 3, type: "rider", message: "New rider registration: Jean Mugabo", time: "12 min ago", icon: Users, color: "text-purple-600" },
    { id: 4, type: "dispute", message: "Dispute opened for order #ORD-4319", time: "18 min ago", icon: AlertTriangle, color: "text-red-600" },
    { id: 5, type: "payment", message: "Payment received: 2,400 RWF", time: "25 min ago", icon: DollarSign, color: "text-green-600" },
  ];

  // Mock data for recent orders with enhanced columns
  const recentOrders = [
    { id: "ORD-4321", time: "14:32", rider: "Eric Manzi", customer: "John Doe", distance: "3.2 km", duration: "12 min", amount: 2400, status: "IN TRANSIT" },
    { id: "ORD-4320", time: "14:15", rider: "Jean Mugabo", customer: "Sarah Smith", distance: "5.1 km", duration: "18 min", amount: 3200, status: "DELIVERED" },
    { id: "ORD-4319", time: "13:58", rider: "Paul Niyonzima", customer: "Mike Johnson", distance: "2.8 km", duration: "10 min", amount: 1800, status: "DISPUTED" },
    { id: "ORD-4318", time: "13:42", rider: "Eric Manzi", customer: "Emily Davis", distance: "4.5 km", duration: "15 min", amount: 2000, status: "FAILED" },
    { id: "ORD-4317", time: "13:25", rider: "Jean Mugabo", customer: "Chris Wilson", distance: "6.3 km", duration: "22 min", amount: 2800, status: "DELIVERED" },
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {/* KPI Cards Row - 5 cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Delivered Orders */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{MOCK_ADMIN_ORDERS.filter((o) => o.status === "delivered").length}</p>
          <p className="text-xs text-gray-500 mt-1">Delivered Orders</p>
        </div>

        {/* Pending Deliveries */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{MOCK_ADMIN_ORDERS.filter((o) => o.status === "requested" || o.status === "accepted").length}</p>
          <p className="text-xs text-gray-500 mt-1">Pending Deliveries</p>
        </div>

        {/* Total Paid */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">45,000 RWF</p>
          <p className="text-xs text-gray-500 mt-1">Total Paid</p>
        </div>

        {/* Commission */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">9,000 RWF</p>
          <p className="text-xs text-gray-500 mt-1">Commission</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-teal-600" />
            </div>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">54,000 RWF</p>
          <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
        </div>
      </motion.div>

      {/* View Full Analytics CTA */}
      <motion.div variants={fadeUp}>
        <Link
          href="/admin/analytics"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer text-sm font-semibold text-gray-700"
        >
          <TrendingUp className="w-4 h-4" />
          View Full Analytics
        </Link>
      </motion.div>

      {/* Charts Row - 2 meaningful charts */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Order Volume */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Hourly Order Volume</h2>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyOrderData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="orders" stroke="#FF9B51" strokeWidth={2} dot={{ fill: '#FF9B51' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Order Status Breakdown</h2>
            <span className="text-xs text-gray-500">All orders today</span>
          </div>
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
      </motion.div>

      {/* Two-Column Section: Needs Attention + Live Activity */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Attention */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Needs Attention</h2>
            <p className="text-xs text-gray-500 mt-1">Action items requiring immediate response</p>
          </div>
          <div className="p-6 space-y-3">
            {/* Pending Riders */}
            {pendingRiders.length > 0 && (
              <Link href="/admin/riders?status=pending" className="flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Pending Rider Approvals</p>
                    <p className="text-xs text-gray-500">{pendingRiders.length} riders awaiting approval</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-orange-600" />
              </Link>
            )}

            {/* Open Disputes */}
            {openDisputes.length > 0 && (
              <Link href="/admin/disputes" className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Open Disputes</p>
                    <p className="text-xs text-gray-500">{openDisputes.length} disputes need resolution</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-red-600" />
              </Link>
            )}

            {/* Failed Deliveries */}
            {failedOrders.length > 0 && (
              <Link href="/admin/orders?status=failed" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Failed Deliveries</p>
                    <p className="text-xs text-gray-500">{failedOrders.length} orders failed today</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </Link>
            )}

            {/* No items */}
            {pendingRiders.length === 0 && openDisputes.length === 0 && failedOrders.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">All clear</p>
                <p className="text-xs text-gray-500">No items need attention</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Live Activity</h2>
              <p className="text-xs text-gray-500 mt-1">Real-time platform events</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
          <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
            {liveActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Recent Orders Table */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-[#FF9B51] hover:text-[#e8883e] font-semibold flex items-center gap-1 cursor-pointer"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Order ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Time</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Rider</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Distance</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Duration</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.time}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.rider}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.distance}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.duration}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.amount.toLocaleString()} RWF</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : order.status === "IN TRANSIT"
                          ? "bg-orange-100 text-orange-700"
                          : order.status === "DISPUTED"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
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
