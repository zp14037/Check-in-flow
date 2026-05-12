import React from "react";
import StepShell from "./StepShell";
import { Field, SelectField } from "../../components/della/LuxField";
import IDUploadCard from "../../components/della/IDUploadCard";
import GoldButton from "../../components/della/GoldButton";

const ID_TYPES = ["Aadhaar Card", "Passport", "Driving Licence", "Voter ID"];
const NATIONALITIES = ["🇮🇳 Indian", "🇺🇸 American", "🇬🇧 British", "🇦🇪 Emirati", "🇸🇬 Singaporean"];

export default function Step1Personal({ booking, payload, update, onNext, onBack }) {
  const p = booking.primaryGuest;

  return (
    <StepShell
      step={1}
      title="Your Details"
      subtitle="We have most of your information from your booking — please verify and fill in the rest."
      onBack={onBack}
      footer={
        <GoldButton
          size="lg"
          className="w-full"
          onClick={onNext}
          dataTestid="step1-continue"
        >
          Continue →
        </GoldButton>
      }
    >
      <Field label="Full Name" value={p.fullName} prefilled readOnly />
      <Field label="Mobile" value={p.mobile} prefilled readOnly />
      <Field label="Email" value={p.email} prefilled readOnly />
      <SelectField
        label="Nationality"
        value={`🇮🇳 ${p.nationality}`}
        onChange={() => {}}
        options={NATIONALITIES}
        prefilled
      />
      <Field label="Country of Residence" value={p.country} prefilled readOnly />

      <div className="h-4" />

      <Field
        label="Date of Birth"
        type="date"
        value={payload.primary.dob}
        onChange={(v) => update({ primary: { ...payload.primary, dob: v } })}
        required
        dataTestid="primary-dob"
      />
      <SelectField
        label="ID Type"
        value={payload.primary.idType}
        onChange={(v) => update({ primary: { ...payload.primary, idType: v } })}
        options={ID_TYPES}
        required
        dataTestid="primary-id-type"
      />
      <div className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#F5F0E8]/55 mt-3">
        ID Upload <span className="text-[#C9A84C]">*</span>
      </div>
      <IDUploadCard
        value={payload.primary.idFile}
        onChange={(v) => update({ primary: { ...payload.primary, idFile: v } })}
        dataTestid="primary-id-upload"
      />
    </StepShell>
  );
}
