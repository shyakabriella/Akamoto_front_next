"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getActiveOrders } from "@/lib/mock-admin-orders";
import OrdersTable from "@/components/admin/OrdersTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Radio, MapPin } from "lucide-react";

export default function AdminActiveDeliveriesPage() {
  const active = getActiveOrders();
  const [selectedId, setSelectedId] = useState(active[0]?.id ?? null);
  const selected = active.find((o) => o.id === selectedId);

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
          <h1 className="text-2xl font-bold text-gray-800">Active Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Orders currently in progress</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
          <Radio className="w-4 h-4 text-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-green-700">{active.length} live now</span>
        </div>
      </motion.div>

      {/* Active Orders Grid */}
      <motion.div variants={fadeUp} className="grid lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-3 space-y-3">
          {active.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <p className="text-sm font-semibold text-gray-400">No active orders right now</p>
            </div>
          ) : (
            active.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setSelectedId(o.id)}
                className={`w-full text-left bg-white rounded-xl border p-4 transition-all cursor-pointer shadow-sm ${
                  selectedId === o.id ? "border-gray-800 ring-2 ring-gray-800/10" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-bold text-gray-800">{o.id}</span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="text-xs text-gray-500">{o.pickup} → {o.dropoff}</p>
                <p className="text-[10px] text-gray-400 mt-1">{o.customerName} · {o.riderName ?? "Finding rider..."}</p>
              </button>
            ))
          )}
        </div>

        {selected && (
          <motion.div variants={fadeUp} className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-44 flex flex-col items-center justify-center gap-2">
              <MapPin className="w-8 h-8 text-[#FF9B51]" />
              <p className="text-sm font-bold text-gray-800">Live map</p>
              <p className="text-[10px] text-gray-400">GPS tracking when order API connects</p>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Customer</p>
                <p className="text-sm font-bold text-gray-800">{selected.customerName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Rider</p>
                <p className="text-sm font-semibold text-gray-800">{selected.riderName ?? "Unassigned"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Route</p>
                <p className="text-xs text-gray-600">{selected.pickup} → {selected.dropoff}</p>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">Price</span>
                <span className="text-sm font-bold text-[#FF9B51]">{selected.price.toLocaleString()} RWF</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

    </motion.div>
  );
}
