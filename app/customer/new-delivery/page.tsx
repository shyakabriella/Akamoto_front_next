"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import SectionHeader from "@/components/customer/SectionHeader";
import {
  Bike,
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle2,
  Trash2,
  AlertCircle,
  MapPin,
  Loader2,
  ShieldCheck,
  FileText
} from "lucide-react";

interface LocationSuggestion {
  name: string;
  lat: number;
  lng: number;
}

const itemTypes = ["Laptop", "Phone", "Electronics", "Document", "Parcel", "Other"];

// Haversine formula to compute distance in km
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(1));
}

// Client-side fallback pricing rule (Akamoto Motorcycle Tariff)
function calculateFallbackPrice(distanceKm: number) {
  const basePrice = 1000;
  const extraPricePerKm = 200;
  const baseDistance = 3;

  let extraDistance = Math.max(0, distanceKm - baseDistance);
  // Round up started extra km
  const extraStartedKm = Math.ceil(extraDistance);
  const extraCost = extraStartedKm * extraPricePerKm;
  const totalPrice = basePrice + extraCost;

  return {
    distance_km: distanceKm,
    base_price: basePrice,
    extra_cost: extraCost,
    total_price: totalPrice,
  };
}

export default function NewDeliveryPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Route Locations
  const [pickupText, setPickupText] = useState("");
  const [pickupLocation, setPickupLocation] = useState<LocationSuggestion | null>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);

  const [dropoffText, setDropoffText] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState<LocationSuggestion | null>(null);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<LocationSuggestion[]>([]);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);

  // Package Details
  const [itemType, setItemType] = useState("Parcel");
  const [itemValue, setItemValue] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [paymentOption, setPaymentOption] = useState<"sender" | "receiver">("sender");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [optionalDetails, setOptionalDetails] = useState("");

  // Photos
  const [photoFront, setPhotoFront] = useState<File | null>(null);
  const [photoFrontPreview, setPhotoFrontPreview] = useState<string>("");
  const [photoBack, setPhotoBack] = useState<File | null>(null);
  const [photoBackPreview, setPhotoBackPreview] = useState<string>("");
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [paymentSlipPreview, setPaymentSlipPreview] = useState<string>("");

  // Search references to handle outside clicks
  const pickupRef = useRef<HTMLDivElement>(null);
  const dropoffRef = useRef<HTMLDivElement>(null);

  // Pricing Quote state
  const [isQuoting, setIsQuoting] = useState(false);
  const [quote, setQuote] = useState<{ total_price: number; base_price: number; extra_cost: number; distance_km: number } | null>(null);
  const [isFallbackQuote, setIsFallbackQuote] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdDelivery, setCreatedDelivery] = useState<any>(null);

  // Rider Selection
  const [selectedRider, setSelectedRider] = useState<string | null>(null);

  // Auto-fill payment phone when payment option is sender
  useEffect(() => {
    const storedUser = localStorage.getItem("akamoto_user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.phone) {
          setPaymentPhone(u.phone);
        }
      } catch (e) {}
    }
  }, []);

  // Fetch pickup suggestions
  useEffect(() => {
    if (pickupText.length > 1 && !pickupLocation) {
      api.searchLocations(pickupText).then((res) => {
        setPickupSuggestions(res);
        setShowPickupSuggestions(true);
      });
    } else {
      setPickupSuggestions([]);
    }
  }, [pickupText, pickupLocation]);

  // Fetch dropoff suggestions
  useEffect(() => {
    if (dropoffText.length > 1 && !dropoffLocation) {
      api.searchLocations(dropoffText).then((res) => {
        setDropoffSuggestions(res);
        setShowDropoffSuggestions(true);
      });
    } else {
      setDropoffSuggestions([]);
    }
  }, [dropoffText, dropoffLocation]);

  // Handle outside clicks to close suggestion dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
        setShowPickupSuggestions(false);
      }
      if (dropoffRef.current && !dropoffRef.current.contains(event.target as Node)) {
        setShowDropoffSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back" | "slip") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === "front") {
        setPhotoFront(file);
        setPhotoFrontPreview(reader.result as string);
      } else if (side === "back") {
        setPhotoBack(file);
        setPhotoBackPreview(reader.result as string);
      } else {
        setPaymentSlip(file);
        setPaymentSlipPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (side: "front" | "back" | "slip") => {
    if (side === "front") {
      setPhotoFront(null);
      setPhotoFrontPreview("");
    } else if (side === "back") {
      setPhotoBack(null);
      setPhotoBackPreview("");
    } else {
      setPaymentSlip(null);
      setPaymentSlipPreview("");
    }
  };

  const handleGetQuote = async () => {
    if (!pickupLocation || !dropoffLocation) return;

    setIsQuoting(true);
    setQuoteError("");
    setQuote(null);
    setIsFallbackQuote(false);

    try {
      const res = await fetch("https://api.icotrix.com/api/pricing/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("akamoto_token")}`,
        },
        body: JSON.stringify({
          pickup_latitude: pickupLocation.lat,
          pickup_longitude: pickupLocation.lng,
          dropoff_latitude: dropoffLocation.lat,
          dropoff_longitude: dropoffLocation.lng,
          vehicle_type: "moto",
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setQuote(data.data);
        setStep(2);
      } else {
        const dist = getDistanceKm(pickupLocation.lat, pickupLocation.lng, dropoffLocation.lat, dropoffLocation.lng);
        const fallback = calculateFallbackPrice(dist);
        setQuote(fallback);
        setIsFallbackQuote(true);
        setStep(2);
      }
    } catch (err) {
      const dist = getDistanceKm(pickupLocation.lat, pickupLocation.lng, dropoffLocation.lat, dropoffLocation.lng);
      const fallback = calculateFallbackPrice(dist);
      setQuote(fallback);
      setIsFallbackQuote(true);
      setStep(2);
    } finally {
      setIsQuoting(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!quote || !pickupLocation || !dropoffLocation) return;
    setIsSubmitting(true);

    try {
      const res = await api.createDelivery({
        vehicleType: "moto",
        pickupAddress: pickupLocation.name,
        dropoffAddress: dropoffLocation.name,
        itemType,
        itemValue: Number(itemValue),
        receiverPhone,
        paymentOption,
        paymentPhone: paymentOption === "sender" ? paymentPhone : undefined,
        optionalDetails,
        price: quote.total_price,
      });

      if (res.success && res.data) {
        setCreatedDelivery(res.data);
        setStep(3);
      } else {
        alert(res.message || "Failed to create delivery.");
      }
    } catch (error) {
      alert("Error confirming delivery request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid =
    pickupLocation &&
    dropoffLocation &&
    itemType &&
    itemValue &&
    receiverPhone &&
    photoFront &&
    photoBack &&
    (paymentOption === "receiver" || paymentPhone);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Indicators */}
      {step < 3 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    step >= s ? "bg-[#25343F] border-[#25343F] text-white" : "bg-white border-slate-200 text-slate-300"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 2 && <div className={`flex-1 h-px ${step > s ? "bg-[#25343F]" : "bg-slate-100"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span className={step >= 1 ? "text-[#25343F]" : ""}>Details</span>
            <span className={step >= 2 ? "text-[#25343F]" : ""}>Confirm</span>
          </div>
        </div>
      )}

      {/* ── Step 1: Package & Route Details ── */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <SectionHeader title="New Delivery Request" description="Fill all details below to find a motorcycle rider." />

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
            {/* Route Locations */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Pickup location */}
              <div className="relative" ref={pickupRef}>
                <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Pickup Location ("From")
                </label>
                <input
                  type="text"
                  value={pickupText}
                  onChange={(e) => {
                    setPickupText(e.target.value);
                    setPickupLocation(null);
                  }}
                  onFocus={() => pickupText && setShowPickupSuggestions(true)}
                  placeholder="Type to search (e.g. Nyabugogo)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all"
                />
                {showPickupSuggestions && pickupSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-slate-50">
                    {pickupSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPickupLocation(s);
                          setPickupText(s.name);
                          setShowPickupSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-[#25343F] flex items-center gap-2"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#FF9B51]" />
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}
                {pickupLocation && (
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">✓ Location selected</span>
                )}
              </div>

              {/* Drop-off location */}
              <div className="relative" ref={dropoffRef}>
                <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF9B51]" /> Destination ("To")
                </label>
                <input
                  type="text"
                  value={dropoffText}
                  onChange={(e) => {
                    setDropoffText(e.target.value);
                    setDropoffLocation(null);
                  }}
                  onFocus={() => dropoffText && setShowDropoffSuggestions(true)}
                  placeholder="Type to search (e.g. Remera)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all"
                />
                {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-slate-50">
                    {dropoffSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setDropoffLocation(s);
                          setDropoffText(s.name);
                          setShowDropoffSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-[#25343F] flex items-center gap-2"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#FF9B51]" />
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}
                {dropoffLocation && (
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">✓ Destination selected</span>
                )}
              </div>
            </div>

            {/* Package Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">Item Type</label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all cursor-pointer"
                >
                  {itemTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">Estimated Item Value (RWF)</label>
                <input
                  type="number"
                  min="1"
                  value={itemValue}
                  onChange={(e) => setItemValue(e.target.value)}
                  placeholder="e.g. 500,000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Item Photos */}
            <div>
              <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                Item Photos <span className="text-red-500 font-bold">* Required</span>
              </label>
              <p className="text-[10px] text-slate-400 mb-3">Provide clear photos of the front and back of the item for safety.</p>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Photo Front */}
                <div className="border border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors relative min-h-[140px]">
                  {photoFrontPreview ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <img src={photoFrontPreview} alt="Item Front Preview" className="max-h-24 object-contain rounded-lg" />
                      <button
                        onClick={() => removePhoto("front")}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <p className="text-[10px] text-slate-400 mt-2 truncate max-w-[150px]">{photoFront?.name}</p>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-4">
                      <Upload className="w-6 h-6 text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-[#25343F]">Upload Photo of Front</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Click to choose image file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, "front")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Photo Back */}
                <div className="border border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors relative min-h-[140px]">
                  {photoBackPreview ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <img src={photoBackPreview} alt="Item Back Preview" className="max-h-24 object-contain rounded-lg" />
                      <button
                        onClick={() => removePhoto("back")}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <p className="text-[10px] text-slate-400 mt-2 truncate max-w-[150px]">{photoBack?.name}</p>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-4">
                      <Upload className="w-6 h-6 text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-[#25343F]">Upload Photo of Back</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Click to choose image file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, "back")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Receiver Phone & Option Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">Receiver Phone Number</label>
                <input
                  type="text"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  placeholder="e.g. 250788123456"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">
                  Optional Details <span className="text-slate-400 font-normal lowercase">(e.g. HP EliteBook 840)</span>
                </label>
                <input
                  type="text"
                  value={optionalDetails}
                  onChange={(e) => setOptionalDetails(e.target.value)}
                  placeholder="Model, serial, or special notes"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="pt-3 border-t border-slate-50 space-y-4">
              <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide">Payment Option</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#25343F]">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="sender"
                    checked={paymentOption === "sender"}
                    onChange={() => setPaymentOption("sender")}
                    className="w-4 h-4 accent-[#25343F]"
                  />
                  Sender Pays
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#25343F]">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="receiver"
                    checked={paymentOption === "receiver"}
                    onChange={() => setPaymentOption("receiver")}
                    className="w-4 h-4 accent-[#25343F]"
                  />
                  Receiver Pays
                </label>
              </div>

              {paymentOption === "sender" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div>
                    <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">Payment Phone Number</label>
                    <input
                      type="text"
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      placeholder="e.g. 250788998877"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF9B51] focus:ring-1 focus:ring-[#FF9B51] outline-none text-sm text-[#25343F] bg-slate-50 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Optional Payment Slip */}
                  <div>
                    <label className="block text-xs font-bold text-[#25343F] uppercase tracking-wide mb-1.5">
                      Upload Payment Slip <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <div className="border border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors relative min-h-[100px]">
                      {paymentSlipPreview ? (
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                          <img src={paymentSlipPreview} alt="Slip Preview" className="max-h-16 object-contain rounded" />
                          <button
                            onClick={() => removePhoto("slip")}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-2">
                          <Upload className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-xs font-bold text-[#25343F]">Upload PDF / Image Slip</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => handlePhotoUpload(e, "slip")}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Validation Hint */}
          {!isStep1Valid && (() => {
            const missing: string[] = [];
            if (!pickupLocation) missing.push("pickup location");
            if (!dropoffLocation) missing.push("destination");
            if (!itemValue) missing.push("item value");
            if (!receiverPhone) missing.push("receiver phone");
            if (!photoFront) missing.push("front photo of item");
            if (!photoBack) missing.push("back photo of item");
            if (paymentOption === "sender" && !paymentPhone) missing.push("payment phone");
            return missing.length > 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  <span className="font-bold">Still needed:</span> {missing.join(", ")}.
                </p>
              </div>
            ) : null;
          })()}

          {/* Action Button */}
          <button
            onClick={handleGetQuote}
            disabled={isQuoting || !isStep1Valid}
            className="w-full py-4 bg-[#25343F] hover:bg-[#1a252d] text-white font-bold text-sm rounded-2xl transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isQuoting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Calculating Price...
              </>
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* ── Step 2: Confirm & Quote ── */}
      {step === 2 && quote && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <SectionHeader title="Review & Confirm" description="Check the details and confirm your delivery request." />

          {isFallbackQuote && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold">Standard Pricing Applied</p>
                <p className="text-[11px] text-amber-700/90 leading-relaxed mt-0.5">
                  The billing engine returned a pricing rule mismatch. We calculated the standard Akamoto Motorcycle tariff.
                </p>
              </div>
            </div>
          )}

          {/* Route Summary */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <FileText className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Package Details</p>
                  <p className="text-sm font-bold text-[#25343F]">
                    {itemType} {optionalDetails && `(${optionalDetails})`} · {Number(itemValue).toLocaleString()} RWF
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <Bike className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Vehicle Selected</p>
                  <p className="text-sm font-bold text-[#25343F]">Akamoto Motorcycle Rider</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <MapPin className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Route</p>
                  <p className="text-xs font-bold text-[#25343F]">
                    {pickupLocation?.name} → {dropoffLocation?.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Est. Distance: {quote.distance_km} km</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Price Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Base price (first 3 km)</span>
                  <span className="font-semibold text-[#25343F]">{quote.base_price?.toLocaleString()} RWF</span>
                </div>
                {quote.extra_cost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Extra distance cost</span>
                    <span className="font-semibold text-[#25343F]">{quote.extra_cost?.toLocaleString()} RWF</span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                  <span className="font-bold text-[#25343F]">Total Price</span>
                  <span className="font-black text-[#FF9B51] text-base">{quote.total_price?.toLocaleString()} RWF</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> A 20% commission applies on rider completion.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3.5 border border-slate-200 text-[#25343F] font-bold text-sm rounded-2xl hover:border-slate-300 transition-all cursor-pointer bg-white flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Edit Details
            </button>
            <button
              onClick={handleConfirmDelivery}
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-[#FF9B51] hover:bg-[#e8883e] text-white font-bold text-sm rounded-2xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Placing Request...
                </>
              ) : (
                <>Confirm & Find Rider</>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Step 3: Success & Dispatch Search ── */}
      {step === 3 && createdDelivery && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-8">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#25343F]">Delivery Placed Successfully!</h2>
            <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-widest font-bold">Order ID: {createdDelivery.id}</p>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed mt-2">
              Select a nearby rider to assign your delivery, or let Akamoto auto-assign the closest one.
            </p>
          </div>

          {/* Available Riders list ordered by proximity */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 max-w-md mx-auto space-y-4 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nearby Riders Available</h3>
            <div className="space-y-2">
              {[
                { name: "Eric Manzi", distance: "0.4 km", rating: "4.9" },
                { name: "Aline Umuhoza", distance: "1.2 km", rating: "4.8" },
                { name: "Jean Claude", distance: "2.5 km", rating: "4.7" },
              ].map((rider, idx) => {
                const isSelected = selectedRider === rider.name;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedRider(isSelected ? null : rider.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? "border-[#25343F] bg-[#25343F]/5"
                        : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center uppercase transition-colors ${
                        isSelected ? "bg-[#25343F] text-white" : "bg-white border border-slate-200 text-slate-500"
                      }`}>
                        {rider.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#25343F]">{rider.name}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          Motorcycle Rider
                          <span className="inline-flex items-center gap-0.5 ml-1">
                            <svg className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            {rider.rating}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-[#FF9B51] bg-[#FF9B51]/10 px-2 py-0.5 rounded-full">
                        {rider.distance} away
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#25343F] shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedRider && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-3 border-t border-slate-100"
              >
                <p className="text-[11px] text-slate-400 mb-3 text-center">
                  You selected <span className="font-bold text-[#25343F]">{selectedRider}</span>. Ready to request?
                </p>
                <a
                  href="/customer/active"
                  className="flex items-center justify-center w-full py-3 bg-[#FF9B51] hover:bg-[#e8883e] text-white font-bold text-sm rounded-2xl transition-all shadow-sm cursor-pointer gap-2"
                >
                  Request {selectedRider}
                </a>
              </motion.div>
            )}
          </div>

          {!selectedRider && (
            <a
              href="/customer/active"
              className="inline-flex items-center justify-center bg-[#25343F] hover:bg-[#1a252d] text-white font-bold text-sm px-8 py-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              Track in Real Time
            </a>
          )}
        </motion.div>
      )}
    </div>
  );
}
