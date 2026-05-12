import React from "react";

/**
 * Detail chip — gold-bordered pill used in the WhatsApp message + welcome hero.
 */
export default function DetailChip({ children, dataTestid }) {
  return (
    <span
      data-testid={dataTestid}
      className="inline-flex items-center px-2.5 py-1 rounded-full border border-[#C9A84C]/40 bg-[#0D2137] text-[#E8C97A] font-ui text-[10px] tracking-wide whitespace-nowrap"
    >
      {children}
    </span>
  );
}
