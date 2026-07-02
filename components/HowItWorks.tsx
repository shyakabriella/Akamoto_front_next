"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Enter pickup and destination",
    body: "Tell us where you need the package collected and where it needs to go. Takes about 30 seconds.",
  },
  {
    number: "02",
    title: "See your price upfront",
    body: "You get an estimated delivery price before committing. No surprises, no hidden fees.",
  },
  {
    number: "03",
    title: "A nearby rider accepts",
    body: "Available riders in your area receive the request. One accepts and heads to your pickup location.",
  },
  {
    number: "04",
    title: "Track it live until delivered",
    body: "Watch your delivery move on a live map. You know exactly where your package is, every step of the way.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-[#EAEFEF]/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-xl mb-16">
          <p className="text-sm font-semibold text-[#FF9B51] tracking-wide uppercase mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#25343F] leading-tight mb-4">
            From request to doorstep in four steps
          </h2>
          <p className="text-[#25343F]/60 text-lg leading-relaxed">
            If you&apos;ve ever ordered food online, you already know how to use Akamoto.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={item}>
              <div className="bg-white rounded-2xl p-6 h-full border border-[#EAEFEF] hover:border-[#BFC9D1] transition-colors">
                <span className="text-4xl font-black text-[#EAEFEF] leading-none block mb-4">
                  {step.number}
                </span>
                <h3 className="font-semibold text-[#25343F] mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-[#25343F]/60 leading-relaxed">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
