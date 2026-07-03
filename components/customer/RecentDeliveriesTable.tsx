import { Package } from "lucide-react";
import { DeliveryStatus } from "./DeliveryCard";

interface HistoryRow {
  id: string;
  packageName: string;
  pickup: string;
  destination: string;
  date: string;
  price: number;
  status: DeliveryStatus;
}

interface RecentDeliveriesTableProps {
  rows: HistoryRow[];
  onViewDetails?: (id: string) => void;
  showViewAll?: boolean;
}

const statusBadge: Record<DeliveryStatus, { label: string; classes: string }> = {
  pending: { label: "Pending", classes: "text-amber-600 bg-amber-50 border-amber-100" },
  searching_rider: { label: "Searching", classes: "text-blue-600 bg-blue-50 border-blue-100" },
  rider_assigned: { label: "Assigned", classes: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  accepted: { label: "Accepted", classes: "text-violet-600 bg-violet-50 border-violet-100" },
  arrived_at_pickup: { label: "At Pickup", classes: "text-orange-600 bg-orange-50 border-orange-100" },
  picked_up: { label: "Picked Up", classes: "text-[#FF9B51] bg-[#FF9B51]/10 border-[#FF9B51]/20" },
  on_the_way: { label: "In Transit", classes: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  delivered: { label: "Delivered", classes: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  cancelled: { label: "Cancelled", classes: "text-red-500 bg-red-50 border-red-100" },
  failed: { label: "Failed", classes: "text-red-600 bg-red-50 border-red-100" },
};

export default function RecentDeliveriesTable({ rows, onViewDetails, showViewAll }: RecentDeliveriesTableProps) {
  if (rows.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Table (desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-4">Package</th>
              <th className="px-6 py-4">Pickup</th>
              <th className="px-6 py-4">Destination</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row) => {
              const badge = statusBadge[row.status];
              return (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-[#25343F] max-w-[120px] truncate">{row.packageName}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 max-w-[120px] truncate">{row.pickup}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 max-w-[120px] truncate">{row.destination}</td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-medium">{row.date}</td>
                  <td className="px-6 py-4 text-xs font-bold text-[#25343F]">{row.price.toLocaleString()} RWF</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border ${badge.classes}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onViewDetails?.(row.id)}
                      className="text-xs font-bold text-[#FF9B51] hover:underline cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden divide-y divide-slate-50">
        {rows.map((row) => {
          const badge = statusBadge[row.status];
          return (
            <div key={row.id} className="p-4 flex items-center gap-3">
              <Package className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[#25343F] truncate">{row.packageName}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.classes}`}>{badge.label}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{row.date} · {row.price.toLocaleString()} RWF</p>
              </div>
            </div>
          );
        })}
      </div>

      {showViewAll && (
        <div className="px-6 py-4 border-t border-slate-50 text-center">
          <a href="/customer/history" className="text-xs font-bold text-[#FF9B51] hover:underline">
            View all deliveries →
          </a>
        </div>
      )}
    </div>
  );
}
