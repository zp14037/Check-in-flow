import React from "react";
import { Phone, Users } from "lucide-react";

/**
 * Source channel pills — colorful, distinct, never truncated.
 * Both OTAs (Booking.com and MakeMyTrip) share the orange-diamond icon.
 */

const CONFIG = {
  direct: { label: "Direct Website", bg: "#3B82F6", fg: "#FFFFFF", icon: null },
  booking: { label: "Booking.com", bg: "#E8A020", fg: "#1A1207", icon: "diamond" },
  mmt: { label: "MakeMyTrip", bg: "#E8A020", fg: "#1A1207", icon: "diamond" },
  sales: { label: "Sales / Corporate", bg: "#7C3AED", fg: "#FFFFFF", icon: null },
  whatsapp: { label: "WhatsApp / Call", bg: "#16A34A", fg: "#FFFFFF", icon: "phone" },
  walkin: { label: "Walk-in", bg: "#6B7280", fg: "#FFFFFF", icon: null },
  group: { label: "Group / Event", bg: "#0891B2", fg: "#FFFFFF", icon: "users" },
};

const Icon = ({ name }) => {
  if (name === "phone") return <Phone size={11} strokeWidth={2.5} />;
  if (name === "users") return <Users size={11} strokeWidth={2.5} />;
  if (name === "diamond")
    return (
      <span aria-hidden="true" style={{ fontSize: 11, lineHeight: 1 }}>
        🔶
      </span>
    );
  return null;
};

export default function SourceChannelPill({ source, size = "sm" }) {
  const cfg = CONFIG[source] || CONFIG.walkin;
  const py = size === "sm" ? "py-[3px]" : "py-1";
  const px = size === "sm" ? "px-2.5" : "px-3";
  const fs = size === "sm" ? "text-[11px]" : "text-xs";
  return (
    <span
      data-testid={`source-pill-${source}`}
      className={`inline-flex items-center gap-1.5 ${px} ${py} rounded-full ${fs} font-ui font-semibold whitespace-nowrap`}
      style={{ backgroundColor: cfg.bg, color: cfg.fg, letterSpacing: "0.02em" }}
    >
      {cfg.icon && <Icon name={cfg.icon} />}
      {cfg.label}
    </span>
  );
}

export const SOURCE_CHANNELS = Object.keys(CONFIG);
