import React from "react";
import DashboardShell from "../../components/della/DashboardShell";

export default function GroupCoordinator() {
  return (
    <DashboardShell
      title="Group & Event Check-In"
      subtitle="External-facing tracker for weddings, corporate retreats and large groups."
      accent="Group Coordinator"
    >
      <div className="rounded-2xl border border-[#E8E2D9] bg-white p-10 shadow-sm">
        <p className="font-ui text-[10px] uppercase tracking-[0.3em] text-[#C9A84C]">Live Event</p>
        <h2 className="font-display italic text-4xl mt-2">Mehra Wedding · Feb 19–20</h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Guests", value: "118" },
            { label: "Checked-In", value: "0" },
            { label: "Rooms Blocked", value: "32" },
            { label: "Special Requests", value: "9" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl bg-[#FBF8F2] p-5">
              <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#0D0D0D]/50">
                {m.label}
              </p>
              <p className="font-display italic text-3xl mt-1">{m.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-[11px] font-ui uppercase tracking-[0.22em] text-[#0D0D0D]/40">
          Placeholder · QR check-in & seating chart ship in the next phase.
        </p>
      </div>
    </DashboardShell>
  );
}
