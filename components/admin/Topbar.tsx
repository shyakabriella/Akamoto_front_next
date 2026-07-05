"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProfileModal from "@/components/ui/ProfileModal";
import { Menu, LogOut, Search, Bell, Plus, ChevronDown, User } from "lucide-react";

interface AdminTopbarProps {
  onMenuToggle?: () => void;
}

export default function AdminTopbar({ onMenuToggle }: AdminTopbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Map path to title
  const getPageTitle = () => {
    switch (pathname) {
      case "/admin":
        return "Overview";
      case "/admin/orders":
        return "All Orders";
      case "/admin/active":
        return "Active Orders";
      case "/admin/history":
        return "Order History";
      case "/admin/riders":
        return "Riders";
      case "/admin/clients":
        return "Customers";
      case "/admin/disputes":
        return "Disputes";
      case "/admin/emergency":
        return "Emergency";
      case "/admin/pricing":
        return "Pricing Rules";
      case "/admin/analytics":
        return "Analytics";
      default:
        return "Admin Dashboard";
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

      {/* Right: Search, Notifications, Quick Actions, Logout */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="hidden lg:flex items-center">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders, riders, clients..."
              className="pl-9 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent"
            />
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Quick Actions <ChevronDown className="w-3 h-3" />
          </button>
          {showQuickActions && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              <a href="/admin/riders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">View Riders</a>
              <a href="/admin/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">New Pricing Rule</a>
            </div>
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
