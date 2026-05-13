import React, { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Send,
  Users,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  MessageCircle,
  Copy,
  PenLine,
} from "lucide-react";
import DashboardShell from "../../components/della/DashboardShell";
import StatusPillLight from "../../components/receptionist/StatusPillLight";
import { useApp } from "../../context/AppContext";
import ToastHost, { toast } from "../../components/receptionist/ToastHost";

export default function GroupCoordinator() {
  const { reservations, markGroupGuestSubmitted, logActivity } = useApp();
  const group = reservations.find((r) => r.id === "GRP-0091");
  const guests = group?.groupGuests || [];

  const [filter, setFilter] = useState("all");
  const [reminderBusy, setReminderBusy] = useState(false);

  const stats = useMemo(() => {
    const submitted = guests.filter((g) => g.submitted).length;
    const pending = guests.length - submitted;
    return { submitted, pending, total: guests.length, pct: guests.length ? Math.round((submitted / guests.length) * 100) : 0 };
  }, [guests]);

  const visible = useMemo(() => {
    if (filter === "submitted") return guests.filter((g) => g.submitted);
    if (filter === "pending") return guests.filter((g) => !g.submitted);
    return guests;
  }, [guests, filter]);

  const groupLink = `${typeof window !== "undefined" ? window.location.origin : ""}/guest?group=GRP-0091`;
  const qrValue = `DELLA|GRP-0091|TCS|COORDINATOR`;

  const simulateScan = (g) => {
    markGroupGuestSubmitted(group.id, g.id, {
      mobile: `+91 98${String(Math.floor(Math.random() * 90000) + 10000)} ${String(Math.floor(Math.random() * 90000) + 10000)}`,
      idType: "Aadhaar Card",
      idFile: `aadhaar_${g.id}.jpg`,
    });
    toast(`✅ ${g.name} submitted check-in (auto-RPA fired to IDS)`);
  };

  const sendReminder = () => {
    if (reminderBusy || stats.pending === 0) return;
    setReminderBusy(true);
    setTimeout(() => {
      logActivity(
        "coordinator",
        `Reminder broadcast sent to Sheetal Mehta · ${stats.pending} pending TCS guests`
      );
      toast(`💬 Reminder sent to coordinator · ${stats.pending} pending`);
      setReminderBusy(false);
    }, 700);
  };

  const copyLink = () => {
    try {
      navigator.clipboard?.writeText(groupLink);
    } catch (e) {
      /* ignore */
    }
    toast("📋 Group link copied");
  };

  if (!group) {
    return (
      <DashboardShell title="No Active Group" accent="Group Coordinator">
        <p className="font-body text-[14px] text-[#0D0D0D]/70">No group bookings on file for today.</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="TCS Annual Offsite"
      subtitle={`Coordinator: ${group.coordinatorName || "Sheetal Mehta"} · ${group.coordinatorMobile || group.mobile} · Group block GRP-0091 · ${group.nights} nights from ${group.arrival}`}
      accent="Group Coordinator"
    >
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GStat icon={Users} label="Total Guests" value={stats.total} color="text-blue-500" />
        <GStat icon={CheckCircle2} label="Submitted" value={stats.submitted} color="text-green-600" progress={stats.pct} />
        <GStat icon={Clock3} label="Pending Scan" value={stats.pending} color="text-amber-500" />
        <GStat icon={ShieldCheck} label="Rooms Blocked" value="12" color="text-teal-600" />
      </div>

      {/* Coordinator panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#C9A84C]">
                Coordinator Tools
              </p>
              <h2 className="font-display italic text-[26px] text-[#0D0D0D] mt-1">
                Live Submission Tracker
              </h2>
              <p className="font-body text-[12px] text-[#6B7280] mt-1">
                Group coordinator scans the gold QR (sent to her WhatsApp), then each guest scans
                <strong> after stepping off the bus</strong> to submit their own ID, mobile and signature.
              </p>
            </div>
            <button
              onClick={sendReminder}
              disabled={reminderBusy || stats.pending === 0}
              data-testid="send-group-reminder"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-[#16A34A] hover:bg-[#15803d] disabled:opacity-50 text-white font-ui text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors"
            >
              {reminderBusy ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send size={13} /> Auto-Send Reminder · {stats.pending} pending
                </>
              )}
            </button>
          </div>

          {/* Submission progress bar */}
          <div className="mt-5">
            <div className="flex items-end justify-between mb-2">
              <p className="font-ui text-[11px] uppercase tracking-[0.16em] text-[#6B7280] font-semibold">
                Submission Progress
              </p>
              <p className="font-display italic text-[22px] text-[#1a1a1a]">
                {stats.submitted}<span className="text-[#9CA3AF] text-[14px]"> / {stats.total}</span>
              </p>
            </div>
            <div className="h-3 rounded-full bg-[#F5F0E8] overflow-hidden">
              <div
                className="h-full bg-[#C9A84C] transition-all duration-700"
                style={{ width: `${stats.pct}%` }}
              />
            </div>
          </div>

          {/* Filter tabs */}
          <div className="mt-5 flex gap-1 p-1 bg-[#F5EDD3] rounded-full w-fit">
            {[
              { key: "all", label: `All (${stats.total})` },
              { key: "submitted", label: `✅ Submitted (${stats.submitted})` },
              { key: "pending", label: `⏳ Pending (${stats.pending})` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                data-testid={`grp-tab-${t.key}`}
                className={`px-4 py-1.5 rounded-full font-ui text-[12px] font-medium transition-all ${
                  filter === t.key
                    ? "bg-[#C9A84C] text-[#0D0D0D] shadow-sm"
                    : "text-[#6B7280] hover:text-[#1a1a1a]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Guest table */}
          <div className="mt-5 rounded-xl border border-[#E8E2D9] overflow-hidden">
            <div className="max-h-[460px] overflow-y-auto">
              <table className="w-full text-sm" data-testid="group-guest-table">
                <thead className="bg-[#FAFAF8] border-b border-[#E8E2D9] sticky top-0">
                  <tr>
                    {["#", "Guest", "Mobile", "ID", "Sign", "Status", "Action"].map((h) => (
                      <th key={h} className="px-4 py-2.5 font-ui text-[9px] uppercase tracking-[0.16em] text-[#9CA3AF] text-left whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((g, i) => (
                    <tr key={g.id} className="border-b border-[#F9F5F0] hover:bg-[#FBF8F2]">
                      <td className="px-4 py-2.5 font-ui text-[11px] text-[#9CA3AF]">{i + 1}</td>
                      <td className="px-4 py-2.5 font-body text-[13px] text-[#1a1a1a]">{g.name}</td>
                      <td className="px-4 py-2.5 font-ui text-[11px] text-[#6B7280]">
                        {g.mobile || <span className="italic text-[#9CA3AF]">awaiting</span>}
                      </td>
                      <td className="px-4 py-2.5">
                        {g.idFile ? (
                          <span className="text-green-600 text-[12px]">✅</span>
                        ) : (
                          <span className="text-[#9CA3AF] text-[12px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {g.signed ? (
                          <PenLine size={12} className="text-green-600" />
                        ) : (
                          <span className="text-[#9CA3AF] text-[12px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {g.submitted ? (
                          <StatusPillLight kind="submitted" label="✅ Scanned & Submitted" />
                        ) : (
                          <StatusPillLight kind="pending" label="⏳ Awaiting Scan" />
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {g.submitted ? (
                          <span className="font-ui text-[10px] text-green-600 uppercase tracking-wider">
                            RPA Written
                          </span>
                        ) : (
                          <button
                            onClick={() => simulateScan(g)}
                            data-testid={`scan-${g.id}`}
                            className="px-3 py-1.5 rounded-full bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0D0D0D] font-ui text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors"
                          >
                            Simulate Scan
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: coordinator's WhatsApp QR */}
        <aside className="space-y-4">
          <div className="bg-[#0D1F0F] rounded-2xl border border-[#C9A84C]/30 shadow-sm p-5 text-center">
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#C9A84C]">
              Coordinator WhatsApp QR
            </p>
            <h3 className="font-display italic text-[20px] text-[#F5F0E8] mt-1">
              Shared with {group.coordinatorName || "Sheetal Mehta"}
            </h3>
            <div className="mt-4 inline-block rounded-xl border-2 border-[#C9A84C] bg-[#0D0D0D] p-3">
              <QRCodeSVG value={qrValue} size={170} fgColor="#C9A84C" bgColor="#0D0D0D" />
            </div>
            <p className="mt-3 font-body text-[11px] text-[#F5F0E8]/70 leading-relaxed">
              Guests scan post-bus to open the prefilled check-in form.
              The coordinator can re-broadcast the link to anyone yet to submit.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={copyLink}
                data-testid="copy-group-link"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-ui text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors"
              >
                <Copy size={11} /> Copy Link
              </button>
              <a
                href={`https://wa.me/${(group.coordinatorMobile || group.mobile || "").replace(/\D/g, "")}?text=${encodeURIComponent(`Della Resorts · TCS group QR ${groupLink}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#16A34A] hover:bg-[#15803d] text-white font-ui text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors"
              >
                <MessageCircle size={11} /> WhatsApp
              </a>
            </div>
          </div>

          {/* RPA hint card */}
          <div className="bg-[#FFF9E6] border border-[#C9A84C]/30 rounded-2xl p-5">
            <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C9A84C]">
              🤖 Auto-RPA Trigger
            </p>
            <p className="font-body text-[12px] text-[#1a1a1a]/85 mt-2 leading-relaxed">
              The moment any group guest hits <strong>Submit</strong>, the RPA Agent writes
              their 9 fields into <strong>IDS FortuneNext</strong> and the Operations Manager
              + Reception dashboards refresh live.
            </p>
            <p className="font-body text-[11px] text-[#6B7280] mt-2 italic">
              No printed Excel rooming lists. No manual reception data entry.
            </p>
          </div>
        </aside>
      </div>

      <ToastHost />
    </DashboardShell>
  );
}

function GStat({ icon: Icon, label, value, color, progress }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-5">
      <Icon size={16} strokeWidth={1.8} className={color} />
      <p className={`font-display italic leading-none mt-3 ${color}`} style={{ fontSize: 40 }}>
        {value}
      </p>
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280] mt-2">
        {label}
      </p>
      {progress !== undefined && (
        <div className="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full bg-[#C9A84C] transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
