import React from "react";
import { Link } from "react-router-dom";
import TopBar from "../../components/receptionist/TopBar";

export default function PlaceholderTab({ title, subtitle, copy }) {
  return (
    <div>
      <TopBar title={title} subtitle={subtitle || "Coming soon"} />
      <div className="p-8 lg:p-12">
        <div className="max-w-xl mx-auto rounded-2xl bg-white border border-[#E8E2D9] shadow-sm p-10 text-center">
          <p className="font-ui text-[10px] uppercase tracking-[0.32em] text-[#C9A84C]">Phase 3 module</p>
          <h2 className="font-display italic text-[34px] text-[#1a1a1a] mt-3">{title}</h2>
          <p className="font-body text-[13px] text-[#6B7280] mt-3 leading-relaxed">
            {copy || "This module is part of the next development phase. Today's Arrivals and Walk-in modules are already live — return to the dashboard to continue."}
          </p>
          <Link
            to="/receptionist"
            className="inline-block mt-6 px-5 py-2.5 rounded-full border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-ui text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors"
          >
            ← Today's Arrivals
          </Link>
        </div>
      </div>
    </div>
  );
}
