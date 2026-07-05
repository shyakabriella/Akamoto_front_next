"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Payment } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import SectionHeader from "@/components/customer/SectionHeader";
import { Smartphone, Banknote, Coins, CreditCard } from "lucide-react";

const statusBadge: Record<string, { label: string; classes: string }> = {
  completed: { label: "Paid", classes: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  pending: { label: "Pending", classes: "text-amber-600 bg-amber-50 border-amber-100" },
  refunded: { label: "Refunded", classes: "text-blue-600 bg-blue-50 border-blue-100" },
  failed: { label: "Failed", classes: "text-red-500 bg-red-50 border-red-100" },
};

const methodIconMap: Record<string, any> = {
  mobile_money: Smartphone,
  cash: Banknote,
  wallet: Coins,
  card: CreditCard,
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPayments() {
      setLoading(true);
      setError("");
      try {
        const data = await api.listPayments({ per_page: 100 });
        setPayments(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load payments");
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  const total = payments
    .filter((p) => p.status === "completed")
    .reduce((acc, p) => acc + p.amount, 0);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">
      <SectionHeader title="Payments & Billing" description="Track all your delivery payments and receipts." />

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {loading ? (
        <PageLoader label="Loading payments..." />
      ) : (
        <>
          {/* Summary Cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Total Paid</p>
              <p className="text-2xl font-black text-[#25343F]">{total.toLocaleString()} RWF</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Wallet Balance</p>
              <p className="text-2xl font-black text-[#25343F]">0 RWF</p>
              <a href="/customer/payments/topup" className="text-[10px] font-bold text-[#FF9B51] mt-2 cursor-pointer hover:underline">+ Top Up</a>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Transactions</p>
              <p className="text-2xl font-black text-[#25343F]">{payments.length}</p>
            </div>
          </motion.div>

          {/* Transactions Table */}
          <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#25343F]">Transaction History</h3>
            </div>

            {payments.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {payments.map((p) => {
                  const badge = statusBadge[p.status] || statusBadge.pending;
                  const IconComp = methodIconMap[p.method] || CreditCard;
                  return (
                    <div key={p.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#25343F] truncate">
                          {p.order ? `Order #${p.order.id}` : p.description || "Payment"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 capitalize">{p.method} · {new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-[#25343F]">{p.amount.toLocaleString()} {p.currency}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.classes}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No payments yet</h3>
                <p className="text-sm text-slate-500">Your payment history will appear here after your first delivery.</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
