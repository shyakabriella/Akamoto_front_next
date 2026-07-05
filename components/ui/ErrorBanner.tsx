"use client";

import { AlertCircle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 flex items-start gap-3 text-sm">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <p className="flex-1 font-medium">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
