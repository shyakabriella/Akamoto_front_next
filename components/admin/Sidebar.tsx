"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Package,
  Truck,
  History,
  AlertTriangle,
  PhoneCall,
  DollarSign,
  LogOut,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

interface SidebarProps {
  onLinkClick?: () => void;
}

const navGroups = [
  {
    label: "Dashboard",
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Active Orders", href: "/admin/active", icon: Truck },
      { label: "All Orders", href: "/admin/orders", icon: ClipboardList },
      { label: "Order History", href: "/admin/history", icon: History },
    ],
  },
  {
    label: "All Users",
    items: [
      { label: "Riders", href: "/admin/riders", icon: Users },
      { label: "Customers", href: "/admin/clients", icon: UserCircle },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Pricing Rules", href: "/admin/pricing", icon: DollarSign },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    ],
  },
];

export default function AdminSidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-64 bg-[#1e3a5f] h-screen flex flex-col overflow-hidden">
      <div className="px-6 py-6 border-b border-white/10 shrink-0">
        <Link href="/" className="font-bold text-xl text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-[#FF9B51] flex items-center justify-center text-white text-base font-black">
            A
          </span>
          Kukamoto
        </Link>
        <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30">
          Admin
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-widest text-white/50">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onLinkClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive(item.href)
                      ? "bg-[#FF9B51] text-white shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 bg-white/5 shrink-0">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-[#FF9B51] text-white flex items-center justify-center text-xs font-bold">
            {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-white/50 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold border border-white/20 hover:border-white/40 text-white/70 hover:text-white px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
