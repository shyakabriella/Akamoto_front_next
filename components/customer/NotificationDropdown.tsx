"use client";

import Link from "next/link";

interface NotificationDropdownProps {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const notifications = [
    {
      id: "1",
      title: "Delivery completed",
      body: "Rider Eric finished delivering 'Documents to HQ'.",
      time: "10 mins ago",
      icon: "✅",
      unread: true,
    },
    {
      id: "2",
      title: "Package picked up",
      body: "Rider Aline is on the way to the dropoff location.",
      time: "1 hour ago",
      icon: "📦",
      unread: false,
    },
    {
      id: "3",
      title: "Rider Assigned",
      body: "Rider Jean has accepted your delivery request.",
      time: "2 hours ago",
      icon: "🚴",
      unread: false,
    },
    {
      id: "4",
      title: "Payment confirmed",
      body: "Payment of 2,400 RWF via MTN MoMo succeeded.",
      time: "1 day ago",
      icon: "💵",
      unread: false,
    },
  ];

  return (
    <>
      {/* Overlay backdrop to close */}
      <div className="fixed inset-0 z-30" onClick={onClose} />

      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-slate-100 py-3 z-40 animate-in fade-in-50 slide-in-from-top-3 duration-150">
        {/* Header */}
        <div className="px-5 py-2 flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-[#25343F] uppercase tracking-wider">
            Notifications
          </h3>
          <span className="text-[10px] font-bold text-[#FF9B51] bg-[#FF9B51]/10 px-2 py-0.5 rounded-full">
            1 Unread
          </span>
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 hover:bg-slate-50 transition-colors flex gap-3.5 items-start ${
                notif.unread ? "bg-slate-50/50" : ""
              }`}
            >
              <span className="text-lg bg-white p-1.5 shadow-sm rounded-xl border border-slate-100 flex items-center justify-center w-8 h-8 select-none">
                {notif.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-1">
                  <h4 className={`text-xs text-[#25343F] truncate ${notif.unread ? "font-bold" : "font-semibold"}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-medium shrink-0">{notif.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{notif.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 pt-3 border-t border-slate-100 text-center">
          <Link
            href="/customer/notifications"
            onClick={onClose}
            className="text-xs font-bold text-[#FF9B51] hover:underline"
          >
            View all notifications
          </Link>
        </div>
      </div>
    </>
  );
}
