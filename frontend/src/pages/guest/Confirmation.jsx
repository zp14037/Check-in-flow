import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import PhoneFrame from "../../components/della/PhoneFrame";
import StatusBar from "../../components/della/StatusBar";
import GoldButton from "../../components/della/GoldButton";

export default function Confirmation({ booking, payload, onHome }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPulse(true), 700);
    return () => clearTimeout(t);
  }, []);

  const guestFirst = booking.primaryGuest.fullName.split(" ")[0];
  const qrValue = `DELLA-${booking.id.replace("RES-", "RES")}-${guestFirst.toUpperCase()}-${booking.primaryGuest.fullName.split(" ")[1]?.toUpperCase() || ""}-CHECKIN-VERIFIED-2026`;

  return (
    <PhoneFrame>
      <div
        className="flex-1 flex flex-col bg-[#0D1F0F] text-center px-6 pb-8"
        data-testid="confirmation-screen"
      >
        <StatusBar tone="ivory" />

        {/* Animated checkmark */}
        <div className="mt-10 relative flex items-center justify-center">
          {pulse && (
            <motion.span
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-24 h-24 rounded-full"
              style={{ boxShadow: "0 0 30px rgba(201,168,76,0.6)", background: "rgba(201,168,76,0.15)" }}
            />
          )}
          <svg width="92" height="92" viewBox="0 0 92 92">
            <motion.circle
              cx="46"
              cy="46"
              r="42"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ pathLength: 1 }}
            />
            <motion.path
              d="M30 47 L43 60 L64 35"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
            />
          </svg>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="font-display italic text-[#F5F0E8] mt-7 leading-tight"
          style={{ fontSize: 38 }}
        >
          You're All Set, {guestFirst}.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.5 }}
          className="font-display italic text-[#C9A84C] mt-2"
          style={{ fontSize: 15 }}
        >
          We look forward to welcoming you tomorrow at Della Resorts.
        </motion.p>

        {/* Glass summary */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-6 mx-auto max-w-[300px] rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-5 text-left"
          data-testid="confirmation-summary"
        >
          <Row icon="🏨" label="Cliff Villa · CV-12" />
          <Row icon="📅" label="Check-in: 18 Feb 2026 · 3:00 PM" />
          <Row icon="👥" label="2 Adults · 1 Child" />
          <Row icon="🍳" label="Breakfast Included" />
          {payload.occasion && (
            <Row icon="✨" label={`Occasion: ${payload.occasion}`} />
          )}

          {/* QR code */}
          <div className="mt-5 flex flex-col items-center">
            <div className="inline-block rounded-xl border-4 border-[#C9A84C] bg-[#0D0D0D] p-3">
              <QRCodeSVG
                value={qrValue}
                size={130}
                fgColor="#C9A84C"
                bgColor="#0D0D0D"
                level="M"
              />
            </div>
            <p
              className="mt-3 font-ui text-[8px] text-[#C9A84C]/70 text-center"
              style={{ letterSpacing: "0.2em" }}
            >
              {qrValue}
            </p>
            <p className="mt-1 font-ui text-[9px] text-[#C9A84C]/60 text-center" style={{ letterSpacing: "0.18em" }}>
              SHOW AT FRONT DESK
            </p>
          </div>
        </motion.div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-3">
          <GoldButton size="md" className="w-full" dataTestid="cta-concierge">
            💬 Chat with Concierge
          </GoldButton>
          <GoldButton
            size="md"
            variant="outline"
            className="w-full"
            onClick={onHome}
            dataTestid="cta-home"
          >
            ← Return to Home
          </GoldButton>
        </div>

        <div className="mt-auto pt-8 opacity-50">
          <img src="/della-logo.png" alt="Della" className="h-8 mx-auto" />
        </div>
      </div>
    </PhoneFrame>
  );
}

function Row({ icon, label }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className="text-[15px]">{icon}</span>
      <span className="font-body text-[13px] text-[#F5F0E8]/90">{label}</span>
    </div>
  );
}
