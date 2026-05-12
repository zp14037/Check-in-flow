import React from "react";
import DashboardShell from "../../components/della/DashboardShell";

const STAGES = ["New Lead", "Qualified", "Proposal Sent", "Negotiation", "Closed Won"];

export default function Sales() {
  return (
    <DashboardShell
      title="Sales Pipeline"
      subtitle="Track corporate leads from first contact to confirmed group bookings."
      accent="Sales"
    >
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {STAGES.map((s, i) => (
          <div
            key={s}
            className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-sm min-h-[220px]"
            data-testid={`pipeline-stage-${i}`}
          >
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#C9A84C]">
              Stage {i + 1}
            </p>
            <h3 className="font-display italic text-xl mt-2">{s}</h3>
            <div className="mt-5 text-[11px] font-ui uppercase tracking-[0.22em] text-[#0D0D0D]/40">
              0 deals
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-[11px] font-ui uppercase tracking-[0.22em] text-[#0D0D0D]/40">
        Placeholder · CRM kanban ships in the next phase.
      </p>
    </DashboardShell>
  );
}
