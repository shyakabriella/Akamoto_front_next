"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { MapPin, Wifi, WifiOff } from "lucide-react";

export default function RiderStatusPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [locError, setLocError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function sendLocation(lat: number, lng: number) {
    setLocation({ lat, lng });
    try {
      await api.updateRiderLocation({
        current_latitude: lat,
        current_longitude: lng,
      });
    } catch {
      /* silent — location updates are best-effort */
    }
  }

  function startLocationTracking() {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => sendLocation(pos.coords.latitude, pos.coords.longitude),
      () => setLocError("Could not get your location. Please allow location access."),
      { enableHighAccuracy: true }
    );
    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => sendLocation(pos.coords.latitude, pos.coords.longitude),
        () => {},
        { enableHighAccuracy: true }
      );
    }, 30000);
  }

  function stopLocationTracking() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setLocation(null);
  }

  async function handleToggle() {
    setToggling(true);
    setError("");
    setMessage("");
    try {
      if (isOnline) {
        await api.goOffline();
        stopLocationTracking();
        setIsOnline(false);
        setMessage("You are now offline.");
      } else {
        await api.goOnline();
        setIsOnline(true);
        setMessage("You are online! Waiting for nearby delivery requests...");
        startLocationTracking();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update status. Make sure your profile is approved.");
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#25343F] tracking-tight">Online Status</h1>
        <p className="text-slate-500 text-sm mt-1">Go online to receive delivery requests in your area.</p>
      </div>

      {error && <ErrorBanner message={error} />}
      {locError && <ErrorBanner message={locError} onDismiss={() => setLocError("")} />}
      {message && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl px-4 py-3 text-sm font-medium">
          {message}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${
          isOnline ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"
        }`}>
          {isOnline ? <Wifi className="w-10 h-10" /> : <WifiOff className="w-10 h-10" />}
        </div>
        <p className="text-2xl font-black text-[#25343F]">{isOnline ? "ONLINE" : "OFFLINE"}</p>
        <p className="text-sm text-slate-400 mt-1">
          {isOnline ? "You are visible to customers near you." : "You won't receive new delivery requests."}
        </p>
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`mt-6 px-8 py-3.5 rounded-2xl font-bold text-sm text-white cursor-pointer disabled:opacity-50 transition-colors ${
            isOnline ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
          }`}
        >
          {toggling ? "Updating..." : isOnline ? "Go Offline" : "Go Online"}
        </button>
      </div>

      {isOnline && location && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF9B51]/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#FF9B51]" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Location</p>
            <p className="text-sm font-semibold text-[#25343F]">
              {location.address ?? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Updating every 30 seconds while online</p>
          </div>
        </div>
      )}
    </div>
  );
}
