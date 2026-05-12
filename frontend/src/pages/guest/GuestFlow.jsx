import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import WhatsappPreview from "./WhatsappPreview";
import Preloader from "./Preloader";
import WelcomeHero from "./WelcomeHero";
import Step1Personal from "./Step1Personal";
import Step2CoGuests from "./Step2CoGuests";
import Step3Preferences from "./Step3Preferences";
import Step4Signature from "./Step4Signature";
import Confirmation from "./Confirmation";

/**
 * The full guest experience state machine.
 * Each "stage" is an independent screen with framer-motion transitions.
 */
const STAGES = [
  "whatsapp",
  "preloader",
  "welcome",
  "step1",
  "step2",
  "step3",
  "step4",
  "confirmation",
];

export default function GuestFlow() {
  const navigate = useNavigate();
  const { reservations, markFormSubmitted } = useApp();
  const booking = reservations.find((r) => r.id === "RES-2401") || reservations[0];

  const [stage, setStage] = useState("whatsapp");
  const [direction, setDirection] = useState(1);

  // Aggregated form payload (lives only here)
  const [payload, setPayload] = useState({
    primary: { dob: "", idType: "", idFile: null },
    coGuests: [
      { fullName: "", relationship: "", nationality: "", dob: "", idType: "", idFile: null },
    ],
    child: { name: "Arjun", dob: "", guardian: "Aarav Mehta" },
    occasion: "Anniversary",
    occasionDetail: "",
    specialRequests: "",
    dietary: ["Vegetarian"],
    arrivalTime: "3:00 PM",
    signature: null,
    consent: false,
  });

  const updatePayload = useCallback((patch) => {
    setPayload((p) => ({ ...p, ...patch }));
  }, []);

  const goTo = useCallback((next) => {
    const cur = STAGES.indexOf(stage);
    const nxt = STAGES.indexOf(next);
    setDirection(nxt >= cur ? 1 : -1);
    setStage(next);
  }, [stage]);

  const submitCheckin = useCallback(() => {
    markFormSubmitted(booking.id, payload);
    goTo("confirmation");
  }, [booking.id, markFormSubmitted, payload, goTo]);

  const slide = {
    initial: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <div className="bg-[#0D1F0F] min-h-screen" data-testid="guest-flow">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={stage}
          custom={direction}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slide}
          transition={slide.transition}
        >
          {stage === "whatsapp" && (
            <WhatsappPreview
              booking={booking}
              onOpen={() => goTo("preloader")}
              onExit={() => navigate("/")}
            />
          )}
          {stage === "preloader" && <Preloader onDone={() => goTo("welcome")} />}
          {stage === "welcome" && (
            <WelcomeHero
              booking={booking}
              onBegin={() => goTo("step1")}
              onExit={() => navigate("/")}
            />
          )}
          {stage === "step1" && (
            <Step1Personal
              booking={booking}
              payload={payload}
              update={updatePayload}
              onNext={() => goTo("step2")}
              onBack={() => goTo("welcome")}
            />
          )}
          {stage === "step2" && (
            <Step2CoGuests
              booking={booking}
              payload={payload}
              update={updatePayload}
              onNext={() => goTo("step3")}
              onBack={() => goTo("step1")}
            />
          )}
          {stage === "step3" && (
            <Step3Preferences
              payload={payload}
              update={updatePayload}
              onNext={() => goTo("step4")}
              onBack={() => goTo("step2")}
            />
          )}
          {stage === "step4" && (
            <Step4Signature
              payload={payload}
              update={updatePayload}
              onSubmit={submitCheckin}
              onBack={() => goTo("step3")}
            />
          )}
          {stage === "confirmation" && (
            <Confirmation
              booking={booking}
              payload={payload}
              onHome={() => navigate("/")}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
