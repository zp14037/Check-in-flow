import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import GoldButton from "../../components/della/GoldButton";

export default function GuestView() {
  const navigate = useNavigate();
  const { reservations, markFormSubmitted } = useApp();
  const sample = reservations[0];

  return (
    <div className="min-h-screen relative overflow-hidden grain" style={{ backgroundColor: "#0D1F0F" }} data-testid="guest-view">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(700px 500px at 50% -10%, rgba(201,168,76,0.12), transparent 60%)",
        }}
      />
      <header className="relative z-10 max-w-[520px] mx-auto px-6 pt-8 flex items-center justify-between">
        <button
          data-testid="back-to-landing"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-[11px] font-ui uppercase tracking-[0.2em] text-[#F5F0E8]/60 hover:text-[#C9A84C] transition-colors"
        >
          <ArrowLeft size={14} /> Roles
        </button>
        <span className="font-display italic text-2xl text-[#C9A84C]">Della</span>
      </header>

      <main className="relative z-10 max-w-[520px] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="font-ui text-[10px] uppercase tracking-[0.4em] text-[#C9A84C]/80">
            Pre-arrival experience
          </p>
          <h1 className="font-display italic text-5xl text-[#F5F0E8] mt-3">
            Welcome, {sample?.guestName?.split(" ")[0] || "Guest"}
          </h1>
          <div className="gold-rule w-32 mx-auto mt-5" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-10 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md p-7"
        >
          <div className="flex items-center gap-3 text-[#16A34A]">
            <MessageCircle size={16} />
            <span className="font-ui text-[10px] uppercase tracking-[0.3em]">
              Sent via WhatsApp
            </span>
          </div>
          <p className="font-body text-[14px] text-[#F5F0E8]/85 mt-4 leading-relaxed">
            Namaste {sample?.guestName?.split(" ")[0]}, we're delighted to host you at Della Resorts this {sample?.arrival}.
            Please complete your pre-arrival check-in below — it takes under a minute.
          </p>

          <div className="mt-7 space-y-3 text-[12px] font-ui text-[#F5F0E8]/70">
            <Row label="Reservation" value={sample?.id} />
            <Row label="Room" value={`${sample?.roomNumber} · ${sample?.roomType}`} />
            <Row label="Nights" value={sample?.nights} />
            <Row label="Guests" value={sample?.guests} />
          </div>

          <div className="mt-8">
            {sample?.formSubmitted ? (
              <div
                className="rounded-full bg-[#3A7D44]/20 border border-[#3A7D44]/40 text-[#E8C97A] px-5 py-3 flex items-center justify-center gap-2 font-ui text-[11px] uppercase tracking-[0.2em]"
                data-testid="guest-form-submitted"
              >
                <Check size={14} /> Check-In Form Submitted
              </div>
            ) : (
              <GoldButton
                size="lg"
                className="w-full"
                onClick={() => markFormSubmitted(sample.id)}
                dataTestid="guest-submit-form"
              >
                Complete Check-In Form
              </GoldButton>
            )}
          </div>
        </motion.div>

        <p className="mt-6 text-center text-[10px] font-ui uppercase tracking-[0.28em] text-[#F5F0E8]/30">
          Placeholder · Full guided form ships in the next phase
        </p>
      </main>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-[10px] uppercase tracking-[0.22em] text-[#F5F0E8]/40">{label}</span>
      <span className="font-body text-[13px] text-[#F5F0E8]">{value}</span>
    </div>
  );
}
