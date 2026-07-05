"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Order } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { Search } from "lucide-react";

const FILTERS = ["all", "pending", "searching_rider", "rider_assigned", "in_transit", "delivered", "cancelled", "failed"] as const;

function OrdersContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("id");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      setError("");
      try {
        const data = await api.listOrders({ status: filter === "all" ? undefined : filter, per_page: 100 });
        setOrders(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [filter]);

  const filteredOrders = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.id.toString().toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.pickup_address.toLowerCase().includes(q) ||
        o.dropoff_address.toLowerCase().includes(q)
    );
  }, [orders, search]);

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
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-gray-800">All Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Full audit trail of all orders</p>
      </motion.div>

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {/* Status Summary Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Cancelled", status: "cancelled", color: "bg-red-50 border-red-200 text-red-700", count: orders.filter(o => o.status === "cancelled").length },
          { label: "Delivered", status: "delivered", color: "bg-green-50 border-green-200 text-green-700", count: orders.filter(o => o.status === "delivered").length },
          { label: "Pending", status: "pending", color: "bg-yellow-50 border-yellow-200 text-yellow-700", count: orders.filter(o => o.status === "pending").length },
          { label: "Rider Assigned", status: "rider_assigned", color: "bg-blue-50 border-blue-200 text-blue-700", count: orders.filter(o => o.status === "rider_assigned").length },
        ].map((card) => (
          <button
            key={card.status}
            onClick={() => setFilter(card.status as any)}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${card.color} ${filter === card.status ? "ring-2 ring-offset-1" : ""}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider">{card.label}</p>
            <p className="text-2xl font-black mt-1">{card.count}</p>
          </button>
        ))}
      </motion.div>

      {highlightId && (
        <motion.div variants={fadeUp} className="bg-[#FF9B51]/10 border border-[#FF9B51]/20 rounded-lg px-4 py-3 text-sm text-gray-800">
          Viewing order <strong>{highlightId}</strong>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders, customers, addresses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer capitalize transition-colors ${
                  filter === f
                    ? "bg-[#FF9B51] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {loading ? (
        <PageLoader label="Loading orders..." />
      ) : (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pickup</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dropoff</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer?.name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{order.pickup_address}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{order.dropoff_address}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === "delivered" ? "bg-green-100 text-green-800" :
                          order.status === "cancelled" ? "bg-red-100 text-red-800" :
                          order.status === "in_transit" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.total_price} {order.currency}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading orders..." />}>
      <OrdersContent />
    </Suspense>
  );
}
