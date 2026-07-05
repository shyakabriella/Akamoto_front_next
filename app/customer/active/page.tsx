"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Order } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import SectionHeader from "@/components/customer/SectionHeader";
import { Truck, Map, Phone, MapPin, Package, User, Clock } from "lucide-react";

export default function ActiveDeliveriesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadActiveOrders() {
      setLoading(true);
      setError("");
      try {
        const data = await api.getCustomerActiveOrders();
        setOrders(data);
        if (data.length > 0) setSelectedId(data[0].id);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load active orders");
      } finally {
        setLoading(false);
      }
    }
    loadActiveOrders();
  }, []);

  const selectedOrder = orders.find((o) => o.id === selectedId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <SectionHeader
        title="Active Deliveries"
        description="Track your packages in real time."
        actionLabel="New Delivery"
        actionHref="/customer/new-delivery"
      />

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {loading ? (
        <PageLoader label="Loading active deliveries..." />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No active deliveries</h3>
          <p className="text-sm text-slate-500 mb-4">You don't have any packages currently in transit.</p>
          <a href="/customer/new-delivery" className="inline-block px-6 py-2.5 bg-[#FF9B51] hover:bg-[#e8883e] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer">
            Send a Package
          </a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6 items-start">
          {/* Delivery List */}
          <div className="lg:col-span-2 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedId(order.id)}
                className={`cursor-pointer transition-all rounded-3xl p-4 bg-white border border-slate-100 shadow-sm ${
                  selectedId === order.id ? "ring-2 ring-[#25343F]" : "opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === "in_transit" ? "bg-blue-100 text-blue-800" :
                      order.status === "delivered" ? "bg-green-100 text-green-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                    <p className="text-sm font-semibold text-[#25343F] mt-2">#{order.id}</p>
                    <p className="text-xs text-slate-500">{order.item_description || "Package"}</p>
                  </div>
                  <p className="text-lg font-bold text-[#FF9B51]">{order.total_price} {order.currency}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{order.pickup_address}</span>
                  <span>→</span>
                  <span className="truncate">{order.dropoff_address}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {selectedOrder && (
            <motion.div
              key={selectedOrder.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 space-y-5"
            >
              {/* Map Placeholder */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-slate-100 to-[#EAEFEF] h-52 flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm text-slate-500">
                    <Map className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#25343F]">Live Map Coming Soon</p>
                    <p className="text-xs text-slate-400 mt-1">Real-time GPS tracking will be displayed here.</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-600">
                      Order is {selectedOrder.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  {selectedOrder.rider && (
                    <a
                      href={`tel:${selectedOrder.rider.user?.phone}`}
                      className="text-xs font-bold text-[#FF9B51] hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Rider
                    </a>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-[#25343F] mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Package Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Description</p>
                      <p className="text-sm font-medium text-[#25343F]">{selectedOrder.item_description || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">Pickup</p>
                      <p className="text-sm font-medium text-[#25343F]">{selectedOrder.pickup_address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">Dropoff</p>
                      <p className="text-sm font-medium text-[#25343F]">{selectedOrder.dropoff_address}</p>
                    </div>
                  </div>
                  {selectedOrder.rider && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Rider</p>
                        <p className="text-sm font-medium text-[#25343F]">{selectedOrder.rider.user?.name}</p>
                        <p className="text-xs text-slate-500">{selectedOrder.rider.user?.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-sm font-medium text-[#25343F]">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
