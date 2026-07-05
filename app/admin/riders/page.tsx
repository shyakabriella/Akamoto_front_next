"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { fetchRiders } from "@/lib/admin-data";
import { RiderProfile } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import StatusBadge from "@/components/ui/StatusBadge";
import { Search, Bike, Plus, Filter } from "lucide-react";

const STATUS_FILTERS = ["all", "pending", "approved", "rejected", "suspended"] as const;

function AdminRidersContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") ?? "all";

  const [riders, setRiders] = useState<RiderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const list = await fetchRiders({
          status: status === "all" ? undefined : status,
          search: search || undefined,
        });
        setRiders(list);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load riders");
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [status, search]);

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
          <h1 className="text-2xl font-bold text-gray-800">Riders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage rider accounts and approvals</p>
        </div>
        <Link
          href="/register?role=rider"
          className="flex items-center gap-2 px-4 py-2 bg-[#FF9B51] hover:bg-[#e8883e] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Rider
        </Link>
      </motion.div>

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {/* Filters */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone, or plate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStatus(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer capitalize transition-colors ${
                  status === f
                    ? "bg-[#FF9B51] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Riders Table */}
      {loading ? (
        <PageLoader label="Loading riders..." />
      ) : riders.length === 0 ? (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <Bike className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-400">No riders found</p>
          <p className="text-xs text-gray-300 mt-1">Try changing your filters or search term.</p>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Phone</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Vehicle</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Plate</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Online</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Orders</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Rating</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {riders.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <Link href={`/admin/riders/${r.id}`} className="text-sm font-medium text-gray-800 hover:text-[#FF9B51]">
                        {r.user?.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">+{r.user?.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{r.vehicle_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.vehicle_plate_number || "-"}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-4">
                      {r.is_online ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Online
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Offline</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.total_orders || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.rating ? `${r.rating.toFixed(1)}/5` : "-"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {r.total_earnings ? `${r.total_earnings.toLocaleString()} RWF` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}

export default function AdminRidersPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading riders..." />}>
      <AdminRidersContent />
    </Suspense>
  );
}
