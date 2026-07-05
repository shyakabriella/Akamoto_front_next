"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminTopbar from "@/components/admin/Topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <div className="hidden md:block shrink-0">
          <AdminSidebar />
        </div>

        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full z-40 md:hidden">
              <AdminSidebar onLinkClick={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminTopbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
