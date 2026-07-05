"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Order } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { ArrowLeft, MapPin, Package, User, Clock, DollarSign, Bike, Phone, Mail } from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      setError("");
      try {
        const data = await api.getOrder(id);
        setOrder(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  if (loading) return <PageLoader label="Loading order details..." />;

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-slate-500">Order not found.</p>
        <button onClick={() => router.back()} className="text-[#FF9B51] text-sm font-bold mt-4 inline-block cursor-pointer">
          ← Back
        </button>
      </div>
    );
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    searching_rider: "bg-blue-100 text-blue-800",
    rider_assigned: "bg-indigo-100 text-indigo-800",
    rider_to_pickup: "bg-purple-100 text-purple-800",
    at_pickup: "bg-purple-100 text-purple-800",
    in_transit: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
          <p className="text-gray-500 text-sm mt-1">Order details and tracking information</p>
        </div>
      </motion.div>

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {/* Status Badge */}
      <motion.div variants={fadeUp}>
        <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
          {order.status.replace(/_/g, " ").toUpperCase()}
        </span>
      </motion.div>

      {/* Order Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-4 h-4" /> Customer Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-900">{order.customer?.name || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900">{order.customer?.phone || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{order.customer?.email || "—"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rider Info */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Bike className="w-4 h-4" /> Rider Information
          </h3>
          {order.rider ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{order.rider.user?.name || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{order.rider.user?.phone || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bike className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Vehicle</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{order.rider.vehicle_type} - {order.rider.vehicle_plate_number || "—"}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No rider assigned yet</p>
          )}
        </motion.div>
      </div>

      {/* Pickup & Dropoff */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-500" /> Pickup Location
          </h3>
          <p className="text-sm font-medium text-gray-900">{order.pickup_address}</p>
          <p className="text-xs text-gray-500 mt-1">
            {order.pickup_latitude.toFixed(6)}, {order.pickup_longitude.toFixed(6)}
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" /> Dropoff Location
          </h3>
          <p className="text-sm font-medium text-gray-900">{order.dropoff_address}</p>
          <p className="text-xs text-gray-500 mt-1">
            {order.dropoff_latitude.toFixed(6)}, {order.dropoff_longitude.toFixed(6)}
          </p>
        </motion.div>
      </div>

      {/* Package Details */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="w-4 h-4" /> Package Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Description</p>
            <p className="text-sm font-medium text-gray-900">{order.item_description || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Value</p>
            <p className="text-sm font-medium text-gray-900">{order.item_value ? `${order.item_value} ${order.currency}` : "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Receiver Name</p>
            <p className="text-sm font-medium text-gray-900">{order.receiver_name || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Receiver Phone</p>
            <p className="text-sm font-medium text-gray-900">{order.receiver_phone || "—"}</p>
          </div>
        </div>
        {order.notes && (
          <div className="mt-4">
            <p className="text-xs text-gray-500">Notes</p>
            <p className="text-sm text-gray-700">{order.notes}</p>
          </div>
        )}
      </motion.div>

      {/* Pricing */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Pricing Details
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Distance</span>
            <span className="text-sm font-medium text-gray-900">{order.distance_km} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Base Price</span>
            <span className="text-sm font-medium text-gray-900">{order.base_price} {order.currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Extra Cost</span>
            <span className="text-sm font-medium text-gray-900">{order.extra_cost} {order.currency}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="text-sm font-semibold text-gray-800">Total Price</span>
            <span className="text-lg font-bold text-[#FF9B51]">{order.total_price} {order.currency}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Commission ({order.commission_percentage}%)</span>
            <span>{order.commission_amount} {order.currency}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Rider Earning</span>
            <span>{order.rider_earning} {order.currency}</span>
          </div>
        </div>
      </motion.div>

      {/* Timestamps */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Timestamps
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Created At</p>
            <p className="text-sm font-medium text-gray-900">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Updated At</p>
            <p className="text-sm font-medium text-gray-900">{new Date(order.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
