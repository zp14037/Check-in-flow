import React from "react";

const STYLES = {
  direct: { cls: "bg-blue-50 text-blue-700 border-blue-200", label: "Direct" },
  booking: { cls: "bg-orange-50 text-orange-600 border-orange-200", label: "🔶 BCom" },
  mmt: { cls: "bg-red-50 text-red-600 border-red-200", label: "✈ MMT" },
  sales: { cls: "bg-purple-50 text-purple-700 border-purple-200", label: "💼 Sales" },
  whatsapp: { cls: "bg-green-50 text-green-700 border-green-200", label: "💬 WA" },
  walkin: { cls: "bg-gray-100 text-gray-600 border-gray-200", label: "Walk-in" },
  group: { cls: "bg-teal-50 text-teal-700 border-teal-200", label: "👥 Group" },
};

export default function SourcePill({ source }) {
  const s = STYLES[source] || STYLES.walkin;
  return (
    <span
      data-testid={`source-pill-${source}`}
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-ui font-medium border whitespace-nowrap ${s.cls}`}
    >
      {s.label}
    </span>
  );
}
