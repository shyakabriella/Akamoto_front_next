"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};



export default function Hero() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#EAEFEF]/30 to-white pointer-events-none" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#FF9B51]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#BFC9D1]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left: copy */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-xl"
        >
          <motion.div variants={fadeUp}>
            <p className="text-sm font-semibold text-[#FF9B51] mb-6 tracking-wide">
              Akamoto available in your area
            </p>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#25343F] leading-[1.05] tracking-tight mb-6"
          >
            Send it across{" "}
            <span className="text-[#FF9B51]">town.</span>
            <br />
            In minutes.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg text-[#25343F]/60 leading-relaxed mb-10 max-w-md"
          >
            Connect with nearby riders for fast, affordable local deliveries.
            Enter a pickup, enter a destination. A rider is already on the way.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(255, 155, 81, 0.4)",
                  "0 0 0 20px rgba(255, 155, 81, 0)",
                  "0 0 0 0 rgba(255, 155, 81, 0)"
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <Link
                href="/register"
                id="hero-cta-send"
                className="group relative inline-flex items-center justify-center gap-2 bg-[#FF9B51] text-white font-bold px-10 py-5 rounded-2xl text-base sm:text-lg text-center shadow-xl shadow-[#FF9B51]/35 hover:bg-[#e8883e] hover:shadow-[#FF9B51]/50 hover:-translate-y-0.5 transition-all duration-200 ring-4 ring-[#FF9B51]/20"
              >
                <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="relative">Send a Package Now</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex items-center gap-6 text-sm text-[#25343F]/50"
          >
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 4.5" stroke="#FF9B51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              No subscription
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 4.5" stroke="#FF9B51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Pay per delivery
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 4.5" stroke="#FF9B51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Live tracking
            </span>
          </motion.div>
        </motion.div>

        {/* Right: app mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="flex justify-center items-center lg:justify-end"
        >
          <div className="relative w-full max-w-[800px]">
            <div className="absolute -inset-8 bg-[#FF9B51]/15 rounded-[2rem] blur-3xl pointer-events-none" />
            <Image
              src="/hero-mockup.png"
              alt="Delivery tracking card"
              width={800}
              height={800}
              className="relative w-full h-auto rounded-3xl drop-shadow-2xl scale-125"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
