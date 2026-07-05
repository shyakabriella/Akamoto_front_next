"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Dispute } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDisputes() {
      setLoading(true);
      setError("");
      try {
        const data = await api.listDisputes({ per_page: 100 });
        setDisputes(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load disputes");
      } finally {
        setLoading(false);
      }
    }
    loadDisputes();
  }, []);

  async function resolveDispute(id: number) {
    try {
      await api.updateDispute(id, { status: "resolved", resolution: "Resolved by admin" });
      setDisputes((d) => d.map((x) => (x.id === id ? { ...x, status: "resolved" as const } : x)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resolve dispute");
    }
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  const statusConfig = {
    open: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50", label: "Open" },
    investigating: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50", label: "Investigating" },
    resolved: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", label: "Resolved" },
    closed: { icon: XCircle, color: "text-gray-500", bg: "bg-gray-50", label: "Closed" },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Page Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-gray-800">Disputes</h1>
        <p className="text-gray-500 text-sm mt-1">Customer and rider complaints</p>
      </motion.div>

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {loading ? (
        <PageLoader label="Loading disputes..." />
      ) : disputes.length === 0 ? (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No disputes</h3>
          <p className="text-sm text-gray-500">No disputes have been reported yet.</p>
        </motion.div>
      ) : (
        /* Disputes List */
        <motion.div variants={fadeUp} className="space-y-4">
          {disputes.map((d) => {
            const config = statusConfig[d.status] || statusConfig.open;
            const Icon = config.icon;
            return (
              <div key={d.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">#{d.id} · {d.type}</p>
                      <p className="text-[10px] text-gray-400">Order #{d.order_id} · {new Date(d.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{d.description}</p>
                {d.user && (
                  <p className="text-xs text-gray-400 mt-2">
                    Reported by: {d.user.name} ({d.user.phone})
                  </p>
                )}
                {d.resolution && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-semibold text-green-800">Resolution:</p>
                    <p className="text-xs text-green-700">{d.resolution}</p>
                  </div>
                )}
                {d.status !== "resolved" && d.status !== "closed" && (
                  <button
                    onClick={() => resolveDispute(d.id)}
                    className="mt-4 text-xs font-semibold text-green-600 border border-green-200 hover:bg-green-50 px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Mark as resolved
                  </button>
                )}
              </div>
            );
          })}
        </motion.div>
      )}

    </motion.div>
  );
}
