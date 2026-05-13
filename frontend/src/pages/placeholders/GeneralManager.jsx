import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import {
  Info,
  Bell,
  Mail,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Users,
  Wifi,
  Wrench,
  Lock,
  Building2,
  Smartphone,
  Bot,
  Play,
} from "lucide-react";
import DashboardShell from "../../components/della/DashboardShell";
import { useApp } from "../../context/AppContext";
import ToastHost, { toast } from "../../components/receptionist/ToastHost";

const WEEK = [
  { day: "Mon", arrivals: 32 },
  { day: "Tue", arrivals: 28 },
  { day: "Wed", arrivals: 47 },
  { day: "Thu", arrivals: 41 },
  { day: "Fri", arrivals: 55 },
  { day: "Sat", arrivals: 62 },
  { day: "Sun", arrivals: 38 },
];

const MIX = [
  { name: "Direct Website", value: 35, color: "#3B82F6" },
  { name: "Booking.com", value: 20, color: "#E8A020" },
  { name: "MakeMyTrip", value: 15, color: "#DC2626" },
  { name: "Sales/Corp", value: 22, color: "#7C3AED" },
  { name: "Walk-in", value: 8, color: "#6B7280" },
];

const SEED_RPA_LOG = [
  { ts: "10:24 AM", guest: "Rahul Verma", booking: "SLS-1102", fields: "9 fields", duration: "0.6s" },
  { ts: "10:18 AM", guest: "Sharma Wedding", booking: "WED-0011", fields: "11 fields", duration: "0.9s" },
  { ts: "09:55 AM", guest: "Aisha Khan", booking: "WA-0032", fields: "8 fields", duration: "0.7s" },
  { ts: "09:32 AM", guest: "TCS Block", booking: "GRP-0091", fields: "18×7 fields (bulk)", duration: "4.2s" },
];

const HEALTH_SEED = [
  { icon: Mail, name: "Email Parser", sub: "reservations@dellaresorts.com", status: "ok", label: "✅ Active", lastPing: 120 },
  { icon: Smartphone, name: "WhatsApp API", sub: "Business API · wa.me integration", status: "ok", label: "✅ 97.3% delivery", lastPing: 0 },
  { icon: Bot, name: "RPA Engine", sub: "IDS FortuneNext write-back agent", status: "warn", label: "⏳ 2 pending", lastPing: 30 },
  { icon: Building2, name: "IDS FortuneNext", sub: "Property Management System · Lonavala", status: "ok", label: "✅ Connected", lastPing: 34 },
  { icon: Wifi, name: "SwiftBook / STAAH", sub: "Direct booking channel manager", status: "ok", label: "✅ Synced", lastPing: 300 },
  { icon: Lock, name: "Data Encryption", sub: "PDPA 2023 compliant · AES-256", status: "ok", label: "✅ Active", lastPing: 0 },
];

