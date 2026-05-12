import React from "react";
import { Camera } from "lucide-react";

/**
 * Mock ID-upload card. On click it pretends to capture an ID
 * (sets a fake filename) — keeps the demo offline.
 */
export default function IDUploadCard({ value, onChange, dataTestid }) {
  const fileName = typeof value === "string" ? value : value?.name;

  return (
    <button
      type="button"
      data-testid={dataTestid}
      onClick={() => onChange(`aadhaar_${Date.now()}.jpg`)}
      className="w-full mt-2 py-6 px-4 rounded-xl border-2 border-dashed border-[#C9A84C]/40 hover:border-[#C9A84C] bg-[#C9A84C]/[0.04] hover:bg-[#C9A84C]/[0.08] transition flex flex-col items-center text-center"
    >
      <Camera size={22} strokeWidth={1.5} className="text-[#C9A84C]" />
      <p className="mt-2 font-ui text-[12px] text-[#F5F0E8]/85">
        {fileName ? "Captured ✓" : "Tap to capture your Government ID"}
      </p>
      <p className="mt-1 font-body text-[10px] text-[#F5F0E8]/50">
        {fileName ? fileName : "JPG, PNG or PDF · Max 5MB"}
      </p>
    </button>
  );
}
