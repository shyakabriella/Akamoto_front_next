"use client";

import SectionHeader from "@/components/customer/SectionHeader";
import { Package, User, CreditCard, Bell } from "lucide-react";

const notifications = [
  { id: "1", title: "Delivery completed", body: "Rider Eric finished delivering 'HP EliteBook 840 (Laptop)' to Remera Giporoso, Kigali.", time: "10 mins ago", unread: true, type: "delivery" },
  { id: "2", title: "Package picked up", body: "Rider Aline picked up your package and is now heading to the destination.", time: "1 hour ago", unread: false, type: "delivery" },
  { id: "3", title: "Rider Assigned", body: "Rider Jean accepted your delivery request and will arrive in about 8 minutes.", time: "2 hours ago", unread: false, type: "rider" },
  { id: "4", title: "Payment confirmed", body: "Payment of 2,400 RWF via MTN MoMo for DEL-001 was processed successfully.", time: "1 day ago", unread: false, type: "payment" },
  { id: "5", title: "Welcome to Akamoto!", body: "Your account is ready. You can now send packages across the city. Tap 'New Delivery' to get started.", time: "3 days ago", unread: false, type: "system" },
];

const typePill: Record<string, string> = {
  delivery: "bg-slate-100 text-slate-500",
  rider: "bg-blue-50 text-blue-500",
  payment: "bg-emerald-50 text-emerald-600",
  system: "bg-[#FF9B51]/10 text-[#FF9B51]",
};

const iconMap = {
  delivery: Package,
  rider: User,
  payment: CreditCard,
  system: Bell,
};

export default function NotificationsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SectionHeader
        title="Notifications"
        description="Stay updated on all your delivery activities."
      />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
        {notifications.map((n) => {
          const IconComponent = iconMap[n.type as keyof typeof iconMap] || Bell;
          return (
            <div
              key={n.id}
              className={`flex gap-4 p-5 hover:bg-slate-50/50 transition-colors ${n.unread ? "bg-slate-50/70" : ""}`}
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${n.unread ? "font-bold text-[#25343F]" : "font-semibold text-[#25343F]"}`}>
                      {n.title}
                    </p>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#FF9B51] shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${typePill[n.type]}`}>
                      {n.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">{n.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
