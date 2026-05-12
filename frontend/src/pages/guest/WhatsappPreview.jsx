import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Video, Phone, BadgeCheck } from "lucide-react";
import PhoneFrame from "../../components/della/PhoneFrame";
import StatusBar from "../../components/della/StatusBar";
import DetailChip from "../../components/della/DetailChip";
import GoldButton from "../../components/della/GoldButton";

/**
 * G1 — WhatsApp dark-mode chat preview with sequential delivery animation.
 */
export default function WhatsappPreview({ booking, onOpen, onExit }) {
  return (
    <div data-testid="whatsapp-preview">
      <PhoneFrame>
        {/* iOS status bar */}
        <StatusBar tone="ivory" />

        {/* WhatsApp header */}
        <div className="flex items-center gap-3 px-3 pt-1 pb-2 bg-[#1F2937] border-b border-white/5">
          <button
            data-testid="wa-back"
            onClick={onExit}
            className="text-[#F5F0E8]/80 hover:text-[#F5F0E8] -ml-1 p-1"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-9 h-9 rounded-full bg-[#0D0D0D] border border-[#C9A84C]/40 overflow-hidden flex items-center justify-center">
            <img src="/della-logo.png" alt="Della" className="w-7 h-7 object-contain" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-ui font-semibold text-[#F5F0E8] leading-tight">
                Della Resorts
              </span>
              <BadgeCheck size={14} className="text-[#25D366]" fill="#25D366" stroke="#0D1F0F" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] text-[#8696A0] font-body">online</span>
          </div>
          <Video size={18} className="text-[#F5F0E8]/70" />
          <Phone size={16} className="text-[#F5F0E8]/70" />
        </div>

        {/* Chat area */}
        <div
          className="flex-1 px-3 pt-5 pb-6 relative overflow-hidden"
          style={{
            backgroundColor: "#0B141A",
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        >
          {/* Day divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center mb-5"
          >
            <span className="px-3 py-1 rounded-md bg-[#1F2C34] text-[#8696A0] text-[10px] font-ui uppercase tracking-[0.18em]">
              Yesterday
            </span>
          </motion.div>

          {/* Bubble */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[300px] ml-0 mr-auto"
            data-testid="wa-bubble"
          >
            <div className="rounded-[14px] rounded-bl-[3px] bg-[#1F2C34] overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.4)]">
              {/* Rich header card */}
              <div
                className="relative px-4 pt-3 pb-5"
                style={{
                  background: "linear-gradient(135deg, #1a1200 0%, #2d1e00 100%)",
                  minHeight: 80,
                }}
              >
                <p className="font-ui uppercase text-[#C9A84C]" style={{ fontSize: 8, letterSpacing: "0.4em" }}>
                  Della Resorts · Lonavala
                </p>
                <span
                  aria-hidden="true"
                  className="absolute top-2.5 right-3 text-[#C9A84C]"
                  style={{ fontSize: 11 }}
                >
                  ◆
                </span>
                {/* Mountain silhouette */}
                <svg
                  viewBox="0 0 280 60"
                  className="absolute left-0 right-0 bottom-0 w-full"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 60 L30 32 L55 44 L85 18 L120 36 L150 22 L185 40 L220 14 L255 30 L280 22 L280 60 Z"
                    fill="#C9A84C"
                    opacity="0.3"
                  />
                  <path
                    d="M0 60 L25 46 L60 52 L95 38 L130 50 L165 40 L200 52 L235 38 L280 48 L280 60 Z"
                    fill="#C9A84C"
                    opacity="0.18"
                  />
                </svg>
              </div>

              {/* Body */}
              <div className="px-3 pt-3 pb-2">
                <p className="font-body text-[15px] text-white font-bold leading-tight">
                  Welcome, Aarav 🙏
                </p>
                <p className="font-body text-[13px] text-[#E2E8F0] mt-1.5 leading-snug">
                  Your stay begins tomorrow, 18 Feb 2026.
                </p>
                <p className="font-body italic text-[12px] text-[#94A3B8] mt-1.5 leading-snug">
                  Skip the queue — complete your express check-in in 2 minutes
                  and your room will be ready on arrival.
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <DetailChip>#{booking.id}</DetailChip>
                  <DetailChip>Cliff Villa · CV-12</DetailChip>
                  <DetailChip>2 Nights</DetailChip>
                  <DetailChip>2 Adults</DetailChip>
                  <DetailChip>Breakfast</DetailChip>
                </div>

                <div className="h-px bg-[#C9A84C]/30 my-3" />

                <button
                  data-testid="wa-checkin-cta"
                  onClick={onOpen}
                  className="w-full bg-[#C9A84C] hover:bg-[#E8C97A] active:scale-[0.99] transition text-[#0D0D0D] font-ui font-semibold text-[12px] rounded-lg py-2.5"
                >
                  ✦ Complete Express Check-In
                </button>
                <p className="text-center font-body text-[10px] text-[#C9A84C]/70 mt-1.5">
                  Need help? Chat with our concierge →
                </p>
              </div>

              {/* Footer time + ticks */}
              <div className="flex items-center justify-end gap-1 pr-3 pb-2 -mt-0.5">
                <span className="text-[10px] text-[#94A3B8] font-body">9:41 AM</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.2 }}
                  className="text-[#53BDEB] text-[12px] leading-none"
                  data-testid="wa-double-tick"
                >
                  ✓✓
                </motion.span>
              </div>
            </div>

            {/* Opened indicator */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.3 }}
              className="text-right text-[10px] text-[#8696A0] mt-1 mr-1 font-body"
            >
              Opened 9:43 AM ✓✓
            </motion.p>
          </motion.div>
        </div>
      </PhoneFrame>

      {/* CTA below the phone */}
      <div className="px-6 pb-10 -mt-2 flex flex-col items-center">
        <GoldButton
          size="lg"
          className="w-full max-w-[390px]"
          onClick={onOpen}
          dataTestid="open-checkin-link"
        >
          → Open Your Check-in Link
        </GoldButton>
        <button
          onClick={onExit}
          className="mt-3 text-[10px] font-ui uppercase tracking-[0.28em] text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors"
        >
          Exit demo
        </button>
      </div>
    </div>
  );
}
