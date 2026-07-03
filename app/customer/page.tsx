"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import StatCard from "@/components/customer/StatCard";
import QuickActionCard from "@/components/customer/QuickActionCard";
import DeliveryCard, { Delivery } from "@/components/customer/DeliveryCard";
import RecentDeliveriesTable from "@/components/customer/RecentDeliveriesTable";
import EmptyState from "@/components/customer/EmptyState";
import SectionHeader from "@/components/customer/SectionHeader";

import {
  Plus,
  Truck,
  CheckCircle2,
  Wallet,
  Coins,
  Package,
  MapPin,
  History,
  Settings,
  Bell,
  Inbox
} from "lucide-react";

// Greeting helper
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// --- Mock data (will be replaced by API calls) ---
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

const mockHistory = [
  {
    id: "DEL-002",
    packageName: "iPhone 13 Pro (Phone)",
    pickup: "Kigali Heights, Kigali",
    destination: "Nyamirambo, Kigali",
    date: "Jul 2, 2026",
    price: 3200,
    status: "delivered" as const,
  },
  {
    id: "DEL-003",
    packageName: "Corporate Contracts (Document)",
    pickup: "Kacyiru, Kigali",
    destination: "Kimironko, Kigali",
    date: "Jun 29, 2026",
    price: 1800,
    status: "delivered" as const,
  },
  {
    id: "DEL-004",
    packageName: "Fragile Electronics (Electronics)",
    pickup: "King Faisal Hospital",
    destination: "Kanombe, Kigali",
    date: "Jun 25, 2026",
    price: 2000,
    status: "cancelled" as const,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-5xl mx-auto">

      {/* ── Greeting Header ─────────────────────── */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs text-[#FF9B51] font-semibold uppercase tracking-widest mb-1">
            {getGreeting()}
          </p>
          <h1 className="text-3xl font-black text-[#25343F] tracking-tight leading-tight flex items-center gap-2">
            {user?.name?.split(" ")[0] ?? "Customer"}
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">Ready to send something across town today?</p>
        </div>
        <a
          href="/customer/new-delivery"
          className="inline-flex items-center gap-2 bg-[#FF9B51] hover:bg-[#e8883e] text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Delivery
        </a>
      </motion.div>

      {/* ── Stat Cards ──────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Deliveries"
          value={mockActiveDeliveries.length}
          icon={Truck}
          trend="1 in transit"
          trendType="positive"
        />
        <StatCard
          label="Completed"
          value={2}
          icon={CheckCircle2}
          trend="All time"
          trendType="positive"
        />
        <StatCard
          label="Total Spent"
          value="5,000 RWF"
          icon={Wallet}
          trend="This month"
          trendType="neutral"
        />
        <StatCard
          label="Wallet Balance"
          value="0 RWF"
          icon={Coins}
          trend="Top up"
          trendType="neutral"
        />
      </motion.div>

      {/* ── Quick Actions ───────────────────────── */}
      <motion.div variants={fadeUp}>
        <SectionHeader title="Quick Actions" description="Get things done fast." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickActionCard
            title="New Delivery"
            description="Book a rider and send a package anywhere in the city."
            icon={Package}
            href="/customer/new-delivery"
            primary
            badge="Go"
          />
          <QuickActionCard
            title="Track Package"
            description="See live location and status of your active deliveries."
            icon={MapPin}
            href="/customer/active"
          />
          <QuickActionCard
            title="Delivery History"
            description="Review all past deliveries, invoices and statuses."
            icon={History}
            href="/customer/history"
          />
          <QuickActionCard
            title="Manage Account"
            description="Update profile details, contact preferences, and settings."
            icon={Settings}
            href="/customer/settings"
          />
        </div>
      </motion.div>

      {/* ── Active Deliveries ───────────────────── */}
      <motion.div variants={fadeUp}>
        <SectionHeader
          title="Active Deliveries"
          description="Packages currently on the move."
          actionLabel="View all active"
          actionHref="/customer/active"
        />
        {mockActiveDeliveries.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {mockActiveDeliveries.map((d) => (
              <DeliveryCard key={d.id} delivery={d} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
            <EmptyState
              icon={Truck}
              title="No active deliveries"
              description="You haven't sent any packages yet. When you do, your active deliveries will show up here."
              actionLabel="Create Delivery"
              actionHref="/customer/new-delivery"
            />
          </div>
        )}
      </motion.div>

      {/* ── Recent History ──────────────────────── */}
      <motion.div variants={fadeUp}>
        <SectionHeader
          title="Recent Deliveries"
          description="Your last 5 completed or failed deliveries."
          actionLabel="See full history"
          actionHref="/customer/history"
        />
        {mockHistory.length > 0 ? (
          <RecentDeliveriesTable
            rows={mockHistory}
            showViewAll={mockHistory.length >= 3}
            onViewDetails={(id) => window.location.href = `/customer/history?id=${id}`}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
            <EmptyState
              icon={Inbox}
              title="No delivery history yet"
              description="When you complete your first delivery, it will appear here."
              actionLabel="Create Delivery"
              actionHref="/customer/new-delivery"
            />
          </div>
        )}
      </motion.div>

    </motion.div>
  );
}
