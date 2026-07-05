"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Filter, Download, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const [dateFilter, setDateFilter] = useState("last30days");
  const [showFilters, setShowFilters] = useState(false);

  // Realistic order data by day
  const dailyOrders = [
    { date: "Jul 1", orders: 142, revenue: 325000, completed: 135, failed: 5, cancelled: 2 },
    { date: "Jul 2", orders: 158, revenue: 362000, completed: 150, failed: 6, cancelled: 2 },
    { date: "Jul 3", orders: 165, revenue: 378000, completed: 158, failed: 4, cancelled: 3 },
    { date: "Jul 4", orders: 152, revenue: 348000, completed: 145, failed: 5, cancelled: 2 },
    { date: "Jul 5", orders: 178, revenue: 408000, completed: 170, failed: 5, cancelled: 3 },
    { date: "Jul 6", orders: 195, revenue: 447000, completed: 186, failed: 6, cancelled: 3 },
    { date: "Jul 7", orders: 210, revenue: 482000, completed: 200, failed: 7, cancelled: 3 },
    { date: "Jul 8", orders: 188, revenue: 431000, completed: 179, failed: 6, cancelled: 3 },
    { date: "Jul 9", orders: 175, revenue: 401000, completed: 167, failed: 5, cancelled: 3 },
    { date: "Jul 10", orders: 162, revenue: 372000, completed: 154, failed: 5, cancelled: 3 },
    { date: "Jul 11", orders: 148, revenue: 340000, completed: 141, failed: 4, cancelled: 3 },
    { date: "Jul 12", orders: 155, revenue: 356000, completed: 148, failed: 4, cancelled: 3 },
    { date: "Jul 13", orders: 168, revenue: 385000, completed: 160, failed: 5, cancelled: 3 },
    { date: "Jul 14", orders: 182, revenue: 418000, completed: 173, failed: 6, cancelled: 3 },
  ];

  // Hourly order distribution
  const hourlyOrders = [
    { hour: "6AM", orders: 12 },
    { hour: "7AM", orders: 28 },
    { hour: "8AM", orders: 45 },
    { hour: "9AM", orders: 62 },
    { hour: "10AM", orders: 78 },
    { hour: "11AM", orders: 85 },
    { hour: "12PM", orders: 92 },
    { hour: "1PM", orders: 88 },
    { hour: "2PM", orders: 82 },
    { hour: "3PM", orders: 75 },
    { hour: "4PM", orders: 68 },
    { hour: "5PM", orders: 58 },
    { hour: "6PM", orders: 48 },
    { hour: "7PM", orders: 38 },
    { hour: "8PM", orders: 25 },
    { hour: "9PM", orders: 15 },
  ];

  // Revenue breakdown
  const revenueData = [
    { date: "Jul 1", revenue: 325000, commission: 48750, payouts: 276250 },
    { date: "Jul 2", revenue: 362000, commission: 54300, payouts: 307700 },
    { date: "Jul 3", revenue: 378000, commission: 56700, payouts: 321300 },
    { date: "Jul 4", revenue: 348000, commission: 52200, payouts: 295800 },
    { date: "Jul 5", revenue: 408000, commission: 61200, payouts: 346800 },
    { date: "Jul 6", revenue: 447000, commission: 67050, payouts: 379950 },
    { date: "Jul 7", revenue: 482000, commission: 72300, payouts: 409700 },
    { date: "Jul 8", revenue: 431000, commission: 64650, payouts: 366350 },
    { date: "Jul 9", revenue: 401000, commission: 60150, payouts: 340850 },
    { date: "Jul 10", revenue: 372000, commission: 55800, payouts: 316200 },
    { date: "Jul 11", revenue: 340000, commission: 51000, payouts: 289000 },
    { date: "Jul 12", revenue: 356000, commission: 53400, payouts: 302600 },
    { date: "Jul 13", revenue: 385000, commission: 57750, payouts: 327250 },
    { date: "Jul 14", revenue: 418000, commission: 62700, payouts: 355300 },
  ];

  // Rider performance data
  const riderPerformance = [
    { name: "Eric Manzi", orders: 245, rating: 4.8, avgTime: 16, earnings: 890000, acceptance: 94 },
    { name: "Jean Mugabo", orders: 231, rating: 4.7, avgTime: 17, earnings: 845000, acceptance: 91 },
    { name: "Paul Niyonzima", orders: 198, rating: 4.6, avgTime: 18, earnings: 720000, acceptance: 89 },
    { name: "Claude Bizimungu", orders: 187, rating: 4.6, avgTime: 19, earnings: 680000, acceptance: 87 },
    { name: "Emmanuel Habimana", orders: 175, rating: 4.5, avgTime: 20, earnings: 635000, acceptance: 85 },
    { name: "Theoneste Nsengiyumva", orders: 162, rating: 4.5, avgTime: 21, earnings: 590000, acceptance: 83 },
    { name: "Patrick Ndayisaba", orders: 148, rating: 4.4, avgTime: 22, earnings: 540000, acceptance: 81 },
    { name: "Jean Claude Kamanzi", orders: 135, rating: 4.4, avgTime: 23, earnings: 490000, acceptance: 79 },
  ];

  // Geographic data
  const locationData = [
    { district: "Gasabo", sector: "Kacyiru", orders: 452, revenue: 1038000, avgOrder: 2296 },
    { district: "Gasabo", sector: "Remera", orders: 387, revenue: 889000, avgOrder: 2297 },
    { district: "Nyarugenge", sector: "Nyamirambo", orders: 342, revenue: 785000, avgOrder: 2295 },
    { district: "Nyarugenge", sector: "Centre", orders: 298, revenue: 684000, avgOrder: 2295 },
    { district: "Kicukiro", sector: "Gikondo", orders: 276, revenue: 634000, avgOrder: 2297 },
    { district: "Kicukiro", sector: "Kanombe", orders: 234, revenue: 537000, avgOrder: 2295 },
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Page Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Platform performance metrics and business intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Date Range</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "This Year", "Custom Range"].map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter.toLowerCase().replace(" ", ""))}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  dateFilter === filter.toLowerCase().replace(" ", "")
                    ? "bg-[#FF9B51] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <h3 className="text-sm font-bold text-gray-800 mb-4">Additional Filters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9B51]">
              <option>All Riders</option>
              <option>Eric Manzi</option>
              <option>Jean Mugabo</option>
            </select>
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9B51]">
              <option>All Districts</option>
              <option>Gasabo</option>
              <option>Nyarugenge</option>
              <option>Kicukiro</option>
            </select>
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9B51]">
              <option>All Statuses</option>
              <option>Completed</option>
              <option>Failed</option>
              <option>Cancelled</option>
            </select>
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9B51]">
              <option>All Payment Methods</option>
              <option>Mobile Money</option>
              <option>Cash</option>
              <option>Card</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Key Metrics Summary */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-gray-800">2,288</p>
          <p className="text-xs text-green-600 mt-1">+12.5% vs previous period</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-800">5.25M RWF</p>
          <p className="text-xs text-green-600 mt-1">+15.2% vs previous period</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Completion Rate</p>
          <p className="text-3xl font-bold text-gray-800">95.8%</p>
          <p className="text-xs text-green-600 mt-1">+1.2% vs previous period</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Avg Order Value</p>
          <p className="text-3xl font-bold text-gray-800">2,295 RWF</p>
          <p className="text-xs text-green-600 mt-1">+2.4% vs previous period</p>
        </div>
      </motion.div>

      {/* Daily Orders & Revenue Chart */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Daily Orders & Revenue</h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-4 h-4" />
            Last 14 days
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyOrders}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
                formatter={(value, name) => {
                  const label = String(name ?? "");
                  const numericValue =
                    typeof value === "number" ? value : Number(value ?? 0);

                  if (label === "revenue") {
                    return [`${numericValue.toLocaleString()} RWF`, "Revenue"];
                  }

                  return [String(value ?? ""), label];
                }}
              />
              <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#FF9B51" strokeWidth={2} dot={{ fill: '#FF9B51' }} name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Hourly Order Distribution */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Hourly Order Distribution</h2>
          <span className="text-xs text-gray-500">Average daily pattern</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyOrders}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="orders" fill="#FF9B51" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Revenue Breakdown */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Revenue Breakdown</h2>
          <span className="text-xs text-gray-500">Platform commission vs rider payouts</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
                formatter={(value, name) => {
                  const label = String(name ?? "");
                  const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                  return [`${numericValue.toLocaleString()} RWF`, label];
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} name="Total Revenue" />
              <Line type="monotone" dataKey="commission" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} name="Commission" />
              <Line type="monotone" dataKey="payouts" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} name="Rider Payouts" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Rider Performance Table */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Rider Performance</h2>
          <p className="text-xs text-gray-500 mt-1">Top 8 riders by orders completed</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Rider</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Orders</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Rating</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Avg Time</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Earnings</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Acceptance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {riderPerformance.map((rider, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{rider.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{rider.orders}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{rider.rating}/5</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{rider.avgTime} min</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{rider.earnings.toLocaleString()} RWF</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold ${rider.acceptance >= 90 ? 'text-green-600' : rider.acceptance >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {rider.acceptance}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Geographic Distribution Table */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Geographic Distribution</h2>
          <p className="text-xs text-gray-500 mt-1">Orders by district and sector</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">District</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Sector</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Orders</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Revenue</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Avg Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {locationData.map((loc, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{loc.district}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{loc.sector}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{loc.orders}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{loc.revenue.toLocaleString()} RWF</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{loc.avgOrder.toLocaleString()} RWF</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.div>
  );
}
