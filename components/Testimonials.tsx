"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "I sent my laptop charger across town during a meeting. The rider arrived at my office before the next break. I didn't even have to step outside.",
    name: "Amara K.",
    role: "Marketing lead, Kigali",
  },
  {
    quote:
      "I use Akamoto three or four times a week for business documents. Knowing exactly where the package is makes it so much easier to plan around.",
    name: "Patrick N.",
    role: "Small business owner",
  },
  {
    quote:
      "I ride in the mornings before my afternoon job. The earnings dashboard is clean, and I always know what I made at the end of a session.",
    name: "Jean B.",
    role: "Rider, Akamoto",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-sm font-semibold text-[#FF9B51] tracking-wide uppercase mb-3">
            What people say
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#25343F] leading-tight">
            Real experiences from early users
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={item}>
              <div className="bg-[#EAEFEF]/50 rounded-2xl p-7 h-full border border-[#EAEFEF] flex flex-col">
                <p className="text-[#25343F]/80 text-sm leading-relaxed flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-[#25343F] text-sm">{t.name}</p>
                  <p className="text-xs text-[#25343F]/50 mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
