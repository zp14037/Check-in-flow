import React from "react";
import { motion } from "framer-motion";
import PhoneFrame from "../../components/della/PhoneFrame";
import StatusBar from "../../components/della/StatusBar";
import DetailChip from "../../components/della/DetailChip";
import GoldButton from "../../components/della/GoldButton";
import ProgressDots from "../../components/della/ProgressDots";

export default function WelcomeHero({ booking, onBegin, onExit }) {
  const chips = ["Cliff Villa", "2 Adults", "Breakfast Plan", "2 Nights", `#${booking.id}`];

  return (
    <PhoneFrame>
      <div
        className="flex-1 flex flex-col text-center px-6 pb-8"
        style={{
          background: "linear-gradient(180deg, #0D1F0F 0%, #0a2010 100%)",
        }}
        data-testid="welcome-hero"
      >
        <StatusBar tone="ivory" />

        <div className="flex justify-end pt-2 pr-1">
          <button
            onClick={onExit}
            className="text-[10px] font-ui uppercase tracking-[0.22em] text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors"
          >
            Exit
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <p className="font-ui text-[10px] uppercase tracking-[0.5em] text-[#C9A84C]">
            Della Resorts
          </p>
          <div className="mx-auto mt-3 h-px w-12 bg-[#C9A84C]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display italic text-[#F5F0E8] mt-6 leading-tight"
          style={{ fontSize: 52, lineHeight: 1.05 }}
        >
          Welcome,
          <br /> Aarav
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="font-ui text-[11px] uppercase text-[#C9A84C] mt-3"
          style={{ letterSpacing: "0.2em" }}
        >
          Lonavala · 18–20 Feb 2026
        </motion.p>

        <div className="flex flex-wrap justify-center gap-2 mt-5 px-2">
          {chips.map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <DetailChip>{c}</DetailChip>
            </motion.div>
          ))}
        </div>

        <div className="mt-7">
          <ProgressDots total={4} active={0} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-8"
        >
          <GoldButton
            size="lg"
            className="w-full max-w-[320px] mx-auto"
            onClick={onBegin}
            dataTestid="begin-checkin"
          >
            Begin Your Check-in →
          </GoldButton>
          <p className="mt-3 font-body text-[10px] text-[#F5F0E8]/40">
            2 minutes · Encrypted · PDPA Compliant 🔒
          </p>
        </motion.div>

        {/* Soft brand mark bottom */}
        <div className="mt-auto pt-10 pb-2 opacity-60">
          <img src="/della-logo.png" alt="Della" className="h-10 w-auto mx-auto" />
        </div>
      </div>
    </PhoneFrame>
  );
}
