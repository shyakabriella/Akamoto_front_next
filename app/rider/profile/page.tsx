"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RiderProfilePayload, VehicleType } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import StatusBadge from "@/components/ui/StatusBadge";
import { CheckCircle2 } from "lucide-react";

const VEHICLE_TYPES: VehicleType[] = ["moto", "bicycle", "car", "van"];

export default function RiderProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState<RiderProfilePayload>({
    vehicle_type: "moto",
    vehicle_plate_number: "",
    vehicle_color: "",
    national_id: "",
    driving_license_number: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getRiderProfile();
        if (data) {
          setForm({
            vehicle_type: data.vehicle_type,
            vehicle_plate_number: data.vehicle_plate_number ?? "",
            vehicle_color: data.vehicle_color ?? "",
            national_id: data.national_id ?? "",
            driving_license_number: data.driving_license_number ?? "",
          });
          setStatus(data.status);
        }
      } catch (err: unknown) {
        // 404 means no profile yet — that's fine
        if ((err as { status?: number }).status !== 404) {
          setError(err instanceof Error ? err.message : "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const saved = await api.saveRiderProfile(form);
      setStatus(saved.status);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoader label="Loading profile..." />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#25343F] tracking-tight">Rider Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Your vehicle and identity information for admin verification.</p>
        {status && (
          <div className="mt-2">
            <StatusBadge status={status} />
          </div>
        )}
      </div>

      {error && <ErrorBanner message={error} />}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl px-4 py-3 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Profile saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">Vehicle Type *</label>
          <select
            required
            value={form.vehicle_type}
            onChange={(e) => setForm({ ...form, vehicle_type: e.target.value as VehicleType })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#FF9B51] bg-slate-50 capitalize cursor-pointer"
          >
            {VEHICLE_TYPES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {[
          { key: "vehicle_plate_number" as const, label: "Plate Number" },
          { key: "vehicle_color" as const, label: "Vehicle Color" },
          { key: "national_id" as const, label: "National ID" },
          { key: "driving_license_number" as const, label: "Driving License Number" },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">{field.label}</label>
            <input
              type="text"
              value={form[field.key] ?? ""}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#FF9B51] bg-slate-50 focus:bg-white"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-[#25343F] hover:bg-[#1a252d] text-white font-bold text-sm rounded-2xl cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
