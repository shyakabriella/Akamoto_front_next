import { ComponentType } from "react";
import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
  primary?: boolean;
  badge?: string;
}

export default function QuickActionCard({ title, description, icon: Icon, href, primary, badge }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={`group flex items-start gap-4 p-5 rounded-3xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        primary
          ? "bg-[#25343F] border-[#25343F] text-white"
          : "bg-white border-slate-100 text-[#25343F] hover:border-[#25343F]/20"
      }`}
    >
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
          primary ? "bg-white/10 text-white" : "bg-slate-50 border border-slate-100 text-[#25343F]/80"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`text-sm font-bold ${primary ? "text-white" : "text-[#25343F]"}`}>{title}</h3>
          {badge && (
            <span className="text-[9px] font-bold bg-[#FF9B51] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">
              {badge}
            </span>
          )}
        </div>
        <p className={`text-xs leading-relaxed ${primary ? "text-white/70" : "text-slate-400"}`}>{description}</p>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className={`mt-1 shrink-0 transition-transform group-hover:translate-x-0.5 ${primary ? "text-white/50" : "text-slate-300"}`}
      >
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
