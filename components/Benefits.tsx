"use client";

import { motion } from "framer-motion";
import { Package, Clock, Shield, MapPin } from "lucide-react";

const benefits = [
  {
    icon: Package,
    title: "Send anything",
    description: "Documents, parcels, groceries, or electronics. If it fits on a bike, we can move it for you.",
  },
  {
    icon: Clock,
    title: "Fast delivery",
    description: "Average pickup time of 15 minutes. Get your items across town quickly and reliably.",
  },
  {
    icon: Shield,
    title: "Trusted riders",
    description: "Every rider is verified and approved before they can accept deliveries for your safety.",
  },
  {
    icon: MapPin,
    title: "Live tracking",
    description: "Follow your package in real time from pickup to drop-off until it arrives safely.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-sm font-semibold text-[#FF9B51] tracking-wide uppercase mb-3">
            Why choose us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#25343F] leading-tight">
            Built for real city deliveries
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {benefits.map((benefit, i) => (
            <motion.div key={i} variants={item}>
              <div className="bg-[#EAEFEF]/50 rounded-2xl p-8 h-full border border-[#EAEFEF] flex gap-5">
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-[#FF9B51]/10 flex items-center justify-center">
                    <benefit.icon className="w-7 h-7 text-[#FF9B51]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#25343F] mb-2">{benefit.title}</h3>
                  <p className="text-sm text-[#25343F]/70 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
