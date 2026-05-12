import React, { useRef, useState, useEffect } from "react";
import { Check } from "lucide-react";
import StepShell from "./StepShell";
import GoldButton from "../../components/della/GoldButton";

export default function Step4Signature({ payload, update, onSubmit, onBack }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });
  const [hasInk, setHasInk] = useState(Boolean(payload.signature));

  // Initial scale to DPR
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = "#C9A84C";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (payload.signature) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = payload.signature;
    }
  }, []); // eslint-disable-line

  const getPoint = (e) => {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    const t = e.touches?.[0];
    return {
      x: (t?.clientX ?? e.clientX) - rect.left,
      y: (t?.clientY ?? e.clientY) - rect.top,
    };
  };

  const start = (e) => {
    e.preventDefault();
    drawingRef.current = true;
    lastRef.current = getPoint(e);
    setHasInk(true);
  };
  const move = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const p = getPoint(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastRef.current = p;
  };
  const end = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const data = canvasRef.current.toDataURL("image/png");
    update({ signature: data });
  };

  const clear = () => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    setHasInk(false);
    update({ signature: null });
  };

  const canSubmit = hasInk && payload.consent;

  return (
    <StepShell
      step={4}
      title="Almost There"
      subtitle="Your digital signature confirms your stay details."
      onBack={onBack}
      footer={
        <>
          <GoldButton
            size="lg"
            className="w-full !text-[14px] !tracking-[0.16em]"
            disabled={!canSubmit}
            onClick={onSubmit}
            dataTestid="submit-checkin"
          >
            Submit My Check-in ✓
          </GoldButton>
          <p className="mt-3 font-body text-[10px] text-[#F5F0E8]/40 text-center">
            🔒 256-bit encrypted · Your data is safe with Della
          </p>
        </>
      }
    >
      {/* Signature canvas */}
      <div className="relative rounded-xl border border-[#C9A84C]/60 overflow-hidden bg-[#1a1a1a]">
        <canvas
          ref={canvasRef}
          className="block w-full h-[140px] touch-none cursor-crosshair"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
          data-testid="signature-canvas"
        />
        {!hasInk && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-display italic text-[#F5F0E8]/30">
            Sign here
          </span>
        )}
      </div>
      <div className="flex justify-end mt-1.5">
        <button
          onClick={clear}
          className="text-[10px] font-ui text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors"
          data-testid="clear-signature"
        >
          Clear Signature
        </button>
      </div>

      {/* Consent */}
      <div className="mt-6 rounded-xl border border-white/5 bg-[#0a0a0a] p-4">
        <p className="font-body text-[12px] text-[#F5F0E8]/80 leading-relaxed">
          I confirm that all details provided are accurate. I consent to Della
          Resorts, Lonavala processing this information for the purpose of my
          stay and personalised services under applicable privacy law (PDPA
          2023).
        </p>

        <button
          type="button"
          onClick={() => update({ consent: !payload.consent })}
          className="flex items-center gap-3 mt-4"
          data-testid="consent-toggle"
        >
          <span
            className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
              payload.consent
                ? "border-[#C9A84C] bg-[#C9A84C]"
                : "border-[#C9A84C]/50 bg-transparent"
            }`}
          >
            {payload.consent && (
              <Check size={12} className="text-[#0D0D0D]" strokeWidth={3.5} />
            )}
          </span>
          <span className="font-body text-[13px] text-[#F5F0E8]">
            I agree to the above
          </span>
        </button>
      </div>
    </StepShell>
  );
}
