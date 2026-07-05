"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Order } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import SectionHeader from "@/components/customer/SectionHeader";
import { History, Search, MapPin, Package, ArrowRight } from "lucide-react";

const statusFilters = ["All", "Delivered", "Cancelled", "Failed"];

export default function HistoryPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      setError("");
      try {
        const data = await api.getCustomerOrders({ per_page: 100 });
        setOrders(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filtered = orders.filter((order) => {
    const matchesFilter = filter === "All" || 
      (filter === "Delivered" && order.status === "delivered") ||
      (filter === "Cancelled" && order.status === "cancelled") ||
      (filter === "Failed" && order.status === "failed");
    const matchesSearch = 
      order.item_description?.toLowerCase().includes(search.toLowerCase()) ||
      order.pickup_address.toLowerCase().includes(search.toLowerCase()) ||
      order.dropoff_address.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">
      <SectionHeader
        title="Delivery History"
        description="All your past delivery requests."
        actionLabel="New Delivery"
        actionHref="/customer/new-delivery"
      />

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by package or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#25343F] outline-none focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] bg-white transition-all"
          />
        </div>
        <div className="flex gap-2">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                filter === f
                  ? "bg-[#25343F] border-[#25343F] text-white"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <PageLoader label="Loading delivery history..." />
      ) : filtered.length > 0 ? (
        <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map((order) => (
              <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "delivered" ? "bg-green-100 text-green-800" :
                        order.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status.replace(/_/g, " ").toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-500">#{order.id}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#25343F] mb-1">{order.item_description || "Package"}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{order.pickup_address}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{order.dropoff_address}</span>
                    </div>
                    <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#FF9B51]">{order.total_price} {order.currency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No deliveries found</h3>
          <p className="text-sm text-slate-500">No deliveries match your current filters. Try changing your search or filter.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
