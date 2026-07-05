"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "For riders", href: "#for-riders" },
  { label: "Benefits", href: "#benefits" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#EAEFEF]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 font-bold text-xl text-[#25343F]"
        >
          Akamoto
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-sm text-[#25343F]/70 hover:text-[#25343F] transition-colors font-medium cursor-pointer"
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Desktop Authentication Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <Link
                href={`/${user.role}`}
                className="text-sm font-semibold border border-slate-200 text-[#25343F] px-4 py-2.5 rounded-xl hover:border-[#FF9B51] transition-colors"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-slate-500 hover:text-[#FF9B51] transition-colors px-4 py-2 cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[#25343F] hover:text-[#FF9B51] transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-[#25343F] text-white px-5 py-2.5 rounded-xl hover:bg-[#FF9B51] transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-[#25343F] transition-all ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#25343F] transition-all ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#25343F] transition-all ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#EAEFEF] overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className="text-sm font-medium text-[#25343F]/80 text-left cursor-pointer"
                >
                  {l.label}
                </button>
              ))}

              {/* Mobile Authentication Controls */}
              <div className="pt-3 border-t border-[#EAEFEF] flex flex-col gap-3">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href={`/${user.role}`}
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-semibold bg-[#25343F] text-white px-5 py-2.5 rounded-xl text-center"
                    >
                      Dashboard ({user.role})
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="text-sm font-medium text-[#25343F] text-left py-2 cursor-pointer"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-medium text-[#25343F] text-left"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-semibold bg-[#25343F] text-white px-5 py-2.5 rounded-xl text-center"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

