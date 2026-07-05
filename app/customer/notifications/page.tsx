"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Notification } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import SectionHeader from "@/components/customer/SectionHeader";
import { Package, User, CreditCard, Bell, Check } from "lucide-react";

const typePill: Record<string, string> = {
  order_created: "bg-slate-100 text-slate-500",
  rider_assigned: "bg-blue-50 text-blue-500",
  order_delivered: "bg-emerald-50 text-emerald-600",
  order_cancelled: "bg-red-50 text-red-600",
  dispute_created: "bg-orange-50 text-orange-600",
  payment_received: "bg-emerald-50 text-emerald-600",
};

const iconMap: Record<string, any> = {
  order_created: Package,
  rider_assigned: User,
  order_delivered: Package,
  order_cancelled: Package,
  dispute_created: Bell,
  payment_received: CreditCard,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      setError("");
      try {
        const data = await api.listNotifications({ per_page: 100 });
        setNotifications(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  async function markAsRead(id: number) {
    try {
      await api.markNotificationAsRead(id);
      setNotifications((n) => n.map((notif) => (notif.id === id ? { ...notif, is_read: true } : notif)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to mark as read");
    }
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
      <SectionHeader
        title="Notifications"
        description="Stay updated on all your delivery activities."
      />

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {loading ? (
        <PageLoader label="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No notifications</h3>
          <p className="text-sm text-slate-500">You're all caught up! No new notifications to show.</p>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
          {notifications.map((n) => {
            const IconComponent = iconMap[n.type] || Bell;
            return (
              <div
                key={n.id}
                className={`flex gap-4 p-5 hover:bg-slate-50/50 transition-colors ${!n.is_read ? "bg-slate-50/70" : ""}`}
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!n.is_read ? "font-bold text-[#25343F]" : "font-semibold text-[#25343F]"}`}>
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#FF9B51] shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${typePill[n.type] || "bg-slate-100 text-slate-500"}`}>
                        {n.type.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">{n.message}</p>
                  {!n.is_read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="mt-2 text-xs font-semibold text-[#FF9B51] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Mark as read
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
