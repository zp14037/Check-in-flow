import React from "react";

export default function ProgressDots({ total = 4, active = 0 }) {
  return (
    <div className="flex items-center justify-center gap-2.5" data-testid="progress-dots">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active;
        const isDone = i < active;
        return (
          <React.Fragment key={i}>
            <span
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? "w-2.5 h-2.5 bg-[#C9A84C] shadow-[0_0_12px_rgba(201,168,76,0.6)]"
                  : isDone
                  ? "w-2 h-2 bg-[#C9A84C]/70"
                  : "w-2 h-2 bg-[#C9A84C]/25"
              }`}
            />
            {i < total - 1 && (
              <span
                className={`h-px w-5 transition-colors duration-300 ${
                  isDone ? "bg-[#C9A84C]/70" : "bg-[#C9A84C]/20"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
