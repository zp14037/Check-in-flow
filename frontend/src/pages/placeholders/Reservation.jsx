import React, { useState, useEffect, useMemo } from "react";
import { Info, Send, Edit3, Trash2, Mail } from "lucide-react";
import DashboardShell from "../../components/della/DashboardShell";
import SourcePill from "../../components/receptionist/SourcePill";
import { useApp } from "../../context/AppContext";
import ToastHost, { toast } from "../../components/receptionist/ToastHost";

/**
 * Reservation Team · Live Email Parser
 * Monitors reservations@dellaresorts.com 24/7 (simulated).
 */

const EMAILS_SEED = [
  {
    id: "e1",
    source: "booking",
    avatar: { letter: "B", bg: "bg-orange-500" },
    sender: "Booking.com Reservations",
    subject: "Booking Conf - James Wilson #BCom-8812",
    preview: "Arrival 14 May · Superior Room · 2 nights",
    time: "2m",
    unread: true,
    confidence: 97,
    parsed: {
      "Guest Name": { v: "James Wilson", ok: true },
      "Booking Ref": { v: "BCom-8812", ok: true },
      "Check-in": { v: "14 May 2026", ok: true },
      "Check-out": { v: "16 May 2026", ok: true },
      "Room Type": { v: "Superior Room", ok: true },
      "Email": { v: "guest@booking.com", masked: true, note: "⚠️ OTA masked" },
      "Mobile": { missing: true },
      "Rate/Night": { v: "₹8,500", ok: true },
      "Nationality": { v: "British", ok: true },
      "OTA Source": { v: "Booking.com", ok: true },
    },
    createTarget: {
      fullName: "James Wilson", source: "booking", roomType: "Superior",
      roomNumber: "SR-11", nights: 2, adults: 2, children: 0, mobile: "",
      arrival: "2026-05-14", expectedTime: "4:00 PM", nationality: "British",
      country: "UK", noContact: true, sourcePrefix: "BCom",
    },
  },
  {
    id: "e2",
    source: "mmt",
    avatar: { letter: "M", bg: "bg-red-500" },
    sender: "MakeMyTrip Vouchers",
    subject: "Hotel Voucher - Neha Kapoor",
    preview: "Room: Designer Suite · 1 May arrival",
    time: "8m",
    unread: true,
    confidence: 94,
    parsed: {
      "Guest Name": { v: "Neha Kapoor", ok: true },
      "Booking Ref": { v: "MMT-4421", ok: true },
      "Check-in": { v: "18 Feb 2026", ok: true },
      "Check-out": { v: "20 Feb 2026", ok: true },
      "Room Type": { v: "Designer Suite", ok: true },
      "Email": { v: "neha.k***@gmail.com", masked: true, note: "⚠️ Partial" },
      "Mobile": { missing: true },
      "Rate/Night": { v: "₹14,200", ok: true },
      "Nationality": { v: "Indian", ok: true },
      "OTA Source": { v: "MakeMyTrip", ok: true },
    },
    createTarget: {
      fullName: "Neha Kapoor", source: "mmt", roomType: "Designer Suite",
      roomNumber: "DS-02", nights: 2, adults: 2, children: 1, mobile: "",
      arrival: "2026-02-18", expectedTime: "1:00 PM", noContact: true,
      sourcePrefix: "MMT",
    },
  },
  {
    id: "e3",
    source: "sales",
    avatar: { letter: "C", bg: "bg-purple-600" },
    sender: "TCS Corporate Travel",
    subject: "TCS Annual Offsite - 32 guests",
    preview: "Group block confirmed · 12 rooms · 11 May",
    time: "15m",
    unread: true,
    confidence: 99,
    parsed: {
      "Guest Name": { v: "TCS Annual Offsite", ok: true },
      "Booking Ref": { v: "GRP-0091", ok: true },
      "Check-in": { v: "11 May 2026", ok: true },
      "Check-out": { v: "13 May 2026", ok: true },
      "Room Type": { v: "12 Rooms · Group Block", ok: true },
      "Email": { v: "sheetal.m@tcs.com", ok: true },
      "Mobile": { v: "+91 98201 11111", ok: true },
      "Rate/Night": { v: "₹6,800 (corp)", ok: true },
      "Nationality": { v: "Indian", ok: true },
      "OTA Source": { v: "Direct Corporate", ok: true },
    },
    createTarget: {
      fullName: "TCS Annual Offsite", source: "sales", roomType: "Group Block",
      roomNumber: "GRP-A", nights: 2, adults: 32, mobile: "+91 98201 11111",
      arrival: "2026-05-11", expectedTime: "11:00 AM", sourcePrefix: "GRP",
      company: "TCS",
    },
  },
  {
    id: "e4",
    source: "booking",
    avatar: { letter: "B", bg: "bg-orange-500" },
    sender: "Booking.com Reservations",
    subject: "Res #BCom-9002 - David Lee",
    preview: "Superior Room · partial data",
    time: "1h",
    unread: false,
    confidence: 71,
    parsed: {
      "Guest Name": { v: "David Lee", ok: true },
      "Booking Ref": { v: "BCom-9002", ok: true },
      "Check-in": { v: "18 Feb 2026", ok: true },
      "Check-out": { missing: true },
      "Room Type": { v: "Luxury Room", ok: true },
      "Email": { missing: true },
      "Mobile": { missing: true },
      "Rate/Night": { missing: true },
      "Nationality": { v: "Singaporean", ok: true },
      "OTA Source": { v: "Booking.com", ok: true },
    },
    createTarget: {
      fullName: "David Lee", source: "booking", roomType: "Luxury",
      roomNumber: "LR-08", nights: 2, adults: 2, mobile: "",
      arrival: "2026-02-18", expectedTime: "6:00 PM", noContact: true,
      sourcePrefix: "BCom",
    },
  },
  {
    id: "e5",
    source: "direct",
    avatar: { letter: "D", bg: "bg-[#C9A84C] text-[#0D0D0D]" },
    sender: "Della SwiftBook",
    subject: "SwiftBook - Aarav Mehta RES-2401",
    preview: "Direct website booking · Cliff Villa",
    time: "2h",
    unread: false,
    confidence: 100,
    parsed: {
      "Guest Name": { v: "Aarav Mehta", ok: true },
      "Booking Ref": { v: "RES-2401", ok: true },
      "Check-in": { v: "18 Feb 2026", ok: true },
      "Check-out": { v: "20 Feb 2026", ok: true },
      "Room Type": { v: "Cliff Villa · CV-12", ok: true },
      "Email": { v: "aarav.m@gmail.com", ok: true },
      "Mobile": { v: "+91 98200 45621", ok: true },
      "Rate/Night": { v: "₹22,000", ok: true },
      "Nationality": { v: "Indian", ok: true },
      "OTA Source": { v: "Direct · SwiftBook", ok: true },
    },
  },
  {
    id: "e6",
    source: "sales",
    avatar: { letter: "T", bg: "bg-gray-500" },
    sender: "Sapphire Travels (Agent)",
    subject: "Wedding Voucher WED-0011 - Sharma",
    preview: "Presidential Suite · 3 nights",
    time: "3h",
    unread: false,
    confidence: 96,
    parsed: {
      "Guest Name": { v: "Vihaan Sharma", ok: true },
      "Booking Ref": { v: "WED-0011", ok: true },
      "Check-in": { v: "18 Feb 2026", ok: true },
      "Check-out": { v: "21 Feb 2026", ok: true },
      "Room Type": { v: "Presidential PS-01", ok: true },
      "Email": { v: "vihaan@example.com", ok: true },
      "Mobile": { v: "+91 90000 11111", ok: true },
      "Rate/Night": { v: "₹48,000", ok: true },
      "Nationality": { v: "Indian", ok: true },
      "OTA Source": { v: "Travel Agent", ok: true },
    },
  },
  {
    id: "e7",
    source: "mmt",
    avatar: { letter: "M", bg: "bg-red-500" },
    sender: "MakeMyTrip Vouchers",
    subject: "Voucher MMT-5521 - Kabir Mehta",
    preview: "Adventure Room · 1 night",
    time: "4h",
    unread: false,
    confidence: 88,
    parsed: {
      "Guest Name": { v: "Kabir Mehta", ok: true },
      "Booking Ref": { v: "MMT-5521", ok: true },
      "Check-in": { v: "18 Feb 2026", ok: true },
      "Check-out": { v: "19 Feb 2026", ok: true },
      "Room Type": { v: "Adventure AR-14", ok: true },
      "Email": { v: "k***@gmail.com", masked: true, note: "⚠️ OTA masked" },
      "Mobile": { missing: true },
      "Rate/Night": { v: "₹11,400", ok: true },
      "Nationality": { v: "Indian", ok: true },
      "OTA Source": { v: "MakeMyTrip", ok: true },
    },
  },
  {
    id: "e8",
    source: "direct",
    avatar: { letter: "D", bg: "bg-[#C9A84C] text-[#0D0D0D]" },
    sender: "Della SwiftBook",
    subject: "Confirmation RES-2402 - Priya Sharma",
    preview: "Lake Suite · 3 nights",
    time: "5h",
    unread: false,
    confidence: 98,
    parsed: {
      "Guest Name": { v: "Priya Sharma", ok: true },
      "Booking Ref": { v: "RES-2402", ok: true },
      "Check-in": { v: "18 Feb 2026", ok: true },
      "Check-out": { v: "21 Feb 2026", ok: true },
      "Room Type": { v: "Lake Suite · LS-04", ok: true },
      "Email": { v: "priya.sharma@example.com", ok: true },
      "Mobile": { v: "+91 98765 11220", ok: true },
      "Rate/Night": { v: "₹18,500", ok: true },
      "Nationality": { v: "Indian", ok: true },
      "OTA Source": { v: "Direct · SwiftBook", ok: true },
    },
  },
];

