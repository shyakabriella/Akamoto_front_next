"use client";

import { DeliveryStatus } from "./DeliveryCard";

interface TimelineStep {
  status: DeliveryStatus;
  label: string;
  description: string;
  icon: string;
}

const steps: TimelineStep[] = [
  { status: "pending", label: "Request Placed", description: "Your delivery request has been submitted.", icon: "📋" },
  { status: "searching_rider", label: "Searching Rider", description: "Looking for a nearby available rider.", icon: "🔍" },
  { status: "rider_assigned", label: "Rider Assigned", description: "A rider has been matched to your order.", icon: "👤" },
  { status: "accepted", label: "Accepted", description: "Rider accepted and is heading to pickup.", icon: "✅" },
  { status: "arrived_at_pickup", label: "Arrived at Pickup", description: "Rider is at the pickup location.", icon: "📍" },
  { status: "picked_up", label: "Package Picked Up", description: "Rider has collected the package.", icon: "📦" },
  { status: "on_the_way", label: "On The Way", description: "Package is in transit to the destination.", icon: "🚴" },
  { status: "delivered", label: "Delivered", description: "Package delivered successfully.", icon: "🎉" },
];

const statusOrder: DeliveryStatus[] = [
  "pending", "searching_rider", "rider_assigned", "accepted",
  "arrived_at_pickup", "picked_up", "on_the_way", "delivered",
];

interface DeliveryTimelineProps {
  currentStatus: DeliveryStatus;
}

export default function DeliveryTimeline({ currentStatus }: DeliveryTimelineProps) {
  const isTerminal = currentStatus === "cancelled" || currentStatus === "failed";
  const currentIndex = statusOrder.indexOf(currentStatus);

  if (isTerminal) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
        <p className="text-2xl mb-2">{currentStatus === "cancelled" ? "❌" : "⚠️"}</p>
        <p className="text-sm font-bold text-red-600 capitalize">Delivery {currentStatus}</p>
        <p className="text-xs text-red-400 mt-1">This delivery was {currentStatus}. Please contact support if you need help.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step.status} className="flex gap-4 items-start">
            {/* Icon & connector */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 border-2 transition-all ${
                  isDone
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                    : isCurrent
                    ? "bg-[#25343F] border-[#25343F] text-white shadow-md scale-105"
                    : "bg-white border-slate-200 text-slate-300"
                }`}
              >
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className={isPending ? "opacity-40" : ""}>{step.icon}</span>
                )}
              </div>
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className={`w-px h-8 mt-1 ${isDone ? "bg-emerald-200" : "bg-slate-100"}`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-6 ${index < steps.length - 1 ? "" : ""}`}>
              <p className={`text-sm font-bold leading-none mb-1 ${
                isDone ? "text-emerald-600" : isCurrent ? "text-[#25343F]" : "text-slate-300"
              }`}>
                {step.label}
              </p>
              <p className={`text-xs leading-relaxed ${
                isCurrent ? "text-slate-500" : "text-slate-300"
              }`}>
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
