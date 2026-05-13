import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Mail, Briefcase, Users, ChartBar as BarChart3, Smartphone, ArrowUpRight } from "lucide-react";
import GoldParticles from "../components/della/GoldParticles";

const ROLES = [
  {
    key: "receptionist",
    icon: Bell,
    title: "Front Desk · Receptionist",
    desc: "Today's arrivals, check-in management",
    micro: "Live arrivals · ID verification · Check-in completion",
    path: "/receptionist",
  },
  {
    key: "reservation",
    icon: Mail,
    title: "Reservation Team",
    desc: "Email parser, booking console",
    micro: "Email parser · OTA vouchers · IDS sync",
    path: "/reservation",
  },
  {
    key: "sales",
    icon: Briefcase,
    title: "Sales Team",
    desc: "Lead pipeline, CRM",
    micro: "Lead pipeline · Corporate CRM · Handoff to reservation",
    path: "/sales",
  },
  {
    key: "coordinator",
    icon: Users,
    title: "Group Coordinator",
    desc: "Event check-in tracker (external)",
    micro: "External portal · QR tracker · Bulk reminders",
    path: "/coordinator",
  },
  {
    key: "management",
    icon: BarChart3,
    title: "Operations Manager",
    desc: "Mr. Rahil Bakali · Executive overview",
    micro: "All dashboards · RPA engine · System health",
    path: "/management",
  },
  {
    key: "guest",
    icon: Smartphone,
    title: "Guest View",
    desc: "WhatsApp → check-in form experience",
    micro: "WhatsApp preview · Pre-filled form · 4-step check-in",
    path: "/guest",
  },
];

const cardEnter = (i) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
});

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen overflow-hidden grain"
      style={{ backgroundColor: "#0D1F0F" }}
      data-testid="landing-screen"
    >
      {/* Ambient gradient haze */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 700px at 50% 0%, rgba(201,168,76,0.10), transparent 60%), radial-gradient(700px 500px at 80% 90%, rgba(201,168,76,0.05), transparent 60%)",
        }}
      />

      {/* Top brand bar */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#C9A84C]" />
          <span className="font-ui text-[10px] uppercase tracking-[0.4em] text-[#F5F0E8]/60">
            Lonavala · India
          </span>
        </div>
        <span className="font-ui text-[10px] uppercase tracking-[0.32em] text-[#F5F0E8]/40 hidden sm:block">
          Internal Operations Suite · v1.0
        </span>
      </div>

      {/* Particle field */}
      <GoldParticles count={20} />

      {/* Centerpiece */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 lg:pt-28 pb-16 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-ui text-[10px] uppercase tracking-[0.5em] text-[#C9A84C]/80"
        >
          ◆ Estd. 2007 · Lonavala
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5"
        >
          <img
            src="/della-logo.png"
            alt="Della Resorts"
            draggable={false}
            className="mx-auto block w-auto h-[110px] sm:h-[140px] lg:h-[160px] drop-shadow-[0_10px_40px_rgba(201,168,76,0.25)]"
          />
        </motion.div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="origin-center mt-6 w-40 gold-rule"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="font-ui text-[11px] uppercase tracking-[0.4em] text-[#F5F0E8] mt-5"
        >
          Experience Management System
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="font-body text-[13px] text-[#F5F0E8]/50 mt-3"
        >
          Select your role to continue
        </motion.p>

        {/* Role grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-[760px]">
          {ROLES.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.button
                key={r.key}
                {...cardEnter(i)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                onClick={() => navigate(r.path)}
                data-testid={`role-card-${r.key}`}
                className="group relative text-left p-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md hover:border-[#C9A84C]/60 hover:bg-white/[0.06] transition-colors duration-300 overflow-hidden"
              >
                {/* hover halo */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(400px 200px at 100% 0%, rgba(201,168,76,0.14), transparent 60%)",
                  }}
                />
                <div className="relative flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl border border-[#C9A84C]/30 bg-[#C9A84C]/5 flex items-center justify-center text-[#C9A84C] group-hover:bg-[#C9A84C]/15 transition-colors">
                    <Icon size={18} strokeWidth={1.6} />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-[#F5F0E8]/30 group-hover:text-[#C9A84C] transition-colors"
                  />
                </div>
                <h3 className="relative font-ui text-[13px] font-semibold text-[#F5F0E8] mt-6 tracking-wide">
                  {r.title}
                </h3>
                <p className="relative font-body text-[12px] text-[#F5F0E8]/55 mt-1.5 leading-relaxed">
                  {r.desc}
                </p>
                <p className="relative font-display italic text-[10px] text-[#C9A84C]/55 mt-4 leading-snug">
                  {r.micro}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pb-10 mt-4">
        <div className="h-px bg-[#C9A84C]/20 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/della-logo.png" alt="Della Resorts" className="h-8 w-auto opacity-90" />
            <span className="font-ui text-[10px] uppercase tracking-[0.32em] text-[#F5F0E8]/40">
              Della Resorts · Lonavala, Maharashtra · © 2026 · Built for hospitality teams
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
