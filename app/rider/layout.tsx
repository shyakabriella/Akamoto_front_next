"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import RiderSidebar from "@/components/rider/Sidebar";
import RiderTopbar from "@/components/rider/Topbar";

export default function RiderLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard allowedRoles={["rider"]}>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <div className="hidden md:block shrink-0">
          <RiderSidebar />
        </div>

        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full z-40 md:hidden">
              <RiderSidebar onLinkClick={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <RiderTopbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
