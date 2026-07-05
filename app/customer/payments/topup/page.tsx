"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import PageLoader from "@/components/ui/PageLoader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import SectionHeader from "@/components/customer/SectionHeader";
import { Smartphone, Banknote, CreditCard, CheckCircle2 } from "lucide-react";

const paymentMethods = [
  { id: "mobile_money", label: "Mobile Money", icon: Smartphone },
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "card", label: "Card", icon: CreditCard },
];

const presetAmounts = [1000, 2000, 5000, 10000, 20000];

export default function TopUpPage() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("mobile_money");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.topUpWallet({
        amount: parseFloat(amount),
        method: method as any,
        transaction_id: transactionId || undefined,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to top up wallet");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center flex flex-col items-center justify-center"
        >
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-5" />
          <h2 className="text-2xl font-bold text-[#25343F] mb-2">Top Up Successful!</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Your wallet has been topped up with {parseInt(amount).toLocaleString()} RWF.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setAmount("");
              setTransactionId("");
            }}
            className="text-sm font-bold text-[#25343F] border border-slate-200 hover:border-[#25343F] px-6 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Top Up Again
          </button>
        </motion.div>
      </div>
    );
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl mx-auto space-y-6">
      <SectionHeader title="Top Up Wallet" description="Add funds to your Akamoto wallet for quick payments." />

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
        <form onSubmit={handleSubmit}>
          {/* Payment Method Selection */}
          <div>
            <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-3">Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((pm) => {
                const IconComp = pm.icon;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setMethod(pm.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      method === pm.id
                        ? "border-[#FF9B51] bg-[#FF9B51]/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <IconComp className={`w-6 h-6 ${method === pm.id ? "text-[#FF9B51]" : "text-slate-400"}`} />
                    <span className={`text-xs font-semibold ${method === pm.id ? "text-[#25343F]" : "text-slate-500"}`}>
                      {pm.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-3">Amount (RWF)</label>
            <input
              type="number"
              required
              min="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all"
            />
            <div className="flex gap-2 mt-3">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toString())}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-[#FF9B51] hover:text-[#FF9B51] transition-colors cursor-pointer"
                >
                  {preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction ID (for mobile money) */}
          {method === "mobile_money" && (
            <div>
              <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-3">
                Transaction ID <span className="text-slate-400 font-normal normal-case">(from your mobile money app)</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. TXN123456789"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FF9B51] hover:bg-[#e8883e] text-white font-bold text-sm rounded-2xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? "Processing..." : `Top Up ${amount ? parseInt(amount).toLocaleString() : ""} RWF`}
          </button>
        </form>

        {/* Info Box */}
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>Note:</strong> For mobile money payments, complete the transaction on your phone first, then enter the transaction ID above. For cash payments, visit any Akamoto agent location.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
