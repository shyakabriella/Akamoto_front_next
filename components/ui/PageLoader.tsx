"use client";

export default function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#EAEFEF] border-t-[#FF9B51] animate-spin" />
        <div className="absolute font-bold text-[10px] text-[#25343F]">A</div>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#25343F]/50">{label}</p>
    </div>
  );
}
