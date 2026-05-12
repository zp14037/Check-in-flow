import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Home,
  UserPlus,
  QrCode,
  CheckCircle2,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";

const NAV = [
  { to: "/receptionist", icon: Home, label: "Today's Arrivals", end: true },
  { to: "/receptionist/walkin", icon: UserPlus, label: "New Walk-in" },
  { to: "/receptionist/qr", icon: QrCode, label: "QR Display Board" },
  { to: "/receptionist/checkedout", icon: CheckCircle2, label: "Checked Out" },
  { to: "/receptionist/all", icon: ClipboardList, label: "All Reservations" },
];

export default function Sidebar() {
  return (
    <aside
      data-testid="receptionist-sidebar"
      className="hidden lg:flex flex-col w-[240px] shrink-0 bg-[#1C1C1E] text-[#F5F0E8] fixed top-0 left-0 h-screen z-20"
    >
      {/* Logo block */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-baseline gap-2">
          <span className="font-display italic font-light text-[28px] text-[#C9A84C] leading-none">
            D
          </span>
          <div>
            <p className="font-ui font-semibold text-[11px] text-[#C9A84C]/85 tracking-[0.22em] leading-tight">
              DELLA RESORTS
            </p>
            <p className="font-ui text-[9px] text-[#C9A84C]/55 tracking-[0.28em] uppercase mt-0.5">
              Front Desk
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-4 space-y-1 px-3 flex-1">
        {NAV.map((n) => {
          const Icon = n.icon;
          return (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              data-testid={`nav-${n.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-ui text-[13px] font-medium transition-colors cursor-pointer border-l-2 ${
                  isActive
                    ? "bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]"
                    : "text-[#F5F0E8]/85 hover:bg-white/5 border-transparent"
                }`
              }
            >
              <Icon size={16} strokeWidth={1.7} />
              <span>{n.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-3 flex gap-3 items-center">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#0D0D0D] text-xs font-bold">
            PR
          </div>
          <div>
            <p className="text-[#F5F0E8] text-sm font-ui font-medium leading-tight">
              Priya Rodrigues
            </p>
            <p className="text-[#C9A84C]/60 text-[11px] font-body">Front Desk · 7AM–3PM</p>
          </div>
        </div>
        <Link
          to="/"
          data-testid="back-to-roles"
          className="mt-3 flex items-center gap-1.5 text-[11px] font-ui text-[#F5F0E8]/40 hover:text-[#F5F0E8]/70 transition-colors"
        >
          <ArrowLeft size={11} /> All Roles
        </Link>
      </div>
    </aside>
  );
}
