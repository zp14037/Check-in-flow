import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useApp } from "../../context/AppContext";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function TopBar({ title, subtitle }) {
  const now = useClock();
  const [waLive, setWaLive] = useState(true);
  const { notifications } = useApp();

  return (
    <header
      data-testid="receptionist-topbar"
      className="bg-white border-b border-[#E8E2D9] px-8 py-4 sticky top-0 z-10 flex items-center justify-between"
    >
      <div>
        <h1 className="font-display italic text-[26px] text-[#1a1a1a] leading-tight">{title}</h1>
        <p className="font-body text-[13px] text-[#6B7280] mt-0.5">{subtitle}</p>
      </div>

      <div className="hidden md:flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="font-ui text-[14px] text-[#1a1a1a] tabular-nums" data-testid="live-clock">
            {now.toLocaleTimeString("en-US", { hour12: true })}
          </span>
        </div>
        <span className="font-body text-[10px] text-green-600 mt-0.5">Synced with PMS</span>
      </div>

      <div className="flex items-center gap-5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="font-body text-[11px] text-[#6B7280]">WA API</span>
          <span
            onClick={() => setWaLive((v) => !v)}
            data-testid="wa-toggle"
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              waLive ? "bg-green-500" : "bg-amber-400"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                waLive ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </span>
          <span
            className={`font-ui text-[10px] font-semibold uppercase tracking-wider ${
              waLive ? "text-green-600" : "text-amber-600"
            }`}
          >
            {waLive ? "Live" : "QR Mode"}
          </span>
        </label>

        <button
          className="relative w-9 h-9 rounded-full hover:bg-[#F5F0E8] flex items-center justify-center transition-colors"
          data-testid="notifications-bell"
        >
          <Bell size={17} className="text-[#1a1a1a]" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-ui font-bold flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
