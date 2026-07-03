import { ComponentType } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm text-slate-400">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-[#25343F] mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="bg-[#25343F] hover:bg-[#FF9B51] text-white text-sm font-bold px-6 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="bg-[#25343F] hover:bg-[#FF9B51] text-white text-sm font-bold px-6 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
