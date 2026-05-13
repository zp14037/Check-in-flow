import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Send,
  QrCode,
  ShieldCheck,
  UserCheck,
  Phone,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../components/receptionist/TopBar";
import KpiCard from "../../components/receptionist/KpiCard";
import FilterTabs from "../../components/receptionist/FilterTabs";
import SourcePill from "../../components/receptionist/SourcePill";
import StatusPillLight from "../../components/receptionist/StatusPillLight";
import { toast } from "../../components/receptionist/ToastHost";

const TAB_DEFS = [
  { key: "all", label: "All" },
  { key: "submitted", label: "✅ Submitted" },
  { key: "pending", label: "⏳ Pending" },
  { key: "booking", label: "🔶 OTA" },
  { key: "walkin", label: "🚶 Walk-in" },
  { key: "group", label: "👥 Group" },
];

export default function Arrivals() {
  const navigate = useNavigate();
  const { reservations, markCheckedIn, markIdVerified, captureMobile } = useApp();
  const [tab, setTab] = useState("all");
  const [drawerId, setDrawerId] = useState(null);
  const [busyRows, setBusyRows] = useState({}); // {id: "sending" | "sent" | "checking" | "done"}
  const [captureOpen, setCaptureOpen] = useState(null); // reservation id for inline expand
  const [captureValue, setCaptureValue] = useState("");

  const filtered = useMemo(() => {
    if (tab === "all") return reservations;
    if (tab === "submitted") return reservations.filter((r) => r.formSubmitted);
    if (tab === "pending") return reservations.filter((r) => !r.formSubmitted && !r.noContact);
    if (tab === "booking") return reservations.filter((r) => r.source === "booking" || r.source === "mmt");
    if (tab === "walkin") return reservations.filter((r) => r.source === "walkin" || r.isWalkin);
    if (tab === "group") return reservations.filter((r) => r.source === "group" || r.isGroup);
    return reservations;
  }, [reservations, tab]);

  const totals = useMemo(() => {
    const total = reservations.length;
    const submitted = reservations.filter((r) => r.formSubmitted).length;
    const noContact = reservations.filter((r) => r.noContact).length;
    return {
      total,
      submitted,
      awaiting: total - submitted - noContact,
      noContact,
      pct: total ? Math.round((submitted / total) * 100) : 0,
    };
  }, [reservations]);

  const tabsWithCounts = TAB_DEFS.map((t) => {
    if (t.key === "all") return { ...t, label: `All (${reservations.length})` };
    return t;
  });

  const handleResend = (r) => {
    setBusyRows((b) => ({ ...b, [r.id]: "sending" }));
    setTimeout(() => {
      setBusyRows((b) => ({ ...b, [r.id]: "sent" }));
      toast(`✅ WhatsApp resent to ${r.guestName}`);
      setTimeout(() => setBusyRows((b) => ({ ...b, [r.id]: undefined })), 2000);
    }, 600);
  };

  const handleCheckIn = (r) => {
    setBusyRows((b) => ({ ...b, [r.id]: "checking" }));
    setTimeout(() => {
      markCheckedIn(r.id);
      setBusyRows((b) => ({ ...b, [r.id]: "done" }));
      toast(`✅ ${r.guestName} checked in · ${r.roomNumber}`);
    }, 800);
  };

  const handleCapture = (r) => {
    if (captureOpen === r.id) {
      setCaptureOpen(null);
    } else {
      setCaptureOpen(r.id);
      setCaptureValue("");
    }
  };

  const submitCapture = (r) => {
    if (!captureValue) return;
    captureMobile(r.id, captureValue);
    toast(`✅ Link sent to ${captureValue}`);
    setCaptureOpen(null);
    setCaptureValue("");
  };

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div data-testid="arrivals-page">
      <TopBar title="Today's Arrivals" subtitle={today} />

      {/* KPI strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6 pb-2">
        <KpiCard
          icon={Calendar}
          iconColor="text-blue-500"
          value={totals.total}
          valueColor="text-[#1a1a1a]"
          label="Expected Today"
          sub="3 corporate · 4 OTA · 1 group"
          tooltip="Total guests expected today based on IDS FortuneNext manifest."
          dataTestid="kpi-expected"
        />
        <KpiCard
          icon={CheckCircle2}
          iconColor="text-green-500"
          value={totals.submitted}
          valueColor="text-green-600"
          label="Forms Submitted"
          sub={`${totals.submitted} / ${totals.total} · ${totals.pct}% complete`}
          tooltip="Guests who completed the WhatsApp pre-check-in form. Updates live."
          progress={totals.pct}
          dataTestid="kpi-submitted"
        />
        <KpiCard
          icon={Clock3}
          iconColor="text-amber-500"
          value={totals.awaiting}
          valueColor="text-amber-500"
          label="Awaiting Form"
          sub="Send reminder or show QR"
          tooltip="Guests who haven't yet submitted the check-in form."
          dataTestid="kpi-awaiting"
        />
        <KpiCard
          icon={AlertCircle}
          iconColor="text-orange-500"
          value={totals.noContact}
          valueColor="text-orange-500"
          label="OTA · No Contact"
          sub="Mobile required at desk"
          tooltip="Booking.com/MakeMyTrip bookings withhold guest contact pre-arrival. Capture mobile number when guest arrives."
          dataTestid="kpi-nocontact"
        />
      </div>

      {/* Filter tabs */}
      <div className="px-6 border-b border-[#E8E2D9] bg-white py-4 mt-2">
        <FilterTabs tabs={tabsWithCounts} active={tab} onChange={setTab} />
      </div>

      {/* Arrivals table */}
      <div className="mx-6 my-6 bg-white rounded-2xl shadow-sm border border-[#E8E2D9] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body" data-testid="arrivals-table">
            <thead className="bg-[#FAFAF8] border-b border-[#E8E2D9]">
              <tr>
                {["Guest", "Booking", "Room", "Source", "Expected", "Status", "ID", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF] text-left whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const busy = busyRows[r.id];
                const justSubmitted =
                  r.id === "RES-2401" && r.formSubmitted && !r.checkedIn;
                return (
                  <React.Fragment key={r.id}>
                    <tr
                      data-testid={`row-${r.id}`}
                      onClick={() => navigate(`/receptionist/guest/${encodeURIComponent(r.id)}`)}
                      className={`group border-b border-[#F9F5F0] hover:bg-[#FBF6EA] cursor-pointer transition-colors duration-150 relative ${
                        justSubmitted ? "bg-green-50/30 border-l-4 border-l-green-500" : ""
                      } ${busy === "done" ? "row-sweep" : ""}`}
                    >
                      <td className="px-4 py-4 align-middle">
                        <p className="font-body text-[14px] text-[#1a1a1a] font-medium hover:text-[#C9A84C] transition-colors">
                          {r.guestName}
                        </p>
                      </td>
                      <td className="px-4 py-4 align-middle font-ui text-[12px] text-[#6B7280]">
                        {r.id}
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <p className="font-ui text-[12px] text-[#1a1a1a]">{r.roomNumber}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{r.roomType}</p>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <SourcePill source={r.source} />
                      </td>
                      <td className="px-4 py-4 align-middle font-ui text-[12px] text-[#1a1a1a]">
                        {r.expectedTime || "—"}
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <RowStatus r={r} justSubmitted={justSubmitted} />
                      </td>
                      <td className="px-4 py-4 align-middle">
                        {r.idVerified ? (
                          <StatusPillLight kind="verified" label="✅ Verified" />
                        ) : r.formSubmitted ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); markIdVerified(r.id); }}
                            className="text-[11px] font-ui text-[#C9A84C] hover:underline"
                            data-testid={`mark-id-${r.id}`}
                          >
                            Verify
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#9CA3AF]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 align-middle" onClick={(e) => e.stopPropagation()}>
                        <RowActions
                          r={r}
                          busy={busy}
                          onResend={() => handleResend(r)}
                          onVerifyDrawer={() => navigate(`/receptionist/guest/${encodeURIComponent(r.id)}`)}
                          onCheckIn={() => handleCheckIn(r)}
                          onCapture={() => handleCapture(r)}
                          onViewGroup={() => navigate("/coordinator")}
                        />
                      </td>
                    </tr>
                    {/* Inline capture-mobile expand */}
                    {captureOpen === r.id && (
                      <tr className="bg-blue-50/40 border-b border-blue-100">
                        <td colSpan={8} className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">
                              Capture mobile for {r.guestName}
                            </p>
                            <input
                              type="tel"
                              value={captureValue}
                              onChange={(e) => setCaptureValue(e.target.value)}
                              placeholder="+91 98XXX XXXXX"
                              data-testid={`capture-input-${r.id}`}
                              className="flex-1 max-w-xs bg-white border border-[#E8E2D9] focus:border-[#C9A84C] outline-none px-3 py-2 rounded-lg text-[13px] font-body"
                            />
                            <button
                              onClick={() => submitCapture(r)}
                              data-testid={`capture-send-${r.id}`}
                              className="px-4 py-2 rounded-lg bg-[#C9A84C] text-[#0D0D0D] font-ui text-[11px] font-semibold tracking-wider hover:bg-[#E8C97A] transition-colors"
                            >
                              Send Link
                            </button>
                            <button className="font-ui text-[11px] text-[#6B7280] hover:text-[#1a1a1a] transition-colors">
                              Show QR
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RPA mini feed for reception */}
      <div className="mx-6 my-6 bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-5">
        <div className="flex items-center justify-between">
          <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#C9A84C] font-semibold">
            🤖 Recent RPA Write-Backs · IDS FortuneNext
          </p>
          <p className="font-ui text-[10px] text-[#9CA3AF]">live feed</p>
        </div>
        <ul className="mt-3 divide-y divide-[#F9F5F0]">
          {(reservations.filter((r) => r.formSubmitted || r.idVerified || r.checkedIn).slice(0, 5)).map((r) => (
            <li key={r.id} className="py-2 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="font-ui text-[11px] text-[#9CA3AF] uppercase tracking-[0.14em] w-16">
                {(r.idsSync?.at || "now")}
              </span>
              <span className="font-body text-[13px] text-[#1a1a1a] flex-1">
                {r.guestName} · {r.id} · 9 fields written
              </span>
              <span className="text-green-600 text-xs font-ui font-semibold">✅ Synced</span>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes rowSweep {
          0% { background: linear-gradient(90deg, rgba(34,197,94,0.2) 0%, transparent 0%); }
          100% { background: linear-gradient(90deg, rgba(34,197,94,0.2) 100%, transparent 100%); }
        }
        .row-sweep td { background: rgba(34,197,94,0.08); transition: background 600ms ease-out; }
      `}</style>
    </div>
  );
}

function RowStatus({ r, justSubmitted }) {
  if (r.checkedIn) return <StatusPillLight kind="checkedin" />;
  if (r.isGroup)
    return <StatusPillLight kind="pending" label={`${r.groupCheckedIn}/${r.groupTotal} 👥`} />;
  if (r.noContact) return <StatusPillLight kind="nocontact" />;
  if (r.formSubmitted)
    return (
      <span className="inline-flex items-center gap-2">
        <StatusPillLight kind="submitted" />
        {justSubmitted && (
          <span className="font-ui text-[10px] text-green-600 font-semibold animate-pulse">
            Just Now
          </span>
        )}
      </span>
    );
  if (r.isWalkin) return <StatusPillLight kind="linksent" />;
  return <StatusPillLight kind="pending" />;
}

function RowActions({ r, busy, onResend, onVerifyDrawer, onCheckIn, onCapture, onViewGroup }) {
  if (r.checkedIn) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-ui text-[11px] font-semibold">
        ✓ Checked-In
      </span>
    );
  }
  if (r.isGroup) return <Btn onClick={onViewGroup} variant="secondary" dataTestid={`view-group-${r.id}`}>View Group</Btn>;
  if (r.isWalkin) return <Btn onClick={onResend} variant="secondary">Resend</Btn>;

  if (r.noContact) {
    return (
      <Btn
        variant="primary"
        onClick={onCapture}
        dataTestid={`capture-mobile-${r.id}`}
      >
        <Phone size={11} className="mr-1" /> Capture Mobile
      </Btn>
    );
  }

  if (r.idVerified) {
    return (
      <Btn
        variant="primary"
        onClick={onCheckIn}
        dataTestid={`check-in-${r.id}`}
        disabled={busy === "checking" || busy === "done"}
      >
        {busy === "checking" ? <Spinner /> : <UserCheck size={11} className="mr-1" />}
        {busy === "checking" ? "Checking…" : "Check In"}
      </Btn>
    );
  }

  if (r.formSubmitted) {
    return (
      <div className="flex items-center gap-2">
        <Btn variant="primary" onClick={onVerifyDrawer} dataTestid={`verify-id-${r.id}`}>
          <ShieldCheck size={11} className="mr-1" /> Verify ID
        </Btn>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Btn
        variant="secondary"
        onClick={onResend}
        dataTestid={`resend-${r.id}`}
        disabled={busy === "sending" || busy === "sent"}
      >
        {busy === "sending" ? <Spinner /> : busy === "sent" ? "✓ Sent!" : <><Send size={11} className="mr-1" /> Resend</>}
      </Btn>
      <Btn variant="secondary" onClick={() => {}}>
        <QrCode size={11} className="mr-1" /> QR
      </Btn>
    </div>
  );
}

function Btn({ children, variant = "secondary", onClick, disabled, dataTestid }) {
  const cls =
    variant === "primary"
      ? "bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0D0D0D] font-medium"
      : "border border-[#E8E2D9] text-[#6B7280] hover:border-[#C9A84C] hover:text-[#C9A84C]";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestid}
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-ui transition-all disabled:opacity-50 disabled:cursor-not-allowed ${cls}`}
    >
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-3 h-3 mr-1.5 rounded-full border-2 border-current/30 border-t-current animate-spin" />
  );
}