export default function GeneralManager() {
  const { reservations, activityLog } = useApp();

  // KPIs from session
  const total = 47;
  const submittedCount = reservations.filter((r) => r.formSubmitted).length;
  const submittedPct = Math.round((submittedCount / total) * 100);
  const verifiedCount = reservations.filter((r) => r.idVerified).length;

  // ── RPA pipeline state ──
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(-1); // -1 idle
  const [running, setRunning] = useState(false);
  const [rpaLog, setRpaLog] = useState(SEED_RPA_LOG);
  const [showNode4Tooltip, setShowNode4Tooltip] = useState(false);
  const [fortuneOpen, setFortuneOpen] = useState(false);
  const [fortuneFields, setFortuneFields] = useState({});

  // ── Health panel ticking ──
  const [pingTick, setPingTick] = useState(0);
  const [health, setHealth] = useState(HEALTH_SEED);
  const lastCheckRef = useRef(Date.now());
  const [lastCheckAgo, setLastCheckAgo] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPingTick((n) => n + 1);
      setLastCheckAgo(Math.floor((Date.now() - lastCheckRef.current) / 1000));
      setHealth((arr) =>
        arr.map((h) => (typeof h.lastPing === "number" ? { ...h, lastPing: h.lastPing + 1 } : h))
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const runDemoSync = () => {
    if (running) return;
    setRunning(true);
    setStepIdx(0);
    setFortuneOpen(true);
    setFortuneFields({});
    setTimeout(() => setStepIdx(1), 800);
    setTimeout(() => setStepIdx(2), 1400);
    setTimeout(() => {
      setStepIdx(3);
      setShowNode4Tooltip(true);
      // Type fields into FortuneNext mock
      const FIELDS = [
        ["Guest Name", "Aarav Mehta"],
        ["Booking Ref", "RES-2401"],
        ["Mobile", "+91 98200 45621"],
        ["Email", "aarav.m@gmail.com"],
        ["Nationality", "Indian"],
        ["ID Type", "Aadhaar Card"],
        ["ID Number", "**** 4521"],
        ["Room", "CV-12 · Cliff Villa"],
        ["Occasion", "Anniversary"],
      ];
      FIELDS.forEach(([k, v], i) => {
        setTimeout(() => {
          setFortuneFields((m) => ({ ...m, [k]: v }));
        }, i * 95);
      });
    }, 1800);
    setTimeout(() => {
      setShowNode4Tooltip(false);
      setStepIdx(4);
    }, 2700);
    setTimeout(() => {
      setRpaLog((arr) => [
        {
          ts: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          guest: "Aarav Mehta",
          booking: "RES-2401",
          fields: "9 fields",
          duration: "0.8s",
          fresh: true,
        },
        ...arr,
      ]);
      lastCheckRef.current = Date.now();
      setHealth((arr) =>
        arr.map((h) => (h.name === "IDS FortuneNext" ? { ...h, lastPing: 0 } : h))
      );
      toast("✅ RPA wrote 9 fields → IDS FortuneNext (0.8s)");
    }, 3200);
    setTimeout(() => {
      setStepIdx(-1);
      setRunning(false);
    }, 4000);
    setTimeout(() => {
      setFortuneOpen(false);
      setFortuneFields({});
    }, 6500);
  };

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardShell
      title="Good Evening, Mr. Rahil Bakali"
      subtitle={`Operations Manager · Full System Access · ${today}`}
      accent="Operations Manager"
      rightSlot={
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-1.5 text-[11px] font-ui uppercase tracking-[0.2em] text-[#F5F0E8]/80 hover:text-[#C9A84C] transition-colors">
            <Mail size={13} /> Email Briefing
          </button>
          <button className="relative w-9 h-9 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
            <Bell size={16} className="text-[#F5F0E8]" />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-ui font-bold flex items-center justify-center">
              3
            </span>
          </button>
          <span className="w-9 h-9 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#0D0D0D] text-xs font-ui font-bold ring-2 ring-[#C9A84C]/40">
            RB
          </span>
        </div>
      }
    >
      {/* KPI strip — 2 rows of 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Kpi
          icon={Users}
          color="text-blue-500"
          value="47"
          label="Today's Arrivals"
          tooltip="Total guests expected per IDS manifest"
          dataTestid="gm-kpi-arrivals"
          onClick={() => navigate("/receptionist")}
        />
        <Kpi
          icon={CheckCircle2}
          color="text-green-500"
          value={`${submittedCount}/${total}`}
          valueColor="text-green-600"
          label="Forms Submitted"
          tooltip="Pre-check-in forms completed via WhatsApp. Updates live across all dashboards."
          progress={submittedPct}
          sub={`${submittedPct}% complete · ${submittedCount} live`}
          dataTestid="gm-kpi-submitted"
          onClick={() => navigate("/receptionist")}
        />
        <Kpi
          icon={AlertCircle}
          color="text-amber-500"
          value="5"
          valueColor="text-amber-500"
          label="OTA No-Contact"
          tooltip="Booking.com / MakeMyTrip bookings where contact is unavailable pre-arrival."
          onClick={() => navigate("/receptionist")}
        />
        <Kpi
          icon={Users}
          color="text-teal-600"
          value="1 · TCS · 32 pax"
          valueColor="text-teal-700"
          label="Active Groups"
          tooltip="Click to open the Group Coordinator live tracker."
          progress={56}
          progressColor="bg-amber-400"
          sub="18 / 32 guests submitted"
          dataTestid="gm-kpi-groups"
          onClick={() => navigate("/coordinator")}
        />
        <Kpi
          icon={Wrench}
          color="text-green-500"
          value="All Synced ✓"
          valueColor="text-green-600"
          label="IDS Sync"
          tooltip="RPA has successfully written all submitted form data into IDS FortuneNext. Click to scroll to the RPA Engine."
          sub="Last write-back: 34s ago"
          extra={<span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-green-400 pulse-ring" />}
          onClick={() => document.getElementById("rpa-section")?.scrollIntoView({ behavior: "smooth" })}
        />
        <Kpi
          icon={Clock3}
          color="text-[#C9A84C]"
          value="₹4,82,000"
          valueColor="text-[#C9A84C]"
          label="Revenue Today"
          tooltip="Realised revenue against expected end-of-day target. Click to open Sales."
          sub="₹6,20,000 projected EOD"
          onClick={() => navigate("/sales")}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display italic text-[22px] text-[#1a1a1a]">Arrivals This Week</h3>
            <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-[#9CA3AF]">
              {today.split(",")[0]} · Today highlighted
            </p>
          </div>
          <div className="mt-4" style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={WEEK} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
                <XAxis dataKey="day" tick={{ fontFamily: "Inter", fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: "Inter", fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<WeekTooltip />} cursor={{ fill: "rgba(201,168,76,0.06)" }} />
                <Bar dataKey="arrivals" radius={[8, 8, 0, 0]}>
                  {WEEK.map((d) => (
                    <Cell key={d.day} fill={d.day === "Wed" ? "#C9A84C" : "#E8E2D9"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display italic text-[22px] text-[#1a1a1a]">Booking Source Mix</h3>
            <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-[#9CA3AF]">May 2026</p>
          </div>
          <div className="mt-2" style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={MIX}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  isAnimationActive={false}
                >
                  {MIX.map((m) => (
                    <Cell key={m.name} fill={m.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<MixTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-1.5 mt-2">
            {MIX.map((m) => (
              <div key={m.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: m.color }} />
                  <span className="font-ui text-[11px] text-[#1a1a1a]">{m.name}</span>
                </span>
                <span className="font-ui text-[11px] font-bold text-[#1a1a1a]">{m.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel */}
      <Funnel submittedCount={submittedCount} submittedPct={submittedPct} verifiedCount={verifiedCount} />

      {/* RPA Engine */}
      <div id="rpa-section">
        <RpaSection
          stepIdx={stepIdx}
          running={running}
          onRun={runDemoSync}
          showNode4Tooltip={showNode4Tooltip}
          rpaLog={rpaLog}
        />
      </div>

      {/* FortuneNext faux PMS overlay */}
      <FortuneNextMock open={fortuneOpen} fields={fortuneFields} onClose={() => setFortuneOpen(false)} />

      {/* System Health */}
      <SystemHealth health={health} pingTick={pingTick} lastCheckAgo={lastCheckAgo} />

      {/* Recent activity log */}
      {activityLog.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-6">
          <h3 className="font-display italic text-[22px] text-[#1a1a1a]">Activity Log</h3>
          <ul className="mt-3 divide-y divide-[#F9F5F0] max-h-56 overflow-y-auto">
            {activityLog.slice(0, 12).map((a, i) => (
              <li key={i} className="py-2 flex items-center gap-3">
                <span className="font-ui text-[9px] uppercase tracking-[0.22em] text-[#9CA3AF] w-24 shrink-0">
                  {a.actor}
                </span>
                <span className="font-body text-[12px] text-[#1a1a1a]">{a.message}</span>
                <span className="ml-auto font-ui text-[10px] text-[#9CA3AF]">
                  {timeAgo(a.ts)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ToastHost />

      <style>{`
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(74,222,128,0.7); }
          70% { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
        }
        .pulse-ring { animation: pulseRing 2s infinite; }
        @keyframes goldPulse {
          0% { box-shadow: 0 0 0 0 rgba(201,168,76,0.5); }
          50% { box-shadow: 0 0 0 12px rgba(201,168,76,0); }
          100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
        }
        .gold-pulse { animation: goldPulse 1s infinite; }
        @keyframes rowDrop {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .row-drop { animation: rowDrop 300ms ease-out; }
      `}</style>
    </DashboardShell>
  );
}

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

function Kpi({ icon: Icon, color, value, valueColor = "text-[#1a1a1a]", label, sub, tooltip, progress, progressColor = "bg-green-500", extra, dataTestid, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      data-testid={dataTestid}
      onClick={onClick}
      className={`relative bg-white rounded-2xl shadow-sm border border-[#E8E2D9] p-5 overflow-hidden transition-all ${
        onClick ? "cursor-pointer hover:border-[#C9A84C] hover:shadow-md" : ""
      }`}
    >
      {extra}
      <div className="flex items-start justify-between">
        <Icon size={16} strokeWidth={1.8} className={color} />
        <button
          type="button"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="w-5 h-5 rounded-full bg-[#F5F0E8] text-[#6B7280] flex items-center justify-center hover:bg-[#E8E2D9] transition-colors"
        >
          <Info size={11} />
        </button>
      </div>
      <p className={`font-display italic leading-none mt-3 ${valueColor}`} style={{ fontSize: typeof value === "string" && value.length > 8 ? 26 : 40 }}>
        {value}
      </p>
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280] mt-2">
        {label}
      </p>
      {progress !== undefined && (
        <div className="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-500`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}
      {sub && <p className="font-body text-[11px] text-[#9CA3AF] mt-3">{sub}</p>}
      {hover && tooltip && (
        <div className="absolute right-3 top-12 z-20 w-64 bg-[#1a1a1a] text-[#F5F0E8]/90 border border-white/10 rounded-xl p-3 shadow-xl text-[11px] font-body leading-relaxed">
          {tooltip}
        </div>
      )}
    </div>
  );
}

function WeekTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8E2D9] rounded-xl px-3 py-2 shadow-lg">
      <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-[#C9A84C] font-semibold">{label}</p>
      <p className="font-display italic text-[20px] text-[#1a1a1a]">{payload[0].value}</p>
      <p className="font-body text-[10px] text-[#6B7280]">guests expected</p>
    </div>
  );
}
function MixTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="bg-white border border-[#E8E2D9] rounded-xl px-3 py-2 shadow-lg">
      <p className="font-ui text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: p.payload.color }}>
        {p.name}
      </p>
      <p className="font-display italic text-[18px] text-[#1a1a1a]">{p.value}%</p>
    </div>
  );
}

function Funnel({ submittedCount, submittedPct, verifiedCount }) {
  const rows = [
    { label: "Links Sent", count: 42, pct: 100 },
    { label: "Opened", count: 38, pct: 90 },
    { label: "Step 1 Started", count: 31, pct: 74 },
    { label: "Completed", count: submittedCount, pct: submittedPct },
    { label: "ID Verified", count: verifiedCount || 29, pct: 69 },
  ];
  return (
    <section className="mt-6 bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-6">
      <div className="flex items-center gap-2">
        <h3 className="font-display italic text-[22px] text-[#1a1a1a]">Today's Check-in Funnel</h3>
        <FunnelTooltip />
      </div>
      <div className="mt-5 space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-4">
            <span className="font-ui text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.14em] w-36 shrink-0">
              {r.label}
            </span>
            <div className="bg-[#F5F0E8] h-10 rounded-r-full flex-1 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-[#C9A84C] rounded-r-full transition-all duration-700 ease-out"
                style={{ width: `${r.pct}%` }}
              />
            </div>
            <span className="font-display italic text-[18px] text-[#1a1a1a] w-14 text-right tabular-nums">
              {r.count}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FunnelTooltip() {
  const [hover, setHover] = useState(false);
  return (
    <span className="relative">
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="w-5 h-5 rounded-full bg-[#F5F0E8] text-[#6B7280] flex items-center justify-center"
      >
        <Info size={11} />
      </button>
      {hover && (
        <div className="absolute top-7 left-0 z-20 w-64 bg-[#1a1a1a] text-[#F5F0E8]/90 border border-white/10 rounded-xl p-3 shadow-xl text-[11px] font-body leading-relaxed">
          Flow of guests from link-sent to physically checked in.
        </div>
      )}
    </span>
  );
}

function RpaSection({ stepIdx, running, onRun, showNode4Tooltip, rpaLog }) {
  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-display italic text-[24px] text-[#1a1a1a]">
          🤖 RPA Engine — IDS FortuneNext Write-Back
        </h3>
        <RpaTooltip />
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-6">
        {/* Pipeline */}
        <div className="flex items-center justify-between gap-3 px-2 lg:px-6">
          <Node label={["Form", "Submitted"]} emoji="📱" state={nodeState(stepIdx, 0)} />
          <Line state={lineState(stepIdx, 0)} caption="Form data" />
          <Node label={["System", "Receives"]} emoji="⚡" state={nodeState(stepIdx, 1)} />
          <Line state={lineState(stepIdx, 1)} caption="Trigger RPA" />
          <Node label={["RPA", "Agent"]} emoji="🤖" size="lg" state={nodeState(stepIdx, 2)} pulsing={stepIdx === 2} />
          <Line state={lineState(stepIdx, 2)} caption="Write 9 fields" />
          <div className="relative">
            <Node label={["IDS", "FortuneNext"]} emoji="🏨" state={nodeState(stepIdx, 3)} />
            {showNode4Tooltip && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-[#F5F0E8] border border-[#C9A84C]/40 rounded-lg px-3 py-1.5 shadow-xl whitespace-nowrap font-ui text-[10px] uppercase tracking-[0.14em] node4-tip">
                Writing: Name · Mobile · ID Type · Occasion · Co-guests…
              </div>
            )}
          </div>
          <Line state={lineState(stepIdx, 3)} caption="Confirmation" />
          <Node label={["Sync", "Complete"]} emoji="✅" state={nodeState(stepIdx, 4)} />
        </div>

        {/* Run button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onRun}
            disabled={running}
            data-testid="run-rpa-demo"
            className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-[#C9A84C] hover:bg-[#E8C97A] active:scale-[0.99] disabled:opacity-60 text-[#0D0D0D] font-ui text-[12px] font-bold uppercase tracking-[0.16em] transition-all"
          >
            {running ? (
              <>
                <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-[#0D0D0D]/30 border-t-[#0D0D0D] animate-spin" />
                Running…
              </>
            ) : (
              <>
                <Play size={13} fill="#0D0D0D" /> Run Demo Sync
              </>
            )}
          </button>
        </div>
      </div>

      {/* Activity log */}
      <div className="mt-4 bg-white rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F9F5F0]">
          <p className="font-ui text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9CA3AF]">
            Recent Write-Backs
          </p>
        </div>
        <table className="w-full text-sm" data-testid="rpa-log">
          <thead className="bg-[#FAFAF8] border-b border-[#F9F5F0]">
            <tr>
              {["Timestamp", "Guest", "Booking", "Fields Written", "Duration", "Status"].map((h) => (
                <th key={h} className="px-5 py-3 font-ui text-[10px] uppercase tracking-[0.16em] text-[#9CA3AF] text-left whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rpaLog.map((r, i) => (
              <tr key={i} className={`border-b border-[#F9F5F0] ${r.fresh ? "row-drop bg-[#FFF9E6]" : ""}`}>
                <td className="px-5 py-3 font-ui text-[12px] text-[#1a1a1a]">{r.ts}</td>
                <td className="px-5 py-3 font-body text-[13px] text-[#1a1a1a]">{r.guest}</td>
                <td className="px-5 py-3 font-ui text-[12px] text-[#6B7280]">{r.booking}</td>
                <td className="px-5 py-3 font-body text-[13px] text-[#1a1a1a]">{r.fields}</td>
                <td className="px-5 py-3 font-ui text-[12px] text-[#6B7280]">{r.duration}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-[10px] font-ui font-semibold">
                    ✅ Complete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="m-4 rounded-xl bg-amber-50 border border-amber-200 p-4">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800">
            ⏳ 2 pending write-backs
          </p>
          <ul className="mt-2 space-y-1 font-body text-[12px] text-[#1a1a1a]/85">
            <li>Neha Kapoor · MMT-4421 · Awaiting form submission</li>
            <li>James Wilson · BCom-8812 · No contact (OTA)</li>
          </ul>
        </div>
      </div>

      {/* Group callout */}
      <div className="mt-4 bg-[#FFF9E6] border-l-4 border-[#C9A84C] rounded-r-2xl p-5">
        <p className="font-ui text-[13px] font-semibold text-[#1a1a1a]">
          👥 Strongest RPA Use Case: Group Check-ins
        </p>
        <p className="font-body text-[12.5px] text-[#1a1a1a]/85 mt-2 leading-relaxed">
          After all 32 TCS guests submit via QR code, RPA writes 32 individual guest profiles into IDS FortuneNext in a
          single bulk operation — replacing printed Excel rooming lists and manual reception data entry.{" "}
          <strong>Current state:</strong> 18 synced · 14 pending guest submission.
        </p>
        <p className="font-ui italic text-[11px] text-[#6B7280] mt-2">
          ⓘ 45–50% of Della's business is corporate / group
        </p>
      </div>
    </section>
  );
}

function nodeState(stepIdx, n) {
  if (stepIdx === -1) return "idle";
  if (n < stepIdx) return "complete";
  if (n === stepIdx) return "active";
  return "idle";
}
function lineState(stepIdx, n) {
  if (stepIdx === -1) return "idle";
  if (stepIdx > n) return "complete";
  if (stepIdx === n) return "filling";
  return "idle";
}

function Node({ label, emoji, state = "idle", pulsing = false, size = "md" }) {
  const dim = size === "lg" ? "w-20 h-20 text-[26px]" : "w-14 h-14 text-[20px]";
  const ring =
    state === "active"
      ? "border-[#C9A84C] bg-[#FFF9E6]"
      : state === "complete"
      ? "border-green-400 bg-green-50"
      : "border-[#E8E2D9] bg-white";
  return (
    <div className="flex flex-col items-center min-w-[58px]">
      <span
        className={`flex items-center justify-center rounded-full border-2 shadow-sm ${dim} ${ring} ${
          pulsing ? "gold-pulse" : ""
        } transition-colors duration-200`}
      >
        {emoji}
      </span>
      <p className="mt-2 font-ui text-[10px] uppercase tracking-[0.14em] text-[#6B7280] text-center leading-tight">
        {label.map((l, i) => (
          <span key={i} className="block">
            {l}
          </span>
        ))}
      </p>
    </div>
  );
}

function Line({ state, caption }) {
  return (
    <div className="flex-1 flex flex-col items-center -mt-6">
      <div className="relative w-full h-0.5 bg-[#E8E2D9] overflow-hidden rounded-full">
        <div
          className="absolute left-0 top-0 h-full bg-[#C9A84C]"
          style={{
            width: state === "idle" ? "0%" : state === "complete" ? "100%" : "100%",
            transition: state === "filling" ? "width 500ms ease-in-out" : "none",
            opacity: state === "idle" ? 0 : 1,
          }}
        />
      </div>
      <p className="mt-1 font-ui text-[9px] uppercase tracking-[0.18em] text-[#9CA3AF] whitespace-nowrap">
        {caption}
      </p>
    </div>
  );
}

function RpaTooltip() {
  const [hover, setHover] = useState(false);
  return (
    <span className="relative">
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="w-5 h-5 rounded-full bg-[#F5F0E8] text-[#6B7280] flex items-center justify-center"
      >
        <Info size={11} />
      </button>
      {hover && (
        <div className="absolute top-7 left-0 z-20 w-80 bg-[#1a1a1a] text-[#F5F0E8]/90 border border-white/10 rounded-xl p-3 shadow-xl text-[11px] font-body leading-relaxed">
          Robotic Process Automation: automatically writes enriched guest data from submitted check-in forms into IDS FortuneNext PMS, replacing manual data entry by reception staff.
        </div>
      )}
    </span>
  );
}

function SystemHealth({ health, pingTick, lastCheckAgo }) {
  return (
    <section className="mt-6 bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display italic text-[22px] text-[#1a1a1a]">System Health</h3>
        <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-[#9CA3AF]" data-testid="last-check">
          Last checked {lastCheckAgo}s ago
        </p>
      </div>
      <ul>
        {health.map((h, i) => {
          const Icon = h.icon;
          const pill =
            h.status === "ok"
              ? "bg-green-50 text-green-700 border-green-200"
              : h.status === "warn"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-red-50 text-red-700 border-red-200";
          return (
            <li
              key={h.name}
              className={`flex items-center justify-between py-3 ${i < health.length - 1 ? "border-b border-[#F9F5F0]" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#FAFAF8] border border-[#E8E2D9] flex items-center justify-center text-[#6B7280]">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="font-ui text-[13px] font-semibold text-[#1a1a1a]">{h.name}</p>
                  <p className="font-body text-[11px] text-[#6B7280]">{h.sub}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-ui font-semibold border ${pill}`}>
                  {h.label}
                </span>
                <span className="font-ui text-[10px] text-[#9CA3AF] w-20 text-right tabular-nums">
                  {h.lastPing === 0 ? "live" : h.lastPing < 60 ? `${h.lastPing}s ago` : `${Math.floor(h.lastPing / 60)}m ago`}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      {/* keep linter quiet */}
      <span className="hidden">{pingTick}</span>
    </section>
  );
}


function FortuneNextMock({ open, fields, onClose }) {
  if (!open) return null;
  const ORDER = [
    "Guest Name",
    "Booking Ref",
    "Mobile",
    "Email",
    "Nationality",
    "ID Type",
    "ID Number",
    "Room",
    "Occasion",
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]" data-testid="fortunenext-mock">
      <div className="bg-[#F0F4F8] rounded-2xl shadow-2xl border border-[#94A3B8]/40 w-[640px] max-w-[95vw] overflow-hidden fortunenext-pop">
        {/* Title bar */}
        <div className="bg-[#1E3A5F] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-3 font-ui text-[11px] uppercase tracking-[0.18em]">
              IDS FortuneNext PMS · Lonavala
            </span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-sm font-ui">
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-[#2D5285] text-white/90 px-4 py-1.5 flex items-center gap-4 font-ui text-[10px] uppercase tracking-[0.14em]">
          <span>File</span><span>Reservation</span><span className="text-yellow-300">Check-in</span><span>Reports</span><span>Tools</span>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-ui text-[11px] font-bold text-[#1E3A5F] tracking-wider">
              GUEST REGISTRATION · NEW ARRIVAL
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              RPA AGENT WRITING…
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white rounded-md border border-[#CBD5E1] p-4">
            {ORDER.map((k) => {
              const v = fields[k];
              return (
                <div key={k} className="border-b border-[#E2E8F0] pb-1.5">
                  <p className="text-[9px] font-ui uppercase tracking-[0.16em] text-[#64748B]">{k}</p>
                  <div className="min-h-[20px] flex items-center">
                    {v ? (
                      <span className="font-body text-[13px] text-[#0F172A] font-medium typewriter-in">
                        {v}
                      </span>
                    ) : (
                      <span className="inline-block w-2 h-3.5 bg-[#94A3B8] animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="font-ui text-[9px] text-[#64748B] uppercase tracking-[0.14em]">
              Form NCRB-C · FRRO compliance ready
            </p>
            <span className="inline-flex items-center px-3 py-1 rounded bg-green-100 text-green-700 text-[10px] font-ui font-bold uppercase tracking-wider">
              Auto-saved · {Object.keys(fields).length}/9 fields
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fnPop {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .fortunenext-pop { animation: fnPop 280ms ease-out; }
        @keyframes typeIn {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        .typewriter-in { animation: typeIn 280ms ease-out; }
      `}</style>
    </div>
  );
}
