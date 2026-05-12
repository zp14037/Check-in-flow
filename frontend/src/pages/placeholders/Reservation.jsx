import React from "react";
import DashboardShell from "../../components/della/DashboardShell";
import SourceChannelPill, { SOURCE_CHANNELS } from "../../components/della/SourceChannelPill";

export default function Reservation() {
  return (
    <DashboardShell
      title="Reservation Console"
      subtitle="Parse incoming booking emails and reconcile across OTAs."
      accent="Reservations"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-[#E8E2D9] bg-white p-8 shadow-sm">
          <h2 className="font-display italic text-3xl">Email Parser</h2>
          <p className="text-sm text-[#0D0D0D]/60 mt-2 font-body">
            Coming next: paste any booking email — Della extracts guest, room, dates, and source channel automatically.
          </p>
          <div className="mt-6 h-48 rounded-xl border border-dashed border-[#C9A84C]/40 bg-[#FBF8F2] flex items-center justify-center text-[11px] font-ui uppercase tracking-[0.3em] text-[#0D0D0D]/40">
            Placeholder · Parser UI
          </div>
        </div>
        <div className="rounded-2xl border border-[#E8E2D9] bg-white p-8 shadow-sm">
          <h2 className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#0D0D0D]/50">
            Source Channels Supported
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {SOURCE_CHANNELS.map((s) => (
              <SourceChannelPill key={s} source={s} />
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
