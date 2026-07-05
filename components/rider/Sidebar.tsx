"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, UserCircle, Wifi, LogOut } from "lucide-react";

interface SidebarProps {
  onLinkClick?: () => void;
}

export default function RiderSidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const items = [
    { label: "Dashboard", href: "/rider", icon: LayoutDashboard },
    { label: "My Profile", href: "/rider/profile", icon: UserCircle },
    { label: "Online Status", href: "/rider/status", icon: Wifi },
  ];

  return (
    <aside className="w-64 bg-[#1e3a5f] h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" className="font-bold text-xl text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-[#FF9B51] flex items-center justify-center text-white text-base font-black">A</span>
          Akamoto
        </Link>
        <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-[#FF9B51] text-white px-2 py-0.5 rounded-full">Rider</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                active ? "bg-[#FF9B51] text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 bg-white/5">
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
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
