"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import SectionHeader from "@/components/customer/SectionHeader";

import { MapPin } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <SectionHeader title="Account Settings" description="Manage your profile and preferences." />

      {/* Profile Details */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-bold text-[#25343F]">Profile Information</h3>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-[#25343F] text-white font-black text-xl flex items-center justify-center shadow-sm">
            {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
          </div>
          <div>
            <p className="text-sm font-bold text-[#25343F]">{user?.name}</p>
            <p className="text-xs text-slate-400">@{user?.username}</p>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full capitalize">
              {user?.role} account
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">Phone Number</label>
          <input
            type="text"
            value={`+${user?.phone}`}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-slate-100 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
          />
          <p className="text-[10px] text-slate-400 mt-1">Phone number cannot be changed. Contact support if needed.</p>
        </div>

        <button
          type="submit"
          className={`w-full py-3.5 font-bold text-sm rounded-2xl transition-all shadow-sm cursor-pointer ${
            saved ? "bg-emerald-500 text-white" : "bg-[#25343F] hover:bg-[#1a252d] text-white"
          }`}
        >
          {saved ? "✓ Changes Saved!" : "Save Changes"}
        </button>
      </form>

      {/* Saved Addresses (Placeholder) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-bold text-[#25343F] mb-1">Saved Addresses</h3>
        <p className="text-xs text-slate-400 mb-4">Save frequently used pickup or drop-off addresses.</p>
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
          <MapPin className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-400">No saved addresses yet</p>
          <p className="text-xs text-slate-300 mt-1">This feature is coming soon.</p>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-bold text-[#25343F] mb-4">Security</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-slate-50">
            <div>
              <p className="text-sm font-semibold text-[#25343F]">Password</p>
              <p className="text-xs text-slate-400">Change your auto-generated password</p>
            </div>
            <button className="text-xs font-bold text-[#FF9B51] hover:underline cursor-pointer">Change →</button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-[#25343F]">Account Status</p>
              <p className="text-xs text-slate-400">Your account is active and verified</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
