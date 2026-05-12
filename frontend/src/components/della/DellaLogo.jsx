import React from "react";

/**
 * Della Resorts brand mark — uses the official logo PNG when available
 * and falls back to a Cormorant Garamond italic wordmark.
 *
 * Variants:
 *   - "auto"   (logo on dark surfaces, wordmark on light)
 *   - "logo"   (always show logo image)
 *   - "mark"   (always show typographic wordmark)
 */
export default function DellaLogo({
  variant = "auto",
  size = 32,
  onLight = false,
  className = "",
  withTagline = false,
  dataTestid = "della-logo",
}) {
  const showLogo = variant === "logo" || (variant === "auto" && !onLight);

  if (showLogo) {
    return (
      <div className={`inline-flex flex-col items-center ${className}`} data-testid={dataTestid}>
        <img
          src="/della-logo.png"
          alt="Della Resorts"
          style={{ height: size, width: "auto", display: "block" }}
          draggable={false}
        />
        {withTagline && (
          <span
            className="font-display italic text-[#F5F0E8]/70 mt-1"
            style={{ fontSize: size * 0.32, letterSpacing: "0.04em" }}
          >
            Experiential Hospitality
          </span>
        )}
      </div>
    );
  }

  // Typographic fallback (light surfaces / inline contexts)
  return (
    <span
      className={`font-display italic text-[#0D0D0D] ${className}`}
      style={{ fontSize: size * 0.75, lineHeight: 1 }}
      data-testid={dataTestid}
    >
      Della
    </span>
  );
}
