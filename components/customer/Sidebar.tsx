"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { LayoutDashboard, PlusCircle, Truck, History, Bell, Settings } from "lucide-react";

interface SidebarProps {
  onLinkClick?: () => void;
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { label: "Dashboard", href: "/customer", icon: LayoutDashboard },
    { label: "New Delivery", href: "/customer/new-delivery", icon: PlusCircle, badge: "New" },
    { label: "Active Deliveries", href: "/customer/active", icon: Truck },
    { label: "Delivery History", href: "/customer/history", icon: History },
    { label: "Notifications", href: "/customer/notifications", icon: Bell },
    { label: "Settings", href: "/customer/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#EAEFEF] h-screen flex flex-col justify-between select-none">
      <div className="flex flex-col flex-1 py-6">
        {/* Brand Header */}
        <div className="px-6 pb-6 border-b border-[#EAEFEF] flex items-center gap-2">
          <Link
            href="/"
            className="font-bold text-xl text-[#25343F] flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-xl bg-[#25343F] flex items-center justify-center text-white text-base font-black">
              A
            </span>
            <span>Akamoto</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 px-4 space-y-1.5 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#25343F]/5 text-[#25343F]"
                    : "text-[#25343F]/60 hover:bg-slate-50 hover:text-[#25343F]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#FF9B51] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider scale-90">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#EAEFEF] bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#25343F] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "C"}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-[#25343F] truncate">{user?.name}</span>
            <span className="text-[10px] font-semibold text-slate-400 truncate uppercase tracking-wider">
              {user?.role} Account
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
