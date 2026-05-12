import React from "react";

const STYLES = {
  submitted: { cls: "bg-green-50 text-green-700 border-green-200", label: "✅ Submitted" },
  pending: { cls: "bg-amber-50 text-amber-600 border-amber-200", label: "⏳ Pending" },
  nocontact: { cls: "bg-red-50 text-red-600 border-red-200", label: "❌ No Contact" },
  verified: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "✅ Verified" },
  checkedin: { cls: "bg-emerald-100 text-emerald-800 border-emerald-300", label: "✓ Checked-In" },
  linksent: { cls: "bg-blue-50 text-blue-700 border-blue-200", label: "📲 Link Sent" },
};

export default function StatusPillLight({ kind, label, dataTestid }) {
  const s = STYLES[kind] || STYLES.pending;
  return (
    <span
      data-testid={dataTestid}
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-ui font-medium border whitespace-nowrap ${s.cls}`}
    >
      {label || s.label}
    </span>
  );
}
