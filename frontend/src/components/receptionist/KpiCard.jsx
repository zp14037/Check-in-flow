import React, { useState } from "react";
import { Info } from "lucide-react";

export default function KpiCard({
  icon: Icon,
  iconColor = "text-blue-500",
  value,
  valueColor = "text-[#1a1a1a]",
  label,
  sub,
  tooltip,
  progress,
  dataTestid,
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      data-testid={dataTestid}
      className="relative bg-white rounded-2xl shadow-sm border border-[#E8E2D9] p-5"
    >
      <div className="flex items-start justify-between">
        <Icon size={16} strokeWidth={1.8} className={iconColor} />
        <button
          type="button"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="w-5 h-5 rounded-full bg-[#F5F0E8] text-[#6B7280] text-[10px] font-bold flex items-center justify-center hover:bg-[#E8E2D9] transition-colors"
          aria-label="info"
        >
          <Info size={11} />
        </button>
      </div>

      <div className="mt-3">
        <p className={`font-display italic font-light leading-none ${valueColor}`} style={{ fontSize: 48 }}>
          {value}
        </p>
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280] mt-2">
          {label}
        </p>
      </div>

      {progress !== undefined && (
        <div className="mt-3 h-1 rounded-full bg-green-100 overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {sub && <p className="font-body text-[11px] text-[#9CA3AF] mt-3">{sub}</p>}

      {hover && tooltip && (
        <div className="absolute right-0 top-8 z-20 w-64 bg-[#1a1a1a] text-[#F5F0E8]/90 border border-white/10 rounded-xl p-3 shadow-xl text-[11px] font-body leading-relaxed">
          {tooltip}
        </div>
      )}
    </div>
  );
}
