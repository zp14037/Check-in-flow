import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import StepShell from "./StepShell";
import { Field, SelectField } from "../../components/della/LuxField";
import GoldButton from "../../components/della/GoldButton";

const OCCASIONS = [
  { key: "Birthday", emoji: "🎂" },
  { key: "Anniversary", emoji: "💍" },
  { key: "Honeymoon", emoji: "🥂" },
  { key: "Corporate", emoji: "🏢" },
  { key: "Wedding Guest", emoji: "💒" },
  { key: "Just a Getaway", emoji: "✨" },
];

const DIETARY = [
  { key: "Vegetarian", emoji: "🌿" },
  { key: "Non-Vegetarian", emoji: "🍖" },
  { key: "Vegan", emoji: "🌱" },
  { key: "Jain", emoji: "🙏" },
  { key: "Nut Allergy", emoji: "🥜" },
  { key: "Gluten-Free", emoji: "🌾" },
];

const ARRIVAL_TIMES = [
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "Late Night",
];

export default function Step3Preferences({ payload, update, onNext, onBack }) {
  const occ = payload.occasion;

  const toggleDiet = (k) => {
    const next = payload.dietary.includes(k)
      ? payload.dietary.filter((x) => x !== k)
      : [...payload.dietary, k];
    update({ dietary: next });
  };

  return (
    <StepShell
      step={3}
      title="Make It Unforgettable"
      subtitle="Help us personalise your Della experience."
      onBack={onBack}
      footer={
        <GoldButton
          size="lg"
          className="w-full"
          onClick={onNext}
          dataTestid="step3-continue"
        >
          Continue →
        </GoldButton>
      }
    >
      {/* Occasion grid */}
      <div className="grid grid-cols-3 gap-2.5 mt-1">
        {OCCASIONS.map((o) => {
          const selected = occ === o.key;
          return (
            <button
              key={o.key}
              data-testid={`occasion-${o.key.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => update({ occasion: o.key })}
              className={`relative rounded-xl p-3 text-center border transition-all ${
                selected
                  ? "border-[#C9A84C] bg-[#C9A84C]/10 shadow-[0_0_18px_-4px_rgba(201,168,76,0.5)]"
                  : "border-white/10 bg-white/[0.03] hover:border-[#C9A84C]/40"
              }`}
            >
              {selected && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#C9A84C] text-[#0D0D0D] flex items-center justify-center">
                  <Check size={10} strokeWidth={3} />
                </span>
              )}
              <div className="text-xl">{o.emoji}</div>
              <p className="mt-1 font-ui text-[10px] text-[#F5F0E8]/90 leading-tight">
                {o.key}
              </p>
            </button>
          );
        })}
      </div>

      {/* Occasion-specific reveal */}
      <AnimatePresence mode="wait">
        <motion.div
          key={occ}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-3">
            {occ === "Anniversary" && (
              <Field
                label="Your Anniversary Date"
                type="date"
                value={payload.occasionDetail}
                onChange={(v) => update({ occasionDetail: v })}
              />
            )}
            {occ === "Birthday" && (
              <>
                <Field
                  label="Whose Birthday?"
                  value={payload.occasionDetail}
                  onChange={(v) => update({ occasionDetail: v })}
                  placeholder="Name"
                />
                <Field label="Date" type="date" />
              </>
            )}
            {occ === "Honeymoon" && (
              <p className="font-display italic text-[#C9A84C] text-[16px] py-2">
                We'll make it magical 🌹
              </p>
            )}
            {occ === "Wedding Guest" && (
              <SelectField
                label="Your Role"
                value={payload.occasionDetail}
                onChange={(v) => update({ occasionDetail: v })}
                options={["Bride", "Groom", "Family", "Guest", "Colleague"]}
              />
            )}
            {occ === "Corporate" && (
              <Field
                label="Company Name"
                value={payload.occasionDetail}
                onChange={(v) => update({ occasionDetail: v })}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Incentive banner */}
      <div
        className="mt-4 rounded-2xl p-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.06) 100%)",
          border: "1px solid rgba(201,168,76,0.35)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none della-shimmer"
        />
        <p className="font-ui text-[12px] font-semibold text-[#E8C97A] relative">
          🎁 Share your special occasion and unlock:
        </p>
        <ul className="mt-2 space-y-1.5 relative">
          {[
            "Personalised room setup (florals, candles, cake)",
            "Priority F&B reservation at Sky Garden or Villa Bistro",
            "Complimentary occasion card from our team",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 font-body text-[11px] text-[#F5F0E8]/85 leading-snug"
            >
              <span className="text-[#C9A84C] font-bold">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-ui italic text-[10px] text-[#F5F0E8]/70 relative">
          Tell us your occasion above to activate these perks →
        </p>
      </div>

      {/* Special requests */}
      <div className="mt-5">
        <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#F5F0E8]/55">
          Special Requests
        </span>
        <textarea
          rows={4}
          value={payload.specialRequests}
          onChange={(e) => update({ specialRequests: e.target.value })}
          placeholder="Tell us anything that will make your stay unforgettable — surprise cake, rose petals, early check-in, specific pillow preferences…"
          data-testid="special-requests"
          className="w-full mt-1 bg-transparent border-b border-[#C9A84C]/40 focus:border-[#C9A84C] outline-none py-2 font-body text-[13px] text-[#F5F0E8] placeholder:italic placeholder:text-[#C9A84C]/50 resize-none"
        />
      </div>

      {/* Dietary pills (horizontal scroll) */}
      <div className="mt-5">
        <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#F5F0E8]/55">
          Dietary Preferences
        </span>
        <div className="flex gap-2 overflow-x-auto pb-2 mt-2 -mx-1 px-1 no-scrollbar">
          {DIETARY.map((d) => {
            const on = payload.dietary.includes(d.key);
            return (
              <button
                key={d.key}
                onClick={() => toggleDiet(d.key)}
                data-testid={`dietary-${d.key.toLowerCase().replace(/\s+/g, "-")}`}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-ui font-semibold border transition-all ${
                  on
                    ? "bg-[#C9A84C] text-[#0D0D0D] border-[#C9A84C]"
                    : "border-[#C9A84C]/40 text-[#F5F0E8]/85 hover:border-[#C9A84C]"
                }`}
              >
                {d.emoji} {d.key}
              </button>
            );
          })}
        </div>
      </div>

      <SelectField
        label="Estimated Arrival Time"
        value={payload.arrivalTime}
        onChange={(v) => update({ arrivalTime: v })}
        options={ARRIVAL_TIMES}
        dataTestid="arrival-time"
      />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
        @keyframes dellaShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .della-shimmer {
          background: linear-gradient(110deg, transparent 35%, rgba(232,201,122,0.18) 50%, transparent 65%);
          background-size: 200% 100%;
          animation: dellaShimmer 3.2s linear infinite;
        }
      `}</style>
    </StepShell>
  );
}
