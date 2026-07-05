"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import SectionHeader from "@/components/customer/SectionHeader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { MapPin, CheckCircle2, Trash2, Upload } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [locationAddress, setLocationAddress] = useState("");
  const [streetCode, setStreetCode] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const profile = await api.getProfileDetails();
        if (profile) {
          setLocationAddress(profile.location_address ?? "");
          setStreetCode(profile.street_code ?? "");
          setImageUrl(profile.image_url ?? null);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const updated = await api.updateProfile({
        image: imageFile ?? undefined,
        location_address: locationAddress || undefined,
        street_code: streetCode || undefined,
      });
      setImageUrl(updated.image_url ?? null);
      setImageFile(null);
      setPreview(null);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteImage() {
    try {
      await api.deleteProfileImage();
      setImageUrl(null);
      setPreview(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  }

  const avatarSrc = preview ?? imageUrl;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <SectionHeader title="Account Settings" description="Manage your profile and preferences." />

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-bold text-[#25343F]">Profile Information</h3>

        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" className="w-16 h-16 rounded-3xl object-cover shadow-sm" />
            ) : (
              <div className="w-16 h-16 rounded-3xl bg-[#25343F] text-white font-black text-xl flex items-center justify-center shadow-sm">
                {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs font-bold text-[#FF9B51] border border-[#FF9B51]/30 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-[#FF9B51]/5"
            >
              <Upload className="w-3.5 h-3.5 inline mr-1" /> Upload Photo
            </button>
            {(avatarSrc || imageUrl) && (
              <button
                type="button"
                onClick={handleDeleteImage}
                className="text-xs font-bold text-red-500 border border-red-100 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Remove
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-[#25343F]">{user?.name}</p>
          <p className="text-xs text-slate-400">@{user?.username}</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">
            <MapPin className="w-3.5 h-3.5 inline mr-1" /> Location Address
          </label>
          <input
            type="text"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
            placeholder="Kigali, Rwanda"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">Street Code</label>
          <input
            type="text"
            value={streetCode}
            onChange={(e) => setStreetCode(e.target.value)}
            placeholder="KG 15 Ave"
            disabled={loading}
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
        </div>

        <button
          type="submit"
          disabled={saving || loading}
          className={`w-full py-3.5 font-bold text-sm rounded-2xl transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
            success ? "bg-emerald-500 text-white" : "bg-[#25343F] hover:bg-[#1a252d] text-white"
          }`}
        >
          {success ? (
            <><CheckCircle2 className="w-4 h-4" /> Saved!</>
          ) : saving ? (
            "Saving..."
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
