import React from "react";
import DashboardShell from "../../components/della/DashboardShell";
import { useApp } from "../../context/AppContext";
import SourceChannelPill from "../../components/della/SourceChannelPill";

export default function GeneralManager() {
  const { reservations, activityLog } = useApp();
  const total = reservations.length;
  const verified = reservations.filter((r) => r.idVerified).length;
  const submitted = reservations.filter((r) => r.formSubmitted).length;

  const stats = [
    { label: "Arrivals (today)", value: total },
    { label: "Forms submitted", value: submitted },
    { label: "IDs verified", value: verified },
    { label: "Occupancy", value: "82%" },
  ];

  const bySource = reservations.reduce((acc, r) => {
    acc[r.source] = (acc[r.source] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardShell
      title="Executive Overview"
      subtitle="A single pane across reservations, front desk and sales."
      accent="General Manager"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-[#E8E2D9] p-6 shadow-sm">
            <p className="font-ui text-[10px] uppercase tracking-[0.25em] text-[#0D0D0D]/50">
              {s.label}
            </p>
            <p className="font-display italic text-5xl mt-2 text-[#0D0D0D]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="rounded-2xl bg-white border border-[#E8E2D9] p-6 shadow-sm">
          <h3 className="font-ui text-[11px] uppercase tracking-[0.28em] text-[#C9A84C]">
            Mix by Channel
          </h3>
          <div className="mt-5 flex flex-col gap-3">
            {Object.entries(bySource).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <SourceChannelPill source={k} />
                <span className="font-display italic text-2xl">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-[#E8E2D9] p-6 shadow-sm">
          <h3 className="font-ui text-[11px] uppercase tracking-[0.28em] text-[#C9A84C]">
            Activity Log
          </h3>
          <ul className="mt-5 space-y-3 max-h-[260px] overflow-auto pr-1">
            {activityLog.map((a, i) => (
              <li key={i} className="text-[12px] font-body text-[#0D0D0D]/70 flex gap-3">
                <span className="font-ui text-[10px] uppercase tracking-[0.18em] text-[#0D0D0D]/40 w-20 shrink-0">
                  {a.actor}
                </span>
                <span>{a.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-8 text-[11px] font-ui uppercase tracking-[0.22em] text-[#0D0D0D]/40">
        Placeholder · Full KPI suite with charts ships next.
      </p>
    </DashboardShell>
  );
}
