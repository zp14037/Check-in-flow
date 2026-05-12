import React from "react";

/**
 * Della button system
 *   variant: "primary" | "outline" | "ghost"
 *   tone:    "gold" (default) | "ivory" (use on dark for ghost)
 */
export default function GoldButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  dataTestid,
  type = "button",
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-ui font-semibold uppercase tracking-[0.16em] rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

  const sizes = {
    sm: "text-[10px] px-4 py-2",
    md: "text-[11px] px-5 py-2.5",
    lg: "text-xs px-7 py-3.5",
  };

  const variants = {
    primary:
      "bg-[#C9A84C] text-[#0D0D0D] hover:bg-[#E8C97A] hover:shadow-[0_8px_24px_-8px_rgba(201,168,76,0.6)] active:scale-[0.98]",
    outline:
      "bg-transparent border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#C9A84C] hover:bg-[#C9A84C]/10 active:scale-[0.98]",
    ghostIvory:
      "bg-transparent text-[#F5F0E8]/80 hover:text-[#F5F0E8] hover:bg-white/5",
  };

  return (
    <button
      type={type}
      data-testid={dataTestid}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
