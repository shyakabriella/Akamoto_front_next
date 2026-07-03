"use client";

import { useState } from "react";
import DeliveryCard, { Delivery } from "@/components/customer/DeliveryCard";
import DeliveryTimeline from "@/components/customer/DeliveryTimeline";
import EmptyState from "@/components/customer/EmptyState";
import SectionHeader from "@/components/customer/SectionHeader";
import { motion } from "framer-motion";
import { Truck, Map, Phone } from "lucide-react";

const mockActiveDeliveries: Delivery[] = [
  {
    id: "DEL-001",
    packageName: "HP EliteBook 840 (Laptop)",
    pickupAddress: "Nyabugogo Bus Terminal, Kigali",
    dropoffAddress: "Remera Giporoso, Kigali",
    status: "on_the_way",
    riderName: "Eric Manzi",
    riderPhone: "+250788001122",
    estimatedArrival: "~12 min",
    price: 2400,
    createdAt: "Today, 14:30",
  },
];

export default function ActiveDeliveriesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(
    mockActiveDeliveries[0]?.id ?? null
  );

  const selectedDelivery = mockActiveDeliveries.find((d) => d.id === selectedId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <SectionHeader
        title="Active Deliveries"
        description="Track your packages in real time."
        actionLabel="New Delivery"
        actionHref="/customer/new-delivery"
      />

      {mockActiveDeliveries.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
          <EmptyState
            icon={Truck}
            title="No active deliveries"
            description="You don't have any packages currently in transit. When you send a delivery, it will appear here with live tracking."
            actionLabel="Send a Package"
            actionHref="/customer/new-delivery"
          />
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6 items-start">
          {/* Delivery List */}
          <div className="lg:col-span-2 space-y-4">
            {mockActiveDeliveries.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                className={`cursor-pointer transition-all rounded-3xl ${
                  selectedId === d.id ? "ring-2 ring-[#25343F]" : "opacity-80 hover:opacity-100"
                }`}
              >
                <DeliveryCard delivery={d} />
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {selectedDelivery && (
            <motion.div
              key={selectedDelivery.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 space-y-5"
            >
              {/* Map Placeholder */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-slate-100 to-[#EAEFEF] h-52 flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm text-slate-500">
                    <Map className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#25343F]">Live Map Coming Soon</p>
                    <p className="text-xs text-slate-400 mt-1">Real-time GPS tracking will be displayed here.</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-600">
                      Rider is {selectedDelivery.estimatedArrival} away
                    </span>
                  </div>
                  <a
                    href={`tel:${selectedDelivery.riderPhone}`}
                    className="text-xs font-bold text-[#FF9B51] hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Rider
                  </a>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-[#25343F] mb-5">Delivery Progress</h3>
                <DeliveryTimeline currentStatus={selectedDelivery.status} />
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
