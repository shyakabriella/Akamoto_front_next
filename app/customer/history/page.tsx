"use client";

import { useState } from "react";
import RecentDeliveriesTable from "@/components/customer/RecentDeliveriesTable";
import EmptyState from "@/components/customer/EmptyState";
import SectionHeader from "@/components/customer/SectionHeader";
import { History, Search } from "lucide-react";

const allHistory = [
  { id: "DEL-002", packageName: "iPhone 13 Pro (Phone)", pickup: "Kigali Heights, Kigali", destination: "Nyamirambo, Kigali", date: "Jul 2, 2026", price: 3200, status: "delivered" as const },
  { id: "DEL-003", packageName: "Corporate Contracts (Document)", pickup: "Kacyiru, Kigali", destination: "Kimironko, Kigali", date: "Jun 29, 2026", price: 1800, status: "delivered" as const },
  { id: "DEL-004", packageName: "Fragile Electronics (Electronics)", pickup: "King Faisal Hospital", destination: "Kanombe, Kigali", date: "Jun 25, 2026", price: 2000, status: "cancelled" as const },
  { id: "DEL-005", packageName: "HP Pavilion Laptop (Laptop)", pickup: "Downtown CBD, Kigali", destination: "Kicukiro, Kigali", date: "Jun 20, 2026", price: 4500, status: "delivered" as const },
];

const statusFilters = ["All", "Delivered", "Cancelled", "Failed"];

export default function HistoryPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allHistory.filter((d) => {
    const matchesFilter = filter === "All" || d.status === filter.toLowerCase();
    const matchesSearch = d.packageName.toLowerCase().includes(search.toLowerCase()) ||
      d.pickup.toLowerCase().includes(search.toLowerCase()) ||
      d.destination.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <SectionHeader
        title="Delivery History"
        description="All your past delivery requests."
        actionLabel="New Delivery"
        actionHref="/customer/new-delivery"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by package or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#25343F] outline-none focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
        <div className="flex gap-2">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                filter === f
                  ? "bg-[#25343F] border-[#25343F] text-white"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <RecentDeliveriesTable rows={filtered} onViewDetails={(id) => alert(`Details for ${id} coming soon.`)} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
          <EmptyState
            icon={History}
            title="No deliveries found"
            description="No deliveries match your current filters. Try changing your search or filter."
          />
        </div>
      )}
    </div>
  );
}
