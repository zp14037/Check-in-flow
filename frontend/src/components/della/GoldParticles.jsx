import React, { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * Subtle gold particle field — floats upward slowly.
 * Designed for the Landing screen only.
 */
export default function GoldParticles({ count = 20 }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        duration: 14 + Math.random() * 18,
        delay: Math.random() * -20,
        opacity: 0.3 + Math.random() * 0.3,
        drift: -10 + Math.random() * 20,
      })),
    [count]
  );

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
      data-testid="gold-particles"
    >
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.left}%`,
            bottom: "-10px",
            width: d.size,
            height: d.size,
            backgroundColor: "#C9A84C",
            boxShadow: "0 0 6px rgba(201,168,76,0.6)",
            opacity: 0,
          }}
          animate={{
            y: ["0vh", "-110vh"],
            x: [0, d.drift, 0],
            opacity: [0, d.opacity, d.opacity, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.9, 1],
          }}
        />
      ))}
    </div>
  );
}
