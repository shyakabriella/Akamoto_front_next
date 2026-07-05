"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Create account & login",
    body: "Register with your phone number, save your credentials, and sign in to your dashboard.",
  },
  {
    number: "02",
    title: "Fill order details",
    body: "Describe your package — item type, value, photos, and receiver contact information.",
  },
  {
    number: "03",
    title: "Set pickup & destination",
    body: "Search and select where the rider collects the item and where it must be delivered.",
  },
  {
    number: "04",
    title: "Select the nearest rider",
    body: "Review nearby available riders by distance and rating, or let Akamoto auto-assign the closest one.",
  },
  {
    number: "05",
    title: "Choose who pays",
    body: "Decide whether the sender or receiver pays — via mobile money, cash, or wallet.",
  },
  {
    number: "06",
    title: "Track it live",
    body: "Follow your delivery on a live map from pickup to drop-off until it arrives safely.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-[#EAEFEF]/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-[#FF9B51] tracking-wide uppercase mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#25343F] leading-tight mb-4">
            From sign-up to doorstep in six steps
          </h2>
          <p className="text-[#25343F]/60 text-lg leading-relaxed">
            Create your account, place an order, pick a rider, set who pays — then track every move until delivery.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={item}>
              <div className="bg-white rounded-2xl p-6 h-full border border-[#EAEFEF] hover:border-[#FF9B51]/40 hover:shadow-md transition-all">
                <span className="text-4xl font-black text-[#FF9B51]/25 leading-none block mb-4">
                  {step.number}
                </span>
                <h3 className="font-bold text-[#25343F] mb-2 leading-snug">{step.title}</h3>
                <p className="text-sm text-[#25343F]/60 leading-relaxed">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
