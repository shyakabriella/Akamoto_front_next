"use client";

import Link from "next/link";

import { Package } from "lucide-react";

export type DeliveryStatus =
  | "pending"
  | "searching_rider"
  | "rider_assigned"
  | "accepted"
  | "arrived_at_pickup"
  | "picked_up"
  | "on_the_way"
  | "delivered"
  | "cancelled"
  | "failed";

export interface Delivery {
  id: string;
  packageName: string;
  pickupAddress: string;
  dropoffAddress: string;
  status: DeliveryStatus;
  riderName?: string;
  riderPhone?: string;
  estimatedArrival?: string;
  price?: number;
  createdAt: string;
}

const statusConfig: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  searching_rider: { label: "Searching Rider", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  rider_assigned: { label: "Rider Assigned", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
  accepted: { label: "Accepted", color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
  arrived_at_pickup: { label: "At Pickup", color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
  picked_up: { label: "Picked Up", color: "text-[#FF9B51]", bg: "bg-[#FF9B51]/10 border-[#FF9B51]/20" },
  on_the_way: { label: "On The Way", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  delivered: { label: "Delivered", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
  cancelled: { label: "Cancelled", color: "text-red-500", bg: "bg-red-50 border-red-100" },
  failed: { label: "Failed", color: "text-red-600", bg: "bg-red-50 border-red-100" },
};

interface DeliveryCardProps {
  delivery: Delivery;
}

export default function DeliveryCard({ delivery }: DeliveryCardProps) {
  const cfg = statusConfig[delivery.status];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Status Strip */}
      <div className={`px-5 py-2 flex items-center justify-between border-b ${cfg.bg}`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${cfg.color}`}>
          {cfg.label}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">{delivery.createdAt}</span>
      </div>

      <div className="p-5">
        {/* Package Name */}
        <h3 className="text-sm font-bold text-[#25343F] mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-slate-400" />
          {delivery.packageName}
        </h3>

        {/* Route */}
        <div className="space-y-2 mb-4">
          <div className="flex gap-3 items-start">
            <div className="w-5 flex flex-col items-center pt-1 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25343F] ring-2 ring-[#25343F]/20" />
              <span className="w-px h-5 bg-slate-200 my-1" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9B51] ring-2 ring-[#FF9B51]/20" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Pickup</p>
                <p className="text-xs font-semibold text-[#25343F] leading-tight">{delivery.pickupAddress}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Drop-off</p>
                <p className="text-xs font-semibold text-[#25343F] leading-tight">{delivery.dropoffAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rider & ETA */}
        {delivery.riderName && (
          <div className="flex items-center justify-between py-3 border-t border-slate-50 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#25343F] text-white text-xs font-bold flex items-center justify-center">
                {delivery.riderName[0]}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Rider</p>
                <p className="text-xs font-bold text-[#25343F]">{delivery.riderName}</p>
              </div>
            </div>
            {delivery.estimatedArrival && (
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-semibold">Est. Arrival</p>
                <p className="text-xs font-bold text-emerald-600">{delivery.estimatedArrival}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/customer/active?id=${delivery.id}`}
            className="flex-1 text-center py-2.5 px-4 bg-[#25343F] hover:bg-[#1a252d] text-white text-xs font-bold rounded-2xl transition-all"
          >
            Track Package
          </Link>
          {delivery.price && (
            <div className="py-2.5 px-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-[#25343F]">
              {delivery.price.toLocaleString()} RWF
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
