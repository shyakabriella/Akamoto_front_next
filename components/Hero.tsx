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
            <p className="text-sm font-semibold text-[#FF9B51] mb-6">
              Available in your area 
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
            Akamoto connects you with nearby riders for fast, affordable local deliveries.
            Enter a pickup, enter a destination. A rider is already on the way.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              id="hero-cta-send"
              className="bg-[#25343F] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#FF9B51] transition-colors text-sm text-center"
            >
              Send a package
            </Link>
            <button
              id="hero-cta-how"
              onClick={() => scrollTo("#how-it-works")}
              className="bg-transparent border border-[#BFC9D1] text-[#25343F] font-semibold px-8 py-4 rounded-xl hover:border-[#25343F] transition-colors text-sm cursor-pointer"
            >
              See how it works
            </button>
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
          className="hidden lg:flex justify-center items-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#FF9B51]/10 rounded-3xl blur-2xl scale-110 pointer-events-none" />
            <Image
              src="/hero-mockup.png"
              alt="Akamoto delivery tracking card"
              width={480}
              height={480}
              className="relative rounded-3xl drop-shadow-2xl"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
