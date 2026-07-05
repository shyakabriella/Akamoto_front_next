"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { PricingRulePayload, VehicleType } from "@/lib/types";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { ArrowLeft } from "lucide-react";

const VEHICLE_TYPES: VehicleType[] = ["moto", "bicycle", "car", "van"];

const DEFAULT: PricingRulePayload = {
  name: "",
  vehicle_type: "moto",
  base_distance_km: 3,
  base_price: 1000,
  extra_price_per_km: 200,
  minimum_price: 0,
  commission_percentage: 20,
  currency: "RWF",
  is_active: true,
};

interface PricingRuleFormProps {
  initial?: PricingRulePayload;
  ruleId?: number;
  mode: "create" | "edit";
}

export default function PricingRuleForm({ initial, ruleId, mode }: PricingRuleFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PricingRulePayload>(initial ?? DEFAULT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setField<K extends keyof PricingRulePayload>(key: K, value: PricingRulePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "create") {
        await api.createPricingRule(form);
        router.push("/admin/pricing");
      } else if (ruleId) {
        await api.updatePricingRule(ruleId, form);
        router.push(`/admin/pricing/${ruleId}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save pricing rule");
    } finally {
      setLoading(false);
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

  const fields: Array<{
    key: keyof PricingRulePayload;
    label: string;
    type: string;
    step?: string;
  }> = [
    { key: "name", label: "Rule Name", type: "text" },
    { key: "base_distance_km", label: "Base Distance (km)", type: "number", step: "0.1" },
    { key: "base_price", label: "Base Price (RWF)", type: "number" },
    { key: "extra_price_per_km", label: "Extra Price per KM (RWF)", type: "number" },
    { key: "minimum_price", label: "Minimum Price (RWF)", type: "number" },
    { key: "commission_percentage", label: "Commission (%)", type: "number", step: "0.1" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Back Link */}
      <motion.div variants={fadeUp}>
        <Link
          href="/admin/pricing"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to pricing rules
        </Link>
      </motion.div>

      {/* Page Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "create" ? "Create Pricing Rule" : "Edit Pricing Rule"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Set base tariff, extra km rate, and commission percentage</p>
      </motion.div>

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {/* Form */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Vehicle Type</label>
            <select
              value={form.vehicle_type}
              onChange={(e) => setField("vehicle_type", e.target.value as VehicleType)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent bg-white capitalize cursor-pointer"
            >
              {VEHICLE_TYPES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input
                type={f.type}
                step={f.step}
                required
                value={form[f.key] as string | number}
                onChange={(e) =>
                  setField(
                    f.key,
                    f.type === "number" ? Number(e.target.value) : e.target.value
                  )
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent"
              />
            </div>
          ))}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setField("is_active", e.target.checked)}
              className="w-4 h-4 accent-gray-800"
            />
            <span className="text-sm font-semibold text-gray-800">Set as active rule</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold text-sm rounded-lg cursor-pointer disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : mode === "create" ? "Create Rule" : "Save Changes"}
          </button>
        </form>
      </motion.div>

    </motion.div>
  );
}
