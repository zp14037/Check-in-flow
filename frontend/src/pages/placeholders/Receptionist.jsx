import React from "react";
import DashboardShell from "../../components/della/DashboardShell";
import SourceChannelPill from "../../components/della/SourceChannelPill";
import StatusPill from "../../components/della/StatusPill";
import { useApp } from "../../context/AppContext";
import GoldButton from "../../components/della/GoldButton";

export default function Receptionist() {
  const { reservations, markIdVerified } = useApp();
  const today = reservations.filter((r) => r.arrival === "2026-02-18");

  return (
    <DashboardShell
      title="Today's Arrivals"
      subtitle="Live manifest synced with PMS — verify IDs and complete check-ins."
      accent="Front Desk"
    >
      <div className="rounded-2xl border border-[#E8E2D9] bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm font-body" data-testid="arrivals-table">
          <thead className="bg-[#F5F0E8] text-[10px] font-ui uppercase tracking-[0.18em] text-[#0D0D0D]/60">
            <tr>
              <th className="text-left px-5 py-3">Reservation</th>
              <th className="text-left px-5 py-3">Guest</th>
              <th className="text-left px-5 py-3">Room</th>
              <th className="text-left px-5 py-3">Source</th>
              <th className="text-left px-5 py-3">Form</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {today.map((r) => (
              <tr key={r.id} className="border-t border-[#F0EAE0] hover:bg-[#FBF8F2]">
                <td className="px-5 py-4 font-ui text-[12px] text-[#0D0D0D]/70">{r.id}</td>
                <td className="px-5 py-4 font-display italic text-lg">{r.guestName}</td>
                <td className="px-5 py-4">
                  <div className="font-ui text-xs">{r.roomNumber}</div>
                  <div className="text-[11px] text-[#0D0D0D]/50">{r.roomType}</div>
                </td>
                <td className="px-5 py-4">
                  <SourceChannelPill source={r.source} />
                </td>
                <td className="px-5 py-4">
                  {r.formSubmitted ? (
                    <span className="text-[11px] font-ui font-semibold text-[#3A7D44]" data-testid={`form-submitted-${r.id}`}>
                      Submitted ✓
                    </span>
                  ) : (
                    <span className="text-[11px] font-ui text-[#0D0D0D]/40">Awaiting</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <StatusPill status={r.checkinStatus} dataTestid={`checkin-status-${r.id}`} />
                </td>
                <td className="px-5 py-4 text-right">
                  <GoldButton
                    variant={r.idVerified ? "ghost" : "outline"}
                    size="sm"
                    disabled={r.idVerified}
                    onClick={() => markIdVerified(r.id)}
                    dataTestid={`verify-id-${r.id}`}
                  >
                    {r.idVerified ? "Verified" : "Verify ID"}
                  </GoldButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-[11px] font-ui uppercase tracking-[0.22em] text-[#0D0D0D]/40">
        Placeholder · Detailed check-in flow ships in the next phase.
      </p>
    </DashboardShell>
  );
}
