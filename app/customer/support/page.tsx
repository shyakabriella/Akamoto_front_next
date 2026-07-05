"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import SectionHeader from "@/components/customer/SectionHeader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { Mail, Phone, Clock, CheckCircle2 } from "lucide-react";

const issueTypes = [
  "Late delivery",
  "Package damaged",
  "Wrong delivery address",
  "Rider was unprofessional",
  "Payment issue",
  "Other",
];

export default function SupportPage() {
  const [issueType, setIssueType] = useState("");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.createDispute({
        order_id: parseInt(orderId) || 0,
        type: issueType,
        description: message,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit support request");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center flex flex-col items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-5" />
          <h2 className="text-xl font-bold text-[#25343F] mb-2">Support Request Sent</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Our team has received your ticket and will respond within 24 hours. You can also
            contact us at <span className="font-semibold text-[#FF9B51]">support@akamoto.rw</span>.
          </p>
          <button
            onClick={() => { setSubmitted(false); setMessage(""); setOrderId(""); setIssueType(""); }}
            className="text-sm font-bold text-[#25343F] border border-slate-200 hover:border-[#25343F] px-6 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  const contactMethods = [
    { icon: Mail, label: "Email", value: "support@akamoto.rw" },
    { icon: Phone, label: "Phone", value: "+250 788 000 000" },
    { icon: Clock, label: "Response Time", value: "Within 24 hours" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader title="Customer Support" description="Experiencing an issue? We're here to help." />

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {/* Contact Methods */}
      <div className="grid sm:grid-cols-3 gap-3">
        {contactMethods.map((c) => {
          const IconComp = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center flex flex-col items-center justify-center">
              <IconComp className="w-6 h-6 text-[#FF9B51] mb-2" />
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{c.label}</p>
              <p className="text-xs font-bold text-[#25343F] mt-0.5">{c.value}</p>
            </div>
          );
        })}
      </div>

      {/* Support Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#25343F]">Submit a Support Ticket</h3>

        <div>
          <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">Issue Type</label>
          <select
            required
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all cursor-pointer"
          >
            <option value="">Select an issue type</option>
            {issueTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">
            Order ID <span className="text-slate-400 font-normal normal-case">(optional)</span>
          </label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. 123"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">Describe Your Issue</label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please describe what happened in as much detail as possible..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#25343F] hover:bg-[#1a252d] text-white font-bold text-sm rounded-2xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Support Request"}
        </button>
      </form>
    </div>
  );
}