function confidenceColor(score) {
  if (score >= 90) return { fg: "text-green-600", bar: "bg-green-500", border: "border-green-200" };
  if (score >= 85) return { fg: "text-amber-500", bar: "bg-amber-400", border: "border-amber-200" };
  return { fg: "text-red-500", bar: "bg-red-500", border: "border-red-200" };
}

function statusBadge(score) {
  if (score >= 90) return { cls: "bg-green-50 text-green-700 border-green-200", label: "✅ Auto-Created" };
  if (score >= 85) return { cls: "bg-amber-50 text-amber-700 border-amber-200", label: "⚠️ Review Required" };
  return { cls: "bg-red-50 text-red-700 border-red-200", label: "❌ Manual Entry" };
}

export default function Reservation() {
  const { addReservation } = useApp();
  const [emails, setEmails] = useState(EMAILS_SEED);
  const [selectedId, setSelectedId] = useState("e1");
  const [parsing, setParsing] = useState(false);
  const [createdIds, setCreatedIds] = useState({}); // {emailId: true}
  const [creating, setCreating] = useState(null); // emailId being created

  const selected = useMemo(() => emails.find((e) => e.id === selectedId), [emails, selectedId]);

  // Counters
  const processedToday = 14 + Object.keys(createdIds).length;
  const flagged = emails.filter((e) => e.confidence < 90 && e.confidence >= 85).length;

  // Mark unread as read when selected
  useEffect(() => {
    setEmails((es) => es.map((e) => (e.id === selectedId ? { ...e, unread: false } : e)));
  }, [selectedId]);

  const simulateNewEmail = () => {
    const id = `new-${Date.now()}`;
    const fake = {
      id,
      source: "booking",
      avatar: { letter: "B", bg: "bg-orange-500" },
      sender: "Booking.com Reservations",
      subject: `Booking Conf - New Guest #BCom-${String(Date.now()).slice(-4)}`,
      preview: "Just received · parsing now",
      time: "now",
      unread: true,
      confidence: 92,
      parsed: {
        "Guest Name": { v: "Auto Parsed Guest", ok: true },
        "Booking Ref": { v: `BCom-${String(Date.now()).slice(-4)}`, ok: true },
        "Check-in": { v: "20 May 2026", ok: true },
        "Check-out": { v: "22 May 2026", ok: true },
        "Room Type": { v: "Superior Room", ok: true },
        "Email": { v: "guest@booking.com", masked: true, note: "⚠️ OTA masked" },
        "Mobile": { missing: true },
        "Rate/Night": { v: "₹9,200", ok: true },
        "Nationality": { v: "Indian", ok: true },
        "OTA Source": { v: "Booking.com", ok: true },
      },
      createTarget: {
        fullName: "Auto Parsed Guest", source: "booking", roomType: "Superior",
        roomNumber: "SR-A", nights: 2, adults: 2, mobile: "",
        arrival: "2026-05-20", expectedTime: "3:00 PM", noContact: true,
        sourcePrefix: "BCom",
      },
      _isNew: true,
    };
    setEmails((es) => [fake, ...es]);
    setSelectedId(id);
    setParsing(true);
    setTimeout(() => setParsing(false), 1300);
  };

  const createRecord = () => {
    if (!selected?.createTarget || creating || createdIds[selected.id]) return;
    setCreating(selected.id);
    setTimeout(() => {
      const newId = addReservation({
        ...selected.createTarget,
        actor: "reservation",
      });
      setCreatedIds((m) => ({ ...m, [selected.id]: true }));
      setCreating(null);
      toast(
        `✅ ${selected.createTarget.fullName} added to Today's Arrivals${
          selected.createTarget.noContact ? " · 🔶 OTA No-Contact flag set" : ""
        } · ${newId}`
      );
    }, 700);
  };

  const dismissEmail = () => {
    setEmails((es) => es.filter((e) => e.id !== selectedId));
    const fallback = emails.find((e) => e.id !== selectedId);
    if (fallback) setSelectedId(fallback.id);
    toast("📭 Email dismissed");
  };

  const showOtaWarning = selected?.source === "booking" || selected?.source === "mmt";

  return (
    <DashboardShell
      title="Reservation Team · Email Parser"
      subtitle="Live monitor for reservations@dellaresorts.com — 24/7 automated parsing of OTA vouchers and booking confirmations."
      accent="Reservations"
    >
      {/* Parser status bar */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-5 mb-4" data-testid="parser-status-bar">
        <div className="flex flex-wrap items-center gap-6 justify-between">
          <div className="min-w-[260px]">
            <p className="font-ui text-[13px] font-semibold text-[#1a1a1a]">
              📧 reservations@dellaresorts.com
            </p>
            <p className="font-body text-[11px] text-[#6B7280] mt-0.5">
              Automated 24/7 monitoring — OTA vouchers, booking confirmations, group contracts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-green-400 pulse-ring" />
            </span>
            <div>
              <p className="font-ui text-[12px] font-bold text-green-700 tracking-wide">
                PARSER ACTIVE
              </p>
              <p className="font-body text-[10px] text-[#6B7280]">24/7 automated scanning</p>
            </div>
          </div>

          <div className="flex items-center gap-7">
            <Counter value={processedToday} label="processed today" color="text-[#1a1a1a]" />
            <Counter value={flagged} label="flagged" color="text-amber-500" />
            <Counter value={0} label="errors" color="text-green-600" />
          </div>
        </div>

        {/* Marquee */}
        <div className="mt-4 bg-[#FAFAF8] rounded-xl border border-[#E8E2D9] overflow-hidden">
          <div className="marquee py-2 whitespace-nowrap font-ui text-[10px] text-[#9CA3AF] uppercase tracking-[0.16em]">
            <span className="inline-block px-6">
              ● Last scan: 2m ago · BCom: 4 vouchers · MMT: 3 vouchers · Della Direct: 5 · Sales Confirmations: 2 · Avg parse time: 1.3s · Queue: 0 · All systems clear ●
            </span>
            <span className="inline-block px-6" aria-hidden="true">
              ● Last scan: 2m ago · BCom: 4 vouchers · MMT: 3 vouchers · Della Direct: 5 · Sales Confirmations: 2 · Avg parse time: 1.3s · Queue: 0 · All systems clear ●
            </span>
          </div>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        {/* Left — inbox feed */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden flex flex-col max-h-[640px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E2D9] bg-[#FAFAF8]">
            <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9CA3AF]">
              Inbox Feed
            </p>
            <button
              onClick={simulateNewEmail}
              data-testid="simulate-email"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-ui text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors"
            >
              <Mail size={11} /> Simulate New
            </button>
          </div>

          <div className="overflow-y-auto" data-testid="inbox-feed">
            {emails.map((e) => {
              const isSel = e.id === selectedId;
              const created = createdIds[e.id];
              return (
                <button
                  key={e.id}
                  onClick={() => setSelectedId(e.id)}
                  data-testid={`email-${e.id}`}
                  className={`w-full text-left flex gap-3 p-3 border-b border-[#F9F5F0] transition-colors ${
                    isSel
                      ? "bg-[#FFF9E6] border-l-2 border-l-[#C9A84C]"
                      : "hover:bg-[#FAFAF8]"
                  } ${e._isNew ? "email-pop" : ""}`}
                >
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-ui font-bold text-sm shrink-0 ${e.avatar.bg} ${e.avatar.bg.includes("text-") ? "" : "text-white"}`}
                  >
                    {e.avatar.letter}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-ui text-[12px] font-semibold truncate ${
                        e.unread ? "text-[#1a1a1a]" : "text-[#6B7280]"
                      }`}
                    >
                      {e.sender}
                    </p>
                    <p className="font-body text-[12px] text-[#6B7280] truncate">
                      {created && <span className="text-green-600">✅ </span>}
                      {e.subject}
                    </p>
                    <p className="font-body text-[10px] text-[#9CA3AF] truncate">
                      {e.preview}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="font-ui text-[10px] text-[#9CA3AF]">{e.time}</span>
                    {e.unread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </button>
              );
            })}
            {emails.length === 0 && (
              <p className="text-center font-body text-[12px] text-[#9CA3AF] italic p-6">
                Inbox empty — waiting for new emails…
              </p>
            )}
          </div>
        </div>

        {/* Right — extracted data */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-6 flex flex-col gap-5 min-h-[640px]">
          {parsing ? (
            <ParsingShimmer />
          ) : selected ? (
            <>
              <ExtractedHeader email={selected} created={Boolean(createdIds[selected.id])} />
              <ConfidenceBlock score={selected.confidence} />
              <FieldsGrid parsed={selected.parsed} />
              {showOtaWarning && <OtaWarning />}
              <Actions
                onCreate={createRecord}
                onDismiss={dismissEmail}
                creating={creating === selected.id}
                created={Boolean(createdIds[selected.id])}
              />
            </>
          ) : (
            <p className="text-center font-body text-[13px] text-[#9CA3AF] italic m-auto">
              Select an email from the inbox to view extracted data.
            </p>
          )}
        </div>
      </div>

      <ToastHost />

      <style>{`
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(74,222,128,0.7); }
          70% { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
        }
        .pulse-ring { animation: pulseRing 2s infinite; }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee { display: flex; animation: marqueeScroll 25s linear infinite; will-change: transform; }
        @keyframes emailPop {
          from { transform: translateY(-16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .email-pop { animation: emailPop 260ms ease-out; }
        @keyframes shimmerSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-line {
          background: linear-gradient(90deg, #F0EAE0 0%, #FBF8F2 50%, #F0EAE0 100%);
          background-size: 200% 100%;
          animation: shimmerSweep 1.2s linear infinite;
        }
      `}</style>
    </DashboardShell>
  );
}

function Counter({ value, label, color }) {
  return (
    <div className="text-center">
      <p className={`font-display italic leading-none ${color}`} style={{ fontSize: 32 }}>
        {value}
      </p>
      <p className="font-ui text-[10px] text-[#6B7280] mt-1 uppercase tracking-[0.12em]">
        {label}
      </p>
    </div>
  );
}

function ExtractedHeader({ email, created }) {
  const s = statusBadge(email.confidence);
  return (
    <div className="flex flex-wrap items-center gap-3 justify-between">
      <div className="flex items-center gap-3">
        <SourcePill source={email.source} />
        <span
          data-testid="parser-status-badge"
          className={`inline-flex items-center px-3 py-1 rounded-full border text-[11px] font-ui font-semibold ${s.cls}`}
        >
          {created ? "✅ Record Created" : s.label}
        </span>
      </div>
      <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#9CA3AF]">
        Parsed {email.time} ago
      </p>
    </div>
  );
}

function ConfidenceBlock({ score }) {
  const c = confidenceColor(score);
  const [hover, setHover] = useState(false);
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#9CA3AF] font-semibold">
          Parser Confidence
        </p>
        <button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="w-5 h-5 rounded-full bg-[#F5F0E8] text-[#6B7280] flex items-center justify-center hover:bg-[#E8E2D9]"
          aria-label="confidence info"
        >
          <Info size={11} />
        </button>
        {hover && (
          <div className="absolute top-6 left-0 z-20 w-72 bg-[#1a1a1a] text-[#F5F0E8]/90 border border-white/10 rounded-xl p-3 shadow-xl text-[11px] font-body leading-relaxed">
            How accurately the parser extracted fields from the raw email.
            <br />• ≥90%: arrival record auto-created in dashboard.
            <br />• 85–89%: created with amber ⚠️ flag for human review.
            <br />• Below 85%: held for manual review — receptionist must verify.
          </div>
        )}
      </div>
      <div className="flex items-end justify-between mt-2">
        <p className={`font-display italic leading-none ${c.fg}`} style={{ fontSize: 56 }} data-testid="confidence-score">
          {score}%
        </p>
        <p className="font-body text-[11px] text-[#9CA3AF]">
          {score >= 90 ? "Auto-create eligible" : score >= 85 ? "Review recommended" : "Manual review required"}
        </p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full ${c.bar}`}
          style={{ width: `${score}%`, transition: "width 600ms ease-out" }}
        />
      </div>
    </div>
  );
}

function FieldsGrid({ parsed }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="extracted-fields">
      {Object.entries(parsed).map(([k, f]) => {
        let wrapCls = "bg-[#FAFAF8] border-[#E8E2D9]";
        let valueEl = (
          <p className="font-body text-[14px] font-medium text-[#1a1a1a]">{f.v}</p>
        );
        if (f.missing) {
          wrapCls = "bg-red-50 border-red-200";
          valueEl = (
            <p className="font-body italic text-[14px] text-red-500">Not Available</p>
          );
        } else if (f.masked) {
          wrapCls = "bg-amber-50 border-amber-200";
          valueEl = (
            <>
              <p className="font-body text-[14px] font-medium text-amber-700">{f.v}</p>
              {f.note && (
                <p className="font-ui text-[9px] text-amber-600 mt-1 uppercase tracking-[0.16em]">
                  {f.note}
                </p>
              )}
            </>
          );
        }
        return (
          <div key={k} className={`rounded-xl p-3 border ${wrapCls}`}>
            <p className="font-ui text-[9px] text-[#9CA3AF] uppercase tracking-[0.16em] mb-1 font-semibold">
              {k}
            </p>
            {valueEl}
          </div>
        );
      })}
    </div>
  );
}

function OtaWarning() {
  return (
    <div className="rounded-r-2xl bg-amber-50 border-l-4 border-amber-400 p-4" data-testid="ota-warning">
      <p className="font-ui text-[11px] font-semibold text-amber-800 uppercase tracking-[0.12em]">
        ⚠️ OTA Contact Protection
      </p>
      <p className="font-body text-[12px] text-[#1a1a1a]/85 mt-2 leading-relaxed">
        Booking.com and MakeMyTrip mask guest contact details pre-arrival to protect their
        commission model. Mobile must be captured at front desk on arrival.{" "}
        <strong>~80% of OTA bookings arrive without real contact details.</strong>
      </p>
    </div>
  );
}

function Actions({ onCreate, onDismiss, creating, created }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
      <button
        onClick={onCreate}
        disabled={creating || created}
        data-testid="create-arrival"
        className={`inline-flex items-center gap-2 h-11 px-6 rounded-full font-ui text-[12px] font-bold uppercase tracking-[0.14em] transition-all ${
          created
            ? "bg-green-500 text-white cursor-default"
            : "bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0D0D0D] disabled:opacity-60"
        }`}
      >
        {creating ? (
          <>
            <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-[#0D0D0D]/30 border-t-[#0D0D0D] animate-spin" />
            Creating…
          </>
        ) : created ? (
          <>✅ Record Created</>
        ) : (
          <>
            <Send size={13} /> Create Arrival Record
          </>
        )}
      </button>
      <button
        data-testid="edit-fields"
        className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors"
      >
        <Edit3 size={13} /> Edit Fields
      </button>
      <button
        onClick={onDismiss}
        data-testid="dismiss-email"
        className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-red-500 hover:bg-red-50 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors"
      >
        <Trash2 size={13} /> Dismiss
      </button>
    </div>
  );
}

function ParsingShimmer() {
  return (
    <div className="flex-1 flex flex-col gap-4" data-testid="parsing-shimmer">
      <div className="flex items-center gap-2">
        <span className="font-ui text-[11px] text-[#C9A84C] font-semibold tracking-wider">
          📨 PARSING NEW EMAIL…
        </span>
        <span className="inline-block w-3 h-3 rounded-full border-2 border-[#C9A84C]/30 border-t-[#C9A84C] animate-spin" />
      </div>
      <div className="h-14 rounded-xl shimmer-line" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl shimmer-line" />
        ))}
      </div>
    </div>
  );
}
