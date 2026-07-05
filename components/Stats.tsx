"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10k+", label: "Deliveries completed" },
  { value: "500+", label: "Active riders" },
  { value: "4.9", label: "Customer rating" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Stats() {
  return (
    <section className="border-y border-[#EAEFEF] bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={item} className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-[#25343F] tracking-tight mb-1">
                {s.value}
              </p>
              <p className="text-sm text-[#25343F]/50 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
