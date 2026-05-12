import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import StepShell from "./StepShell";
import { Field, SelectField } from "../../components/della/LuxField";
import IDUploadCard from "../../components/della/IDUploadCard";
import GoldButton from "../../components/della/GoldButton";

const RELATIONSHIPS = ["Spouse", "Parent", "Child", "Sibling", "Friend", "Colleague"];
const NATIONALITIES = ["🇮🇳 Indian", "🇺🇸 American", "🇬🇧 British", "🇦🇪 Emirati", "🇸🇬 Singaporean"];
const ID_TYPES = ["Aadhaar Card", "Passport", "Driving Licence", "Voter ID"];

export default function Step2CoGuests({ booking, payload, update, onNext, onBack }) {
  const [childOpen, setChildOpen] = useState(true);
  const co = payload.coGuests[0];

  const setCo = (patch) => {
    update({ coGuests: [{ ...co, ...patch }] });
  };

  return (
    <StepShell
      step={2}
      title="Your Companions"
      subtitle="Please provide details and ID for all guests staying with you (required by Indian government regulation)."
      onBack={onBack}
      footer={
        <GoldButton
          size="lg"
          className="w-full"
          onClick={onNext}
          dataTestid="step2-continue"
        >
          Continue →
        </GoldButton>
      }
    >
      {/* Co-guest card */}
      <div className="rounded-xl border border-[#C9A84C]/30 bg-[#C9A84C]/[0.03] p-4">
        <div className="flex items-center justify-between">
          <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
            Guest 2 of 2
          </span>
          <span className="font-body text-[10px] text-[#F5F0E8]/50">Adult</span>
        </div>
        <div className="mt-2">
          <Field
            label="Full Name"
            value={co.fullName}
            onChange={(v) => setCo({ fullName: v })}
            required
            dataTestid="co-fullname"
          />
          <SelectField
            label="Relationship"
            value={co.relationship}
            onChange={(v) => setCo({ relationship: v })}
            options={RELATIONSHIPS}
            required
            dataTestid="co-relationship"
          />
          <SelectField
            label="Nationality"
            value={co.nationality}
            onChange={(v) => setCo({ nationality: v })}
            options={NATIONALITIES}
            required
          />
          <Field
            label="Date of Birth"
            type="date"
            value={co.dob}
            onChange={(v) => setCo({ dob: v })}
            required
          />
          <SelectField
            label="ID Type"
            value={co.idType}
            onChange={(v) => setCo({ idType: v })}
            options={ID_TYPES}
            required
          />
          <div className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#F5F0E8]/55 mt-3">
            ID Upload <span className="text-[#C9A84C]">*</span>
          </div>
          <IDUploadCard
            value={co.idFile}
            onChange={(v) => setCo({ idFile: v })}
            dataTestid="co-id-upload"
          />
        </div>
      </div>

      {/* Children collapsible (only show if adults brought children — empty placeholder otherwise) */}
      <button
        type="button"
        onClick={() => setChildOpen((o) => !o)}
        className="mt-5 w-full flex items-center justify-between py-2"
        data-testid="children-toggle"
      >
        <span className="font-display italic text-[20px] text-[#F5F0E8]">
          Children
        </span>
        {childOpen ? (
          <ChevronUp size={18} className="text-[#C9A84C]" />
        ) : (
          <ChevronDown size={18} className="text-[#C9A84C]" />
        )}
      </button>

      <div
        className={`grid transition-all duration-300 ${
          childOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="rounded-xl border border-[#C9A84C]/30 bg-[#C9A84C]/[0.03] p-4 mt-1">
            <p className="font-body text-[12px] text-[#F5F0E8]/60 italic">
              If you are travelling with children, please add their details below.
            </p>
            <Field
              label="Child Name"
              value={payload.child.name}
              onChange={(v) => update({ child: { ...payload.child, name: v } })}
              placeholder="Full name"
            />
            <Field
              label="Date of Birth"
              type="date"
              value={payload.child.dob}
              onChange={(v) => update({ child: { ...payload.child, dob: v } })}
            />
            <Field
              label="Guardian Name"
              value={payload.child.guardian}
              onChange={(v) => update({ child: { ...payload.child, guardian: v } })}
              placeholder="Accompanying adult"
            />
          </div>
        </div>
      </div>

      {/* Legal notice */}
      <div className="mt-5 flex gap-2 border-l-2 border-[#C9A84C] bg-[#C9A84C]/[0.06] rounded-r-xl p-3">
        <Info size={14} className="text-[#C9A84C] mt-0.5 shrink-0" />
        <p className="font-body text-[11px] text-[#F5F0E8]/80 leading-relaxed">
          ID documents for all adult guests are required by law for hotel
          registration in India (Bombay Police Act). Your data is encrypted and
          deleted after checkout.
        </p>
      </div>
    </StepShell>
  );
}
