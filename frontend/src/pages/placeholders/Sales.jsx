import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";
import DashboardShell from "../../components/della/DashboardShell";
import { useApp } from "../../context/AppContext";
import { toast } from "../../components/receptionist/ToastHost";
import ToastHost from "../../components/receptionist/ToastHost";

const STAGES = ["New Lead", "Qualified", "Proposal Sent", "Negotiation", "Closed Won"];

const SEED_LEADS = [
  { name: "Infosys · QBR", company: "Infosys", rooms: 18, stage: 1 },
  { name: "Adani Family", company: "Adani Group", rooms: 8, stage: 2 },
  { name: "Tata Steel Offsite", company: "Tata Steel", rooms: 24, stage: 3 },
];

export default function Sales() {
  const navigate = useNavigate();
  const { addReservation } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    mobile: "",
    email: "",
    roomType: "Conference Suite",
    nights: 2,
    adults: 2,
    arrival: new Date().toISOString().slice(0, 10),
    expectedTime: "3:00 PM",
    occasion: "",
    specialRequest: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.mobile || !form.company) {
      toast("⚠ Name, company and mobile are required");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const id = addReservation({
        ...form,
        source: "sales",
        sourcePrefix: "SLS",
        actor: "sales",
        guestName: form.fullName,
        nationality: "Indian",
      });
      toast(`✅ Sales lead submitted to reservations · ${id}`);
      setSubmitting(false);
      setShowForm(false);
      setForm({
        fullName: "", company: "", mobile: "", email: "",
        roomType: "Conference Suite", nights: 2, adults: 2,
        arrival: new Date().toISOString().slice(0, 10),
        expectedTime: "3:00 PM", occasion: "", specialRequest: "",
      });
      // Bounce reception so they see the new row
      setTimeout(() => navigate("/receptionist"), 900);
    }, 700);
  };

  return (
    <DashboardShell
      title="Sales Pipeline"
      subtitle="Track corporate leads and push confirmed bookings into reservations."
      accent="Sales"
      rightSlot={
        <button
          onClick={() => setShowForm((v) => !v)}
          data-testid="toggle-sales-form"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0D0D0D] font-ui text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors"
        >
          <Plus size={13} /> {showForm ? "Hide Form" : "Submit New Guest"}
        </button>
      }
    >
      {showForm && (
        <form
          onSubmit={submit}
          data-testid="sales-form"
          className="mb-8 rounded-2xl bg-white border border-[#E8E2D9] shadow-sm p-7 grid grid-cols-1 md:grid-cols-2 gap-x-6"
        >
          <div className="md:col-span-2 flex items-baseline justify-between mb-2">
            <h3 className="font-display italic text-[24px] text-[#0D0D0D]">Submit Corporate Guest</h3>
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#C9A84C]">
              Booking moves directly into Today's Arrivals
            </p>
          </div>
          <SalesField label="Guest Full Name" value={form.fullName} onChange={(v) => update("fullName", v)} required dataTestid="sales-name" />
          <SalesField label="Company" value={form.company} onChange={(v) => update("company", v)} required dataTestid="sales-company" />
          <SalesField label="Mobile" value={form.mobile} onChange={(v) => update("mobile", v)} placeholder="+91 …" required dataTestid="sales-mobile" />
          <SalesField label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="guest@company.com" />
          <SalesSelect
            label="Room Type"
            value={form.roomType}
            onChange={(v) => update("roomType", v)}
            options={["Conference Suite", "Lake Suite", "Cliff Villa", "Royal Penthouse", "Designer Suite"]}
          />
          <SalesField label="Arrival Date" type="date" value={form.arrival} onChange={(v) => update("arrival", v)} />
          <SalesSelect
            label="Expected Time"
            value={form.expectedTime}
            onChange={(v) => update("expectedTime", v)}
            options={["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]}
          />
          <SalesField label="Nights" type="number" value={form.nights} onChange={(v) => update("nights", Number(v))} />
          <SalesField label="Adults" type="number" value={form.adults} onChange={(v) => update("adults", Number(v))} />
          <SalesSelect
            label="Occasion"
            value={form.occasion}
            onChange={(v) => update("occasion", v)}
            options={["", "Corporate", "Anniversary", "Birthday", "Wedding Guest"]}
            placeholder="— none —"
          />
          <div className="md:col-span-2">
            <label className="block mt-3">
              <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
                Special Request / Notes for Reception
              </span>
              <textarea
                rows={3}
                value={form.specialRequest}
                onChange={(e) => update("specialRequest", e.target.value)}
                placeholder="VIP arrival, airport pickup, dietary preferences…"
                className="w-full bg-transparent border-b border-[#E8E2D9] focus:border-[#C9A84C] outline-none py-2 font-body text-[14px] text-[#1a1a1a] resize-none placeholder:italic placeholder:text-[#9CA3AF]"
              />
            </label>
          </div>

          <div className="md:col-span-2 mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-body text-[11px] text-[#6B7280] max-w-md">
              Co-guest and child details are <strong>not collected here</strong> — they're filled by
              the guest via the WhatsApp form or by reception at the front desk.
            </p>
            <button
              type="submit"
              disabled={submitting}
              data-testid="sales-submit"
              className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-[#0D1F0F] hover:bg-[#0a1a0d] disabled:opacity-60 text-[#E8C97A] font-ui text-[12px] font-bold uppercase tracking-[0.16em] transition-colors"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-[#E8C97A]/40 border-t-[#E8C97A] animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit to Reservations <ArrowRight size={13} />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {STAGES.map((s, i) => {
          const cards = SEED_LEADS.filter((l) => l.stage === i);
          return (
            <div
              key={s}
              className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-sm min-h-[260px]"
              data-testid={`pipeline-stage-${i}`}
            >
              <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#C9A84C]">
                Stage {i + 1}
              </p>
              <h3 className="font-display italic text-xl mt-2 text-[#0D0D0D]">{s}</h3>
              <div className="mt-4 space-y-2">
                {cards.length === 0 ? (
                  <p className="text-[11px] font-ui uppercase tracking-[0.16em] text-[#0D0D0D]/30">
                    0 deals
                  </p>
                ) : (
                  cards.map((c) => (
                    <div
                      key={c.name}
                      className="rounded-xl border border-[#E8E2D9] p-3 bg-[#FBF8F2] hover:border-[#C9A84C] cursor-pointer transition-colors"
                    >
                      <p className="font-body text-[13px] text-[#0D0D0D]">{c.name}</p>
                      <p className="font-ui text-[10px] uppercase tracking-[0.16em] text-[#6B7280] mt-1">
                        {c.rooms} rooms · {c.company}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      <ToastHost />
    </DashboardShell>
  );
}

function SalesField({ label, value, onChange, type = "text", placeholder, required, dataTestid }) {
  return (
    <label className="block mt-3">
      <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
        {label} {required && <span className="text-[#C9A84C]">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={dataTestid}
        className="w-full bg-transparent border-0 border-b border-[#E8E2D9] focus:border-[#C9A84C] outline-none py-2 font-body text-[14px] text-[#1a1a1a]"
      />
    </label>
  );
}

function SalesSelect({ label, value, onChange, options, placeholder }) {
  return (
    <label className="block mt-3">
      <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-0 border-b border-[#E8E2D9] focus:border-[#C9A84C] outline-none py-2 font-body text-[14px] text-[#1a1a1a]"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "— none —"}
          </option>
        ))}
      </select>
    </label>
  );
}
