import { ComponentType } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
}

export default function StatCard({ label, value, icon: Icon, trend, trendType = "neutral" }: StatCardProps) {
  const getTrendColor = () => {
    switch (trendType) {
      case "positive":
        return "text-emerald-600 bg-emerald-50";
      case "negative":
        return "text-red-500 bg-red-50";
      default:
        return "text-slate-500 bg-slate-50";
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md duration-200">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          {label}
        </span>
        <div className="text-2xl font-black text-[#25343F] leading-none tracking-tight">
          {value}
        </div>
        {trend && (
          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${getTrendColor()}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-2xl border border-slate-100 select-none text-[#25343F]/80">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
