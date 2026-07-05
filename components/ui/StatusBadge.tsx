const styles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-red-50 text-red-600 border-red-100",
  suspended: "bg-slate-100 text-slate-600 border-slate-200",
  online: "bg-emerald-50 text-emerald-700 border-emerald-100",
  offline: "bg-slate-100 text-slate-500 border-slate-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  inactive: "bg-slate-100 text-slate-500 border-slate-200",
  received: "bg-blue-50 text-blue-600 border-blue-100",
  requested: "bg-violet-50 text-violet-600 border-violet-100",
  searching: "bg-violet-50 text-violet-600 border-violet-100",
  accepted: "bg-indigo-50 text-indigo-600 border-indigo-100",
  on_the_way: "bg-sky-50 text-sky-600 border-sky-100",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  failed: "bg-red-50 text-red-600 border-red-100",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
  open: "bg-red-50 text-red-600 border-red-100",
  investigating: "bg-amber-50 text-amber-700 border-amber-100",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function StatusBadge({
  status,
  label,
}: {
  status: string;
  label?: string;
}) {
  const key = status.toLowerCase();
  return (
    <span
      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${
        styles[key] ?? "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {label ?? status.replace(/_/g, " ")}
    </span>
  );
}
