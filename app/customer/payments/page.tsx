"use client";

import { useState } from "react";
import EmptyState from "@/components/customer/EmptyState";
import SectionHeader from "@/components/customer/SectionHeader";
import { Smartphone, Banknote, Coins, CreditCard } from "lucide-react";

const mockPayments = [
  { id: "PAY-001", delivery: "DEL-002 · Laptop Bag", method: "MTN MoMo", amount: 3200, status: "success", date: "Jul 2, 2026" },
  { id: "PAY-002", delivery: "DEL-003 · Birthday Gift Box", method: "Airtel Money", amount: 1800, status: "success", date: "Jun 29, 2026" },
  { id: "PAY-003", delivery: "DEL-004 · Medical Supplies", method: "Cash", amount: 2000, status: "refunded", date: "Jun 25, 2026" },
  { id: "PAY-004", delivery: "DEL-005 · Office Equipment", method: "Wallet", amount: 4500, status: "success", date: "Jun 20, 2026" },
];

const statusBadge: Record<string, { label: string; classes: string }> = {
  success: { label: "Paid", classes: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  pending: { label: "Pending", classes: "text-amber-600 bg-amber-50 border-amber-100" },
  refunded: { label: "Refunded", classes: "text-blue-600 bg-blue-50 border-blue-100" },
  failed: { label: "Failed", classes: "text-red-500 bg-red-50 border-red-100" },
};

const methodIconMap = {
  "MTN MoMo": Smartphone,
  "Airtel Money": Smartphone,
  Cash: Banknote,
  Wallet: Coins,
};

export default function PaymentsPage() {
  const total = mockPayments
    .filter((p) => p.status === "success")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SectionHeader title="Payments & Billing" description="Track all your delivery payments and receipts." />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Total Paid</p>
          <p className="text-2xl font-black text-[#25343F]">{total.toLocaleString()} RWF</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Wallet Balance</p>
          <p className="text-2xl font-black text-[#25343F]">0 RWF</p>
          <button className="text-[10px] font-bold text-[#FF9B51] mt-2 cursor-pointer hover:underline">+ Top Up</button>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 col-span-2 sm:col-span-1">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Transactions</p>
          <p className="text-2xl font-black text-[#25343F]">{mockPayments.length}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-[#25343F]">Transaction History</h3>
        </div>

        {mockPayments.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {mockPayments.map((p) => {
              const badge = statusBadge[p.status];
              const IconComp = methodIconMap[p.method as keyof typeof methodIconMap] || CreditCard;
              return (
                <div key={p.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#25343F] truncate">{p.delivery}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{p.method} · {p.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-[#25343F]">{p.amount.toLocaleString()} RWF</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.classes}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={CreditCard}
            title="No payments yet"
            description="Your payment history will appear here after your first delivery."
            actionLabel="Send a Package"
            actionHref="/customer/new-delivery"
          />
        )}
      </div>
    </div>
  );
}
