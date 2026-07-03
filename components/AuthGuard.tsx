"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: Array<"customer" | "rider" | "admin">;
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user && user.role && !allowedRoles.includes(user.role)) {
        // Only redirect if we have a valid, non-empty role to avoid /undefined
        const validRoles: Array<"customer" | "rider" | "admin"> = ["customer", "rider", "admin"];
        if (validRoles.includes(user.role)) {
          router.push(`/${user.role}`);
        }
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#EAEFEF] border-t-[#FF9B51] animate-spin" />
          <div className="absolute font-bold text-xs text-[#25343F]">A</div>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#25343F]/50">
          Loading Akamoto...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    // Return null to avoid rendering children while redirecting in useEffect
    return null;
  }

  return <>{children}</>;
}
