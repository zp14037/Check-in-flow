import React from "react";
import { ChevronLeft } from "lucide-react";
import PhoneFrame from "../../components/della/PhoneFrame";
import StatusBar from "../../components/della/StatusBar";
import ProgressDots from "../../components/della/ProgressDots";

/**
 * Shared shell for the 4 form steps.
 */
export default function StepShell({
  step,
  title,
  subtitle,
  onBack,
  children,
  footer,
}) {
  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col bg-[#0D1F0F]" data-testid={`step-shell-${step}`}>
        <StatusBar tone="ivory" />

        <header className="px-6 pt-3 pb-4 flex items-center justify-between">
          <button
            onClick={onBack}
            data-testid={`step-${step}-back`}
            className="text-[#F5F0E8]/70 hover:text-[#C9A84C] -ml-1.5 p-1.5 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <ProgressDots total={4} active={step - 1} />
          <span className="w-6" />
        </header>

        <div className="px-6 pb-3">
          <p className="font-ui text-[10px] uppercase tracking-[0.32em] text-[#C9A84C]">
            Step {step} of 4
          </p>
          <h1
            className="font-display italic text-[#F5F0E8] mt-1.5 leading-tight"
            style={{ fontSize: 30 }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 font-body text-[11px] text-[#F5F0E8]/55 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex-1 px-6 pb-4 overflow-y-auto">{children}</div>

        {footer && <div className="px-6 pt-3 pb-7 border-t border-white/5">{footer}</div>}
      </div>
    </PhoneFrame>
  );
}
