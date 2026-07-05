"use client";

import { motion } from "framer-motion";
import { getOrderHistory } from "@/lib/mock-admin-orders";
import OrdersTable from "@/components/admin/OrdersTable";

export default function AdminHistoryPage() {
  const history = getOrderHistory();

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
        <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
        <p className="text-gray-500 text-sm mt-1">Completed, failed, and cancelled orders</p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <OrdersTable orders={history} showAudit />
      </motion.div>

    </motion.div>
  );
}
