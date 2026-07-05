"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchPricingRule } from "@/lib/admin-data";
import { api } from "@/lib/api";
import { PricingRule } from "@/lib/types";
import PricingRuleForm from "@/components/admin/PricingRuleForm";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { ArrowLeft, Zap, Trash2, Pencil } from "lucide-react";

export default function AdminPricingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [rule, setRule] = useState<PricingRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setRule(await fetchPricingRule(id));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load pricing rule");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleActivate() {
    setActionLoading(true);
    try {
      const updated = await api.activatePricingRule(id);
      setRule(updated);
      setSuccessMsg("Rule activated. Other rules for this vehicle type were deactivated.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to activate rule");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    setActionLoading(true);
    try {
      await api.deletePricingRule(id);
      router.push("/admin/pricing");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete rule");
      setActionLoading(false);
    }
  }

  if (loading) return <PageLoader label="Loading pricing rule..." />;
  if (!rule) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Pricing rule not found.</p>
        <Link href="/admin/pricing" className="text-[#FF9B51] text-sm font-bold mt-4 inline-block">← Back</Link>
      </div>
    );
  }

  if (editing) {
    return (
      <PricingRuleForm
        mode="edit"
        ruleId={id}
        initial={{
          name: rule.name,
          vehicle_type: rule.vehicle_type,
          base_distance_km: rule.base_distance_km,
          base_price: rule.base_price,
          extra_price_per_km: rule.extra_price_per_km,
          minimum_price: rule.minimum_price,
          commission_percentage: rule.commission_percentage,
          currency: rule.currency,
          is_active: rule.is_active,
        }}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/pricing" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#25343F]">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to pricing rules
      </Link>

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl px-4 py-3 text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-[#25343F]">{rule.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={rule.is_active ? "active" : "inactive"} label={rule.is_active ? "Active" : "Inactive"} />
              <span className="text-xs font-semibold text-slate-400 capitalize">{rule.vehicle_type}</span>
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs font-bold border border-slate-200 hover:border-[#25343F] px-4 py-2 rounded-xl cursor-pointer transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {[
            { label: "Base Distance", value: `${rule.base_distance_km} km` },
            { label: "Base Price", value: `${rule.base_price.toLocaleString()} ${rule.currency}` },
            { label: "Extra per KM", value: `${rule.extra_price_per_km.toLocaleString()} ${rule.currency}` },
            { label: "Minimum Price", value: `${rule.minimum_price.toLocaleString()} ${rule.currency}` },
            { label: "Commission", value: `${rule.commission_percentage}%` },
            { label: "Currency", value: rule.currency },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-bold text-[#25343F] mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[#FF9B51]/5 border border-[#FF9B51]/20 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed">
          Example: 6 km delivery → {rule.base_price.toLocaleString()} + (3 extra km × {rule.extra_price_per_km}) ={" "}
          <strong>{(rule.base_price + 3 * rule.extra_price_per_km).toLocaleString()} {rule.currency}</strong>
          {" "}· Commission: <strong>{Math.round((rule.base_price + 3 * rule.extra_price_per_km) * rule.commission_percentage / 100).toLocaleString()} {rule.currency}</strong>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {!rule.is_active && (
          <button
            onClick={handleActivate}
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4" /> Activate Rule
          </button>
        )}
        <button
          onClick={() => setShowDelete(true)}
          className="flex items-center gap-2 px-5 py-3 border border-red-200 text-red-600 hover:bg-red-50 font-bold text-sm rounded-2xl cursor-pointer"
        >
          <Trash2 className="w-4 h-4" /> Delete Rule
        </button>
      </div>

      <ConfirmModal
        open={showDelete}
        title="Delete Pricing Rule"
        description={`Permanently delete "${rule.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
