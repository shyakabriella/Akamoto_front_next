"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import ProfileModal from "@/components/ui/ProfileModal";

import { Menu, Bell, User } from "lucide-react";

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

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
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20 select-none">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
          aria-label="Toggle Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-800 tracking-tight">{getPageTitle()}</h1>
      </div>

      {/* Right: Greeting, Balance, Top Up, Logout */}
      <div className="flex items-center gap-4">
        {/* Greeting & Balance */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">
              Hello, {user?.name?.split(" ")[0] || "Customer"}
            </p>
            <p className="text-xs text-gray-500">Balance: <span className="font-bold text-[#FF9B51]">0 RWF</span></p>
          </div>
          <button className="bg-[#FF9B51] hover:bg-[#e8883e] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer">
            Top Up
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all relative cursor-pointer"
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

        {/* Profile Button */}
        <button
          onClick={() => setShowProfileModal(true)}
          className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <User className="w-4 h-4" /> Profile
        </button>
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </header>
  );
}
