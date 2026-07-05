"use client";

import Link from "next/link";
import { AdminOrder } from "@/lib/mock-admin-orders";
import StatusBadge from "@/components/ui/StatusBadge";
import { ChevronRight } from "lucide-react";

interface OrdersTableProps {
  orders: AdminOrder[];
  showAudit?: boolean;
}

export default function OrdersTable({ orders, showAudit = false }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
        <p className="text-sm font-bold text-slate-400">No orders in this view</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <span className="col-span-2">Order ID</span>
        <span className="col-span-2">Customer</span>
        <span className="col-span-2">Route</span>
        <span className="col-span-1">Rider</span>
        <span className="col-span-1">Price</span>
        <span className="col-span-1">Payee</span>
        <span className="col-span-1">Status</span>
        {showAudit && <span className="col-span-2">Last Updated</span>}
      </div>
      <div className="divide-y divide-slate-50">
        {orders.map((o) => (
          <Link
            key={o.id}
            href={`/admin/orders?id=${o.id}`}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 px-6 py-4 hover:bg-slate-50/70 transition-colors items-center group"
          >
            <span className="md:col-span-2 text-sm font-black text-[#25343F]">{o.id}</span>
            <div className="md:col-span-2 min-w-0">
              <p className="text-xs font-bold text-[#25343F] truncate">{o.customerName}</p>
              <p className="text-[10px] text-slate-400">+{o.customerPhone}</p>
            </div>
            <div className="md:col-span-2 min-w-0">
              <p className="text-[11px] text-slate-600 truncate">{o.pickup} → {o.dropoff}</p>
              <p className="text-[10px] text-slate-400 capitalize">{o.itemType}</p>
            </div>
            <span className="md:col-span-1 text-xs text-slate-500 truncate">{o.riderName ?? "—"}</span>
            <span className="md:col-span-1 text-xs font-bold text-[#25343F]">{o.price.toLocaleString()} RWF</span>
            <span className="md:col-span-1 text-[10px] font-semibold text-slate-500 capitalize">{o.payee}</span>
            <span className="md:col-span-1">
              <StatusBadge status={o.status} />
            </span>
            {showAudit && (
              <span className="md:col-span-2 text-[10px] text-slate-400 flex items-center justify-between">
                {o.updatedAt}
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#FF9B51] transition-opacity" />
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
