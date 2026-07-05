"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchRider } from "@/lib/admin-data";
import { api } from "@/lib/api";
import { RiderProfile } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { ArrowLeft, CheckCircle2, XCircle, Ban, Mail, Phone, Bike } from "lucide-react";

export default function AdminRiderDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [rider, setRider] = useState<RiderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState<"approve" | "reject" | "suspend" | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchRider(id);
        setRider(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load rider");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleAction() {
    if (!rider || !modal) return;
    setActionLoading(true);
    setError("");
    try {
      if (modal === "approve") {
        const updated = await api.approveRider(id, adminNotes || undefined);
        setRider(updated);
        setSuccessMsg("Rider approved successfully.");
      } else if (modal === "reject") {
        const updated = await api.rejectRider(id, rejectionReason, adminNotes || undefined);
        setRider(updated);
        setSuccessMsg("Rider rejected.");
      } else {
        const updated = await api.suspendRider(id, adminNotes || undefined);
        setRider(updated);
        setSuccessMsg("Rider suspended.");
      }
      setModal(null);
      setAdminNotes("");
      setRejectionReason("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <PageLoader label="Loading rider details..." />;
  if (!rider) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-slate-500">Rider not found.</p>
        <Link href="/admin/riders" className="text-[#FF9B51] text-sm font-bold mt-4 inline-block">
          ← Back to riders
        </Link>
      </div>
    );
  }

  const fields = [
    { label: "Vehicle Type", value: rider.vehicle_type },
    { label: "Plate Number", value: rider.vehicle_plate_number ?? "—" },
    { label: "Vehicle Color", value: rider.vehicle_color ?? "—" },
    { label: "National ID", value: rider.national_id ?? "—" },
    { label: "Driving License", value: rider.driving_license_number ?? "—" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/riders"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#25343F] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to riders
      </Link>

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl px-4 py-3 text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#25343F] text-white flex items-center justify-center text-xl font-black">
              {rider.user?.name?.[0] ?? "R"}
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#25343F]">{rider.user?.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <StatusBadge status={rider.status} />
                {rider.is_online && <StatusBadge status="online" label="Online" />}
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Mail className="w-4 h-4" /> {rider.user?.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Phone className="w-4 h-4" /> +{rider.user?.phone}
          </div>
        </div>

        {rider.rejection_reason && (
          <div className="mt-4 bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-red-700">
            <p className="font-bold text-xs uppercase tracking-wider mb-1">Rejection Reason</p>
            {rider.rejection_reason}
          </div>
        )}

        {rider.admin_notes && (
          <div className="mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600">
            <p className="font-bold text-xs uppercase tracking-wider mb-1 text-slate-400">Admin Notes</p>
            {rider.admin_notes}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-sm font-bold text-[#25343F] mb-4 flex items-center gap-2">
          <Bike className="w-4 h-4" /> Vehicle & Identity
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label} className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{f.label}</p>
              <p className="text-sm font-semibold text-[#25343F] mt-1 capitalize">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {rider.status === "pending" && (
          <>
            <button
              onClick={() => setModal("approve")}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve Rider
            </button>
            <button
              onClick={() => setModal("reject")}
              className="flex items-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-2xl cursor-pointer transition-colors"
            >
              <XCircle className="w-4 h-4" /> Reject Rider
            </button>
          </>
        )}
        {rider.status === "approved" && (
          <button
            onClick={() => setModal("suspend")}
            className="flex items-center gap-2 px-5 py-3 bg-slate-700 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl cursor-pointer transition-colors"
          >
            <Ban className="w-4 h-4" /> Suspend Rider
          </button>
        )}
        {(rider.status === "rejected" || rider.status === "suspended") && (
          <button
            onClick={() => setModal("approve")}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl cursor-pointer transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> Re-approve Rider
          </button>
        )}
      </div>

      <ConfirmModal
        open={modal === "approve"}
        title="Approve Rider"
        description={`Approve ${rider.user?.name} to start receiving delivery requests.`}
        confirmLabel="Approve"
        loading={actionLoading}
        onConfirm={handleAction}
        onCancel={() => setModal(null)}
      />

      {modal === "reject" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-3xl shadow-xl border border-slate-100 p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-[#25343F]">Reject Rider</h3>
            <p className="text-sm text-slate-500 mt-1">Provide a reason so the rider knows what to fix.</p>
            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Rejection reason..."
              className="w-full mt-4 px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#FF9B51] resize-none"
            />
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Admin notes (optional)..."
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#FF9B51] resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setModal(null)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={!rejectionReason || actionLoading}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={modal === "suspend"}
        title="Suspend Rider"
        description={`Suspend ${rider.user?.name}. They will be forced offline and cannot receive orders.`}
        confirmLabel="Suspend"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleAction}
        onCancel={() => setModal(null)}
      />
    </div>
  );
}
