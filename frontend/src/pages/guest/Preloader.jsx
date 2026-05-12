import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function Preloader({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2300);
    return () => clearTimeout(t);
  }, [onDone]);

  const dots = Array.from({ length: 8 }).map((_, i) => i);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D1F0F]"
      data-testid="preloader"
    >
      {/* Radiating dots */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {dots.map((i) => {
          const angle = (i / dots.length) * 2 * Math.PI;
          return (
            <motion.span
              key={i}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeOut",
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#C9A84C]"
              style={{
                transform: `translate(${Math.cos(angle) * 50}px, ${Math.sin(angle) * 50}px)`,
              }}
            />
          );
        })}

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="font-display italic relative z-10"
          style={{
            fontSize: 96,
            color: "#C9A84C",
            letterSpacing: "-2px",
            textShadow: "0 0 40px rgba(201,168,76,0.4)",
            lineHeight: 1,
          }}
        >
          D
        </motion.div>
      </div>

      {/* Progress track */}
      <div className="mt-10 w-[200px] h-[2px] rounded-full bg-[#C9A84C]/20 overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.0, ease: "easeInOut" }}
          className="h-full bg-[#C9A84C]"
        />
      </div>

      <p
        className="font-display italic text-[#F5F0E8]/70 mt-5"
        style={{ fontSize: 14, letterSpacing: "0.1em" }}
      >
        Personalising your arrival experience…
      </p>
    </div>
  );
}
