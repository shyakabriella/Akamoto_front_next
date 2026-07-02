import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="bg-[#25343F] rounded-3xl px-8 sm:px-16 py-16 text-center relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#FF9B51]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#BFC9D1]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <p className="text-sm font-semibold text-[#FF9B51] tracking-wide uppercase mb-4">
              Ready to start?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 max-w-lg mx-auto">
              Send your first package today
            </h2>
            <p className="text-white/60 mb-10 max-w-md mx-auto leading-relaxed">
              Customers and riders are already using Akamoto. Create an account in under a minute. No card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                id="cta-send-package"
                className="bg-[#FF9B51] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#f08a40] transition-colors text-sm text-center cursor-pointer"
              >
                Send a package
              </Link>
              <Link
                href="/register?role=rider"
                id="cta-become-rider"
                className="bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors text-sm border border-white/10 text-center cursor-pointer"
              >
                Become a rider
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
