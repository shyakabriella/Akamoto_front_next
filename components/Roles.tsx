"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const customerFeatures = [
  "Enter pickup and drop-off in seconds",
  "See the price before you confirm",
  "Track your rider live on the map",
  "Get notified when your package arrives",
];

const riderFeatures = [
  "Choose your own hours, work when you want",
  "Receive delivery requests near your location",
  "Navigate directly to pickup and drop-off",
  "Track earnings and completed deliveries",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8l3.5 3.5L13 4.5"
        stroke="#FF9B51"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Roles() {
  return (
    <section id="for-riders" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-sm font-semibold text-[#FF9B51] tracking-wide uppercase mb-3">
            Who it&apos;s for
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#25343F] leading-tight mb-4">
            Built for both sides of every delivery
          </h2>
          <p className="text-[#25343F]/60 text-lg">
            Whether you need something sent or you want to earn by delivering, Akamoto works for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customers */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-[#25343F] rounded-2xl p-8 text-white"
          >
            <motion.div custom={0} variants={fadeUp}>
              <p className="text-xs font-semibold text-[#BFC9D1] uppercase tracking-wider mb-1">
                Customers
              </p>
              <h3 className="text-2xl font-bold mb-2">Send anything, anywhere in the city</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                Documents, parcels, groceries, a phone charger. If it fits on a bike, we can move it for you.
              </p>
            </motion.div>

            <ul className="space-y-3 mb-8">
              {customerFeatures.map((f, i) => (
                <motion.li
                  key={f}
                  custom={i + 1}
                  variants={fadeUp}
                  className="flex items-start gap-3 text-sm text-white/80"
                >
                  <span className="mt-0.5 shrink-0">
                    <CheckIcon />
                  </span>
                  {f}
                </motion.li>
              ))}
            </ul>

            <motion.div custom={5} variants={fadeUp}>
              <Link
                href="/register"
                className="inline-block text-sm font-semibold bg-[#FF9B51] text-white px-6 py-3 rounded-xl hover:bg-[#f08a40] transition-colors text-center"
              >
                Send a package
              </Link>
            </motion.div>
          </motion.div>

          {/* Riders */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-[#EAEFEF] rounded-2xl p-8"
          >
            <motion.div custom={0} variants={fadeUp}>
              <p className="text-xs font-semibold text-[#FF9B51] uppercase tracking-wider mb-1">
                Riders
              </p>
              <h3 className="text-2xl font-bold text-[#25343F] mb-2">
                Earn on your own schedule
              </h3>
              <p className="text-[#25343F]/60 text-sm leading-relaxed mb-8">
                Accept jobs close to you, deliver them, get paid. Simple as that.
              </p>
            </motion.div>

            <ul className="space-y-3 mb-8">
              {riderFeatures.map((f, i) => (
                <motion.li
                  key={f}
                  custom={i + 1}
                  variants={fadeUp}
                  className="flex items-start gap-3 text-sm text-[#25343F]/80"
                >
                  <span className="mt-0.5 shrink-0">
                    <CheckIcon />
                  </span>
                  {f}
                </motion.li>
              ))}
            </ul>

            <motion.div custom={5} variants={fadeUp}>
              <Link
                href="/register?role=rider"
                className="inline-block text-sm font-semibold bg-[#25343F] text-white px-6 py-3 rounded-xl hover:bg-[#FF9B51] transition-colors text-center"
              >
                Become a rider
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
