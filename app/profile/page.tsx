"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { VehicleType } from "@/lib/types";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { User, Mail, Phone, MapPin, Bike, Camera, Save, X } from "lucide-react";

const VEHICLE_TYPES: VehicleType[] = ["moto", "bicycle", "car", "van"];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // User profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [streetCode, setStreetCode] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Rider-specific fields
  const [vehicleType, setVehicleType] = useState<VehicleType>("moto");
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("");

  const isRider = user?.role === "rider";

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const profile = await api.getProfile();
        if (profile) {
          setName(profile.user?.name || "");
          setEmail(profile.user?.email || "");
          setPhone(profile.user?.phone || "");
          setLocationAddress(profile.location_address || "");
          setStreetCode(profile.street_code || "");
          setImageUrl(profile.image_url || null);

          if (isRider && profile.vehicle_type) {
            setVehicleType(profile.vehicle_type);
            setVehiclePlateNumber(profile.vehicle_plate_number || "");
            setVehicleColor(profile.vehicle_color || "");
            setNationalId(profile.national_id || "");
            setDrivingLicenseNumber(profile.driving_license_number || "");
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadProfile();
    }
  }, [user, isRider]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Update basic profile
      await api.updateProfile({
        location_address: locationAddress,
        street_code: streetCode,
      });

      // Update rider profile if applicable
      if (isRider) {
        await api.updateRiderProfile({
          vehicle_type: vehicleType,
          vehicle_plate_number: vehiclePlateNumber,
          vehicle_color: vehicleColor,
          national_id: nationalId,
          driving_license_number: drivingLicenseNumber,
        });
      }

      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteImage() {
    try {
      await api.deleteProfileImage();
      setImageUrl(null);
      setSuccess("Profile image deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete profile image");
    }
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9B51]"></div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto py-8 space-y-6">

      {/* Page Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account information</p>
      </motion.div>

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}
      {success && (
        <motion.div variants={fadeUp} className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          {success}
        </motion.div>
      )}

      {/* Profile Form */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSaveProfile} className="space-y-6">

          {/* Profile Image Section */}
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Profile Photo</h3>
              <p className="text-xs text-gray-500 mb-3">Upload a profile picture to personalize your account</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                <Camera className="w-4 h-4" />
                Upload Photo
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent bg-gray-50"
                  disabled
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent bg-gray-50"
                  disabled
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent bg-gray-50"
                  disabled
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Location Address</label>
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Street Code</label>
                <input
                  type="text"
                  value={streetCode}
                  onChange={(e) => setStreetCode(e.target.value)}
                  placeholder="Enter street code"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Rider-specific fields */}
          {isRider && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Bike className="w-4 h-4" />
                Vehicle Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent bg-white capitalize cursor-pointer"
                  >
                    {VEHICLE_TYPES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Plate Number</label>
                  <input
                    type="text"
                    value={vehiclePlateNumber}
                    onChange={(e) => setVehiclePlateNumber(e.target.value)}
                    placeholder="e.g., RAE 123 A"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Vehicle Color</label>
                  <input
                    type="text"
                    value={vehicleColor}
                    onChange={(e) => setVehicleColor(e.target.value)}
                    placeholder="e.g., Black"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">National ID</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="Enter national ID"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Driving License Number</label>
                  <input
                    type="text"
                    value={drivingLicenseNumber}
                    onChange={(e) => setDrivingLicenseNumber(e.target.value)}
                    placeholder="e.g., DL-123456"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9B51] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => logout()}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Logout
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#FF9B51] hover:bg-[#e8883e] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </motion.div>

    </motion.div>
  );
}
