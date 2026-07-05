"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProfileModal from "@/components/ui/ProfileModal";
import { Menu, User } from "lucide-react";

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function RiderTopbar({ onMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Map path to title
  const getPageTitle = () => {
    switch (pathname) {
      case "/rider":
        return "Overview";
      case "/rider/profile":
        return "My Profile";
      case "/rider/status":
        return "Online Status";
      default:
        return "Rider Dashboard";
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

      {/* Right: Greeting, Earnings, Logout */}
      <div className="flex items-center gap-4">
        {/* Greeting & Earnings */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">
              Hello, {user?.name?.split(" ")[0] || "Rider"}
            </p>
            <p className="text-xs text-gray-500">Today's Earnings: <span className="font-bold text-[#FF9B51]">0 RWF</span></p>
          </div>
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
