"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchPricingRules } from "@/lib/admin-data";
import { PricingRule } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import StatusBadge from "@/components/ui/StatusBadge";
import { Plus, ChevronRight, DollarSign } from "lucide-react";

export default function AdminPricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setRules(await fetchPricingRules());
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load pricing rules");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-800">Pricing Rules</h1>
          <p className="text-gray-500 text-sm mt-1">Configure delivery tariffs and commission rates</p>
        </div>
        <Link
          href="/admin/pricing/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#FF9B51] hover:bg-[#e8883e] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Rule
        </Link>
      </motion.div>

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {loading ? (
        <PageLoader label="Loading pricing rules..." />
      ) : rules.length === 0 ? (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-400">No pricing rules yet</p>
          <Link href="/admin/pricing/new" className="text-[#FF9B51] text-xs font-semibold mt-2 inline-block">
            Create your first rule →
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Rule Name</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Vehicle</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Base Tariff</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Commission</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <Link href={`/admin/pricing/${rule.id}`} className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-[#FF9B51]">
                        {rule.name}
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{rule.vehicle_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {rule.base_price.toLocaleString()} RWF / {rule.base_distance_km} km + {rule.extra_price_per_km}/km
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#FF9B51]">{rule.commission_percentage}%</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={rule.is_active ? "active" : "inactive"} label={rule.is_active ? "Active" : "Inactive"} />
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
