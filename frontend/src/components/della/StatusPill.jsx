import React from "react";

const PALETTE = {
  pending: { bg: "#E8E2D9", fg: "#5A4A2A", dot: "#A38B4A" },
  submitted: { bg: "#DFF4E1", fg: "#1F5A2A", dot: "#3A7D44" },
  verified: { bg: "#D9F1F8", fg: "#0E4A5E", dot: "#0891B2" },
  checkedin: { bg: "#0D1F0F", fg: "#E8C97A", dot: "#C9A84C" },
  hold: { bg: "#FFF4D9", fg: "#7A5A0E", dot: "#E8A020" },
  cancelled: { bg: "#FBE3E3", fg: "#7A1F1F", dot: "#B83232" },
};

const MAP = {
  Pending: "pending",
  "Form Submitted": "submitted",
  "ID Verified": "verified",
  "Checked-In": "checkedin",
  Hold: "hold",
  Cancelled: "cancelled",
  Confirmed: "submitted",
};

export default function StatusPill({ status, dataTestid }) {
  const key = MAP[status] || "pending";
  const p = PALETTE[key];
  return (
    <span
      data-testid={dataTestid || `status-pill-${key}`}
      className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11px] font-ui font-semibold whitespace-nowrap"
      style={{ backgroundColor: p.bg, color: p.fg, letterSpacing: "0.02em" }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: p.dot }}
      />
      {status}
    </span>
  );
}
