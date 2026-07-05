"use client";

import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Live delivery tracking",
    body: "Watch your package move in real time on a map. No need to call the rider or guess where it is.",
  },
  {
    number: "02",
    title: "Price shown before you commit",
    body: "You see the delivery cost before confirming the request. What you see is what you pay.",
  },
  {
    number: "03",
    title: "Nearby rider matching",
    body: "The platform finds available riders close to your pickup point, so wait times stay short.",
  },
  {
    number: "04",
    title: "Delivery status updates",
    body: "Get notified when a rider accepts, when they arrive at pickup, and when your package is delivered.",
  },
  {
    number: "05",
    title: "Rider earnings dashboard",
    body: "Riders can see completed deliveries, earnings per trip, and weekly totals, all in one place.",
  },
  {
    number: "06",
    title: "Verified riders only",
    body: "Every rider on the platform is reviewed and approved before they can accept deliveries.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-[#EAEFEF]/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-sm font-semibold text-[#FF9B51] tracking-wide uppercase mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#25343F] leading-tight">
            Built for real city deliveries
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div key={f.number} variants={item}>
              <div className="bg-white rounded-2xl p-6 h-full border border-transparent hover:border-[#BFC9D1] transition-colors group">
                <span className="text-xs font-bold text-[#BFC9D1] tracking-wider mb-4 block">
                  {f.number}
                </span>
                <h3 className="font-semibold text-[#25343F] mb-2 group-hover:text-[#FF9B51] transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-[#25343F]/60 leading-relaxed">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
