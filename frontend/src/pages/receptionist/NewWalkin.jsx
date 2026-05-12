import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Info, MessageCircle, QrCode, Plus, Minus, CheckCircle2 } from "lucide-react";
import TopBar from "../../components/receptionist/TopBar";
import { useApp } from "../../context/AppContext";
import { toast } from "../../components/receptionist/ToastHost";

const STEPS = [
  "IDS Created",
  "Mobile Captured",
  "Link / QR Sent",
  "Form Submitted",
  "Checked In",
];

export default function NewWalkin() {
  const navigate = useNavigate();
  const { createWalkin } = useApp();

  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [roomType, setRoomType] = useState("Superior Room · 3 available");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [nights, setNights] = useState(1);
  const [occasion, setOccasion] = useState("");
  const [prefill, setPrefill] = useState(true);
  const [sendMethod, setSendMethod] = useState("whatsapp");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null); // { id, mobile }

  const activeStep = mobile ? 1 : 0;

  const submit = (e) => {
    e.preventDefault();
    if (!mobile || !fullName) {
      toast("⚠ Mobile and Full Name are required");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const id = createWalkin({
        fullName,
        mobile,
        roomType: roomType.split("·")[0].trim(),
        adults,
        children,
        nights,
        occasion,
      });
      setCreated({ id, mobile });
      setSubmitting(false);
      toast(`✅ Walk-in created · ${fullName}`);
    }, 1000);
  };

  return (
    <div data-testid="walkin-page">
      <TopBar title="New Walk-in Guest" subtitle="Create a fresh booking and send the check-in link" />

      <div className="p-6 lg:p-8">
        {/* Stepper */}
        <div className="flex items-center gap-2 flex-wrap">
          {STEPS.map((s, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-ui font-bold ${
                      done
                        ? "bg-[#C9A84C] text-[#0D0D0D]"
                        : active
                        ? "bg-[#C9A84C] text-[#0D0D0D] ring-4 ring-[#C9A84C]/20"
                        : "bg-[#E8E2D9] text-[#9CA3AF]"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span
                    className={`font-ui text-[11px] uppercase tracking-[0.12em] ${
                      done || active ? "text-[#1a1a1a]" : "text-[#9CA3AF]"
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <span
                    className={`h-px flex-1 max-w-[40px] ${
                      i < activeStep ? "bg-[#C9A84C]" : "bg-[#E8E2D9]"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* IDS-First info */}
        <div className="mt-6 rounded-r-xl bg-blue-50 border-l-4 border-blue-400 p-4 max-w-3xl">
          <div className="flex gap-2">
            <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="font-body text-[12.5px] text-[#1a1a1a] leading-relaxed">
              <strong className="font-ui font-semibold">IDS-First Flow:</strong> the walk-in booking is first
              created in IDS FortuneNext. Once mobile is captured here, the guest receives a WhatsApp link
              (or QR) to complete their details.
            </p>
          </div>
        </div>

        {/* Form card or success */}
        {!created ? (
          <form
            onSubmit={submit}
            className="mt-6 bg-white rounded-2xl shadow-sm border border-[#E8E2D9] p-7 lg:p-8 max-w-2xl"
            data-testid="walkin-form"
          >
            {/* Prominent mobile field */}
            <div className="pb-1">
              <label className="block">
                <span className="font-ui text-[12px] font-semibold text-[#1a1a1a]">
                  Guest Mobile Number <span className="text-[#C9A84C]">*</span>
                </span>
                <p className="font-body text-[11px] text-[#6B7280] mb-2 mt-0.5">
                  Primary field — required to send check-in link
                </p>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  data-testid="walkin-mobile"
                  className="w-full bg-transparent border-0 border-b-2 border-[#C9A84C] focus:outline-none font-display italic text-[#1a1a1a] py-3"
                  style={{ fontSize: 22 }}
                />
              </label>
            </div>

            <div className="mt-4">
              <LightField
                label="Full Name"
                value={fullName}
                onChange={setFullName}
                placeholder="Guest's full name"
                dataTestid="walkin-name"
                required
              />
              <LightSelect
                label="Room Type"
                value={roomType}
                onChange={setRoomType}
                options={[
                  "Superior Room · 3 available",
                  "Lake Suite · 2 available",
                  "Cliff Villa · 1 available",
                  "Designer Suite · 1 available",
                ]}
              />

              <div className="grid grid-cols-2 gap-4 mt-2">
                <Stepper label="Adults" value={adults} onChange={setAdults} min={1} max={8} />
                <Stepper label="Children" value={children} onChange={setChildren} min={0} max={6} />
              </div>
              <div className="mt-2">
                <Stepper label="Nights" value={nights} onChange={setNights} min={1} max={14} />
              </div>
            </div>

            {/* Occasion prompt */}
            <div
              className="mt-5 rounded-2xl border border-[#C9A84C]/40 p-4 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(201,168,76,0.10) 0%, rgba(201,168,76,0.03) 100%)",
              }}
            >
              <div className="absolute inset-0 pointer-events-none rec-shimmer" aria-hidden="true" />
              <p className="font-ui text-[13px] font-semibold text-[#1a1a1a]">
                🎁 Is this a special occasion?
              </p>
              <p className="font-body text-[12px] text-[#1a1a1a]/80 mt-1 leading-relaxed">
                Share it with us to pre-arrange a personalised welcome experience. We can arrange florals,
                cake, and room setup at no extra charge.
              </p>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                data-testid="walkin-occasion"
                className="w-full mt-3 bg-white border border-[#C9A84C]/40 focus:border-[#C9A84C] outline-none rounded-lg px-3 py-2 font-body text-[13px]"
              >
                <option value="">— None / regular stay —</option>
                <option>Birthday</option>
                <option>Anniversary</option>
                <option>Honeymoon</option>
                <option>Other</option>
              </select>
            </div>

            {/* Pre-fill toggle */}
            <div className="mt-5 flex items-start gap-3">
              <button
                type="button"
                onClick={() => setPrefill((v) => !v)}
                data-testid="walkin-prefill"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  prefill ? "bg-[#C9A84C]" : "bg-[#E8E2D9]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    prefill ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <div>
                <p className="font-ui text-[12px] font-semibold text-[#1a1a1a]">
                  Pre-fill check-in form with above details
                </p>
                {prefill && (
                  <p className="font-body text-[11px] text-[#6B7280] mt-0.5">
                    Guest will receive a pre-filled link with name, room, dates. Faster completion.
                  </p>
                )}
              </div>
            </div>

            {/* Send method */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <SendCard
                active={sendMethod === "whatsapp"}
                onClick={() => setSendMethod("whatsapp")}
                icon={MessageCircle}
                title="Send WhatsApp Link"
                desc="Instant delivery to guest's phone"
                dataTestid="send-whatsapp"
              />
              <SendCard
                active={sendMethod === "qr"}
                onClick={() => setSendMethod("qr")}
                icon={QrCode}
                title="Show QR at Desk"
                desc="Guest scans to open form"
                dataTestid="send-qr"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              data-testid="walkin-submit"
              className="mt-6 w-full h-13 py-3.5 rounded-full bg-[#C9A84C] hover:bg-[#E8C97A] active:scale-[0.99] disabled:opacity-60 text-[#0D0D0D] font-ui font-bold text-[13px] tracking-[0.12em] uppercase transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-[#0D0D0D]/30 border-t-[#0D0D0D] animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Walk-in & Send →"
              )}
            </button>
          </form>
        ) : (
          <SuccessPanel
            id={created.id}
            mobile={created.mobile}
            sendMethod={sendMethod}
            onReturn={() => navigate("/receptionist")}
          />
        )}
      </div>

      <style>{`
        @keyframes recShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .rec-shimmer {
          background: linear-gradient(110deg, transparent 35%, rgba(232,201,122,0.18) 50%, transparent 65%);
          background-size: 200% 100%;
          animation: recShimmer 4s linear infinite;
        }
      `}</style>
    </div>
  );
}

function LightField({ label, value, onChange, placeholder, dataTestid, required }) {
  return (
    <label className="block mt-3">
      <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
        {label} {required && <span className="text-[#C9A84C]">*</span>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={dataTestid}
        className="w-full bg-transparent border-0 border-b border-[#E8E2D9] focus:border-[#C9A84C] outline-none py-2.5 font-body text-[14px] text-[#1a1a1a] transition-colors"
      />
    </label>
  );
}

function LightSelect({ label, value, onChange, options }) {
  return (
    <label className="block mt-3">
      <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-0 border-b border-[#E8E2D9] focus:border-[#C9A84C] outline-none py-2.5 font-body text-[14px] text-[#1a1a1a] appearance-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Stepper({ label, value, onChange, min = 0, max = 10 }) {
  return (
    <div className="flex items-end justify-between border-b border-[#E8E2D9] py-2">
      <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-7 h-7 rounded-full border border-[#E8E2D9] hover:border-[#C9A84C] hover:text-[#C9A84C] flex items-center justify-center transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="font-display italic text-[20px] text-[#1a1a1a] w-6 text-center tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-7 h-7 rounded-full border border-[#E8E2D9] hover:border-[#C9A84C] hover:text-[#C9A84C] flex items-center justify-center transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}

function SendCard({ active, onClick, icon: Icon, title, desc, dataTestid }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={dataTestid}
      className={`text-left rounded-xl border p-4 transition-all ${
        active
          ? "border-[#C9A84C] bg-[#C9A84C]/5"
          : "border-[#E8E2D9] hover:border-[#C9A84C]/60"
      }`}
    >
      <Icon size={18} className={active ? "text-[#C9A84C]" : "text-[#6B7280]"} />
      <p className="font-ui text-[13px] font-semibold text-[#1a1a1a] mt-2">{title}</p>
      <p className="font-body text-[11px] text-[#6B7280] mt-1">{desc}</p>
    </button>
  );
}

function SuccessPanel({ id, mobile, sendMethod, onReturn }) {
  return (
    <div className="mt-6 max-w-2xl bg-white rounded-2xl shadow-sm border border-green-200 p-8 walkin-success" data-testid="walkin-success">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={20} className="text-green-600" />
        </div>
        <div>
          <p className="font-ui text-[14px] font-semibold text-green-700">
            Walk-in created · Link sent to {mobile}
          </p>
          <p className="font-body text-[12px] text-[#6B7280]">
            Booking #{id} · Added to Today's Arrivals
          </p>
        </div>
      </div>

      {sendMethod === "qr" && (
        <div className="mt-6 flex flex-col items-center">
          <div className="inline-block rounded-xl p-3 bg-[#0D0D0D] qr-rotating">
            <QRCodeSVG value={`DELLA|${id}|WALKIN`} size={150} fgColor="#C9A84C" bgColor="#0D0D0D" />
          </div>
          <p className="mt-3 font-ui text-[10px] text-[#6B7280] uppercase tracking-[0.22em]">
            Ask guest to scan with their phone
          </p>
        </div>
      )}

      <button
        onClick={onReturn}
        className="mt-6 w-full py-3 rounded-full border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-ui text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors"
      >
        ← Return to Today's Arrivals
      </button>

      <style>{`
        @keyframes walkinIn { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform: translateY(0);} }
        .walkin-success { animation: walkinIn 350ms ease-out; }
        @keyframes goldSpin {
          0% { box-shadow: 0 0 0 3px rgba(201,168,76,0.0), 0 0 18px rgba(201,168,76,0.6); }
          50% { box-shadow: 0 0 0 3px rgba(201,168,76,0.6), 0 0 22px rgba(201,168,76,0.4); }
          100% { box-shadow: 0 0 0 3px rgba(201,168,76,0.0), 0 0 18px rgba(201,168,76,0.6); }
        }
        .qr-rotating { animation: goldSpin 2.4s linear infinite; border: 2px solid #C9A84C; }
      `}</style>
    </div>
  );
}
