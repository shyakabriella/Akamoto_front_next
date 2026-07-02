"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How is the delivery price calculated?",
    a: "The price is based on the distance between the pickup and drop-off locations. You see the estimated cost before you confirm the request, so there are no surprises.",
  },
  {
    q: "How long does a delivery take?",
    a: "Most deliveries within a city are completed within 30 to 60 minutes, depending on distance and rider availability. You can track your delivery live from the moment a rider accepts.",
  },
  {
    q: "What can I send with Akamoto?",
    a: "Anything that fits on a motorcycle or bicycle: documents, small parcels, personal items, packaged food, medication from a pharmacy, and more. We focus on same-city, everyday deliveries.",
  },
  {
    q: "How do I become a rider?",
    a: "Apply through the Akamoto rider app. Our team reviews your application and verifies your details before approving you. Once approved, you can start accepting deliveries immediately.",
  },
  {
    q: "What happens if a delivery goes wrong?",
    a: "Our support team handles disputes directly. Riders are tracked throughout each delivery, and every transaction is recorded, so we can review exactly what happened and resolve it quickly.",
  },
];

function FAQItem({ item }: { item: (typeof faqs)[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#EAEFEF] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group cursor-pointer"
      >
        <span className="font-medium text-[#25343F] group-hover:text-[#FF9B51] transition-colors text-sm sm:text-base">
          {item.q}
        </span>
        <span
          className={`shrink-0 w-6 h-6 rounded-full border border-[#BFC9D1] flex items-center justify-center text-[#25343F] transition-transform ${
            open ? "rotate-45" : ""
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#25343F]/60 leading-relaxed pb-5 pr-10">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#EAEFEF]/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-16 items-start">
          <div>
            <p className="text-sm font-semibold text-[#FF9B51] tracking-wide uppercase mb-3">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#25343F] leading-tight mb-4">
              Common questions
            </h2>
            <p className="text-[#25343F]/60 leading-relaxed">
              Anything else? Reach us at{" "}
              <a
                href="mailto:fabrice@akamoto.com"
                className="text-[#FF9B51] hover:underline"
              >
                fabrice@akamoto.com
              </a>
            </p>
          </div>

          <div>
            {faqs.map((item) => (
              <FAQItem key={item.q} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
