import React from "react";
import { Wifi, Signal, BatteryFull } from "lucide-react";

/**
 * iOS-style status bar (only used inside PhoneFrame guest screens).
 */
export default function StatusBar({ tone = "ivory" }) {
  const color = tone === "ivory" ? "#F5F0E8" : "#0D0D0D";
  return (
    <div
      className="flex items-center justify-between px-6 pt-3 pb-1 text-[12px] font-ui font-semibold select-none"
      style={{ color }}
    >
      <span className="tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5 opacity-90">
        <Signal size={12} strokeWidth={2.4} />
        <Wifi size={12} strokeWidth={2.4} />
        <BatteryFull size={14} strokeWidth={2} />
      </div>
    </div>
  );
}
