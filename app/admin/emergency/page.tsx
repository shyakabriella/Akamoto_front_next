"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MOCK_EMERGENCIES } from "@/lib/mock-admin-orders";
import { Phone, MapPin, CheckCircle2, AlertOctagon } from "lucide-react";

export default function AdminEmergencyPage() {
  const [alerts, setAlerts] = useState(MOCK_EMERGENCIES);

  function resolve(id: string) {
    setAlerts((a) => a.map((x) => (x.id === id ? { ...x, resolved: true } : x)));
  }

  const active = alerts.filter((a) => !a.resolved);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Page Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-gray-800">Emergency Calls</h1>
        <p className="text-gray-500 text-sm mt-1">Urgent alerts from riders or customers</p>
      </motion.div>

      {active.length > 0 && (
        <motion.div variants={fadeUp} className="bg-red-50 border-2 border-red-200 rounded-xl p-5 flex gap-4 animate-pulse">
          <AlertOctagon className="w-8 h-8 text-red-500 shrink-0" />
          <div>
            <p className="font-bold text-red-700">{active.length} active emergency alert{active.length > 1 ? "s" : ""}</p>
            <p className="text-sm text-red-600 mt-1">Respond immediately — call the contact below.</p>
          </div>
        </motion.div>
      )}

      {/* Emergency Alerts List */}
      <motion.div variants={fadeUp} className="space-y-4">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`rounded-xl border shadow-sm p-6 ${
              a.resolved ? "bg-gray-50 border-gray-200 opacity-70" : "bg-white border-red-200"
            }`}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-lg font-bold text-gray-800">{a.id}</p>
                <p className="text-xs text-gray-400 mt-0.5">Order {a.orderId} · {a.createdAt}</p>
              </div>
              {!a.resolved && (
                <span className="text-[10px] font-semibold uppercase bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
                  Active
                </span>
              )}
            </div>

            <p className="text-sm font-bold text-red-600 mt-4">{a.reason}</p>

            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-[#FF9B51]" />
                <a href={`tel:${a.phone}`} className="font-bold text-gray-800 hover:text-[#FF9B51]">
                  +{a.phone}
                </a>
                <span className="text-xs text-gray-400 capitalize">({a.callerRole})</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-[#FF9B51]" />
                {a.location}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">Caller: {a.callerName}</p>

            {!a.resolved ? (
              <div className="flex gap-3 mt-5">
                <a
                  href={`tel:${a.phone}`}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-5 py-3 rounded-lg"
                >
                  <Phone className="w-4 h-4" /> Call Now
                </a>
                <button
                  onClick={() => resolve(a.id)}
                  className="flex items-center gap-2 border border-gray-200 text-gray-800 font-semibold text-sm px-5 py-3 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                </button>
              </div>
            ) : (
              <p className="text-xs font-semibold text-green-600 mt-4 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
              </p>
            )}
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <p className="text-sm font-semibold text-gray-400">No emergency alerts</p>
          </div>
        )}
      </motion.div>

    </motion.div>
  );
}
