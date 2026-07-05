"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { LayoutDashboard, PlusCircle, Truck, History, Bell, Settings, CreditCard, LifeBuoy, LogOut } from "lucide-react";

interface SidebarProps {
  onLinkClick?: () => void;
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: "Dashboard", href: "/customer", icon: LayoutDashboard },
    { label: "New Delivery", href: "/customer/new-delivery", icon: PlusCircle, badge: "New" },
    { label: "Active Deliveries", href: "/customer/active", icon: Truck },
    { label: "Delivery History", href: "/customer/history", icon: History },
    { label: "Payments", href: "/customer/payments", icon: CreditCard },
    { label: "Notifications", href: "/customer/notifications", icon: Bell },
    { label: "Support", href: "/customer/support", icon: LifeBuoy },
    { label: "Settings", href: "/customer/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#1e3a5f] h-screen flex flex-col justify-between select-none">
      <div className="flex flex-col flex-1 py-6">
        {/* Brand Header */}
        <div className="px-6 pb-6 border-b border-white/10 flex items-center gap-2">
          <Link
            href="/"
            className="font-bold text-xl text-white flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-xl bg-[#FF9B51] flex items-center justify-center text-white text-base font-black">
              A
            </span>
            <span>Akamoto</span>
          </Link>
        </div>

        {/* MAIN OPERATIONS Section */}
        <div className="mt-6 px-4 overflow-y-auto scrollbar-hide flex-1">
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-3 px-2">
            Main Operations
          </p>
          <nav className="space-y-1">
            {menuItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onLinkClick}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#FF9B51] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-white text-[#FF9B51] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider scale-90">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* MY SETTINGS Section */}
        <div className="mt-6 px-4">
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-3 px-2">
            My Settings
          </p>
          <nav className="space-y-1">
            {menuItems.slice(5).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onLinkClick}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#FF9B51] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-white/10 bg-white/5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF9B51] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "C"}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-white truncate">{user?.name}</span>
            <span className="text-[10px] font-semibold text-white/50 truncate uppercase tracking-wider">
              {user?.role} Account
            </span>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold border border-white/20 hover:border-white/40 text-white/70 hover:text-white px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
