"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

import { Menu, Bell, LogOut } from "lucide-react";

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Map path to title
  const getPageTitle = () => {
    switch (pathname) {
      case "/customer":
        return "Overview";
      case "/customer/new-delivery":
        return "New Delivery Request";
      case "/customer/active":
        return "Active tracking";
      case "/customer/history":
        return "Delivery History";
      case "/customer/notifications":
        return "Notifications";
      case "/customer/settings":
        return "Account Settings";
      default:
        return "Customer Center";
    }
  };

  return (
    <header className="bg-white border-b border-[#EAEFEF] h-16 flex items-center justify-between px-6 sticky top-0 z-20 select-none">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 text-[#25343F]/70 hover:bg-slate-50 rounded-xl cursor-pointer"
          aria-label="Toggle Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-[#25343F] tracking-tight">{getPageTitle()}</h1>
      </div>

      {/* Right: Actions (Notification & User Profile) */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-slate-50 hover:bg-[#25343F]/5 text-[#25343F]/75 rounded-2xl transition-all relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {/* Pulsing Alert Badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF9B51] rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-slate-100"
          >
            <div className="w-8 h-8 rounded-xl bg-[#25343F] text-white flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "C"}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#25343F]">{user?.name?.split(" ")[0]}</span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">Active</span>
            </div>
          </button>

          {showProfileMenu && (
            <>
              {/* Overlay backdrop to close */}
              <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-40 animate-in fade-in-50 slide-in-from-top-3 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-[#25343F] truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer mt-1.5"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
