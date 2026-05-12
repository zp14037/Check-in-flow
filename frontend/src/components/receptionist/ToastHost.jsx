import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle2 } from "lucide-react";

/**
 * Minimal bottom-right toast host with global imperative API.
 * Usage:
 *   import { toast } from "./ToastHost";
 *   toast("✅ WhatsApp resent to Priya Sharma");
 */

let push = () => {};
export const toast = (message) => push(message);

export default function ToastHost() {
  const [items, setItems] = useState([]);

  const add = useCallback((message) => {
    const id = Math.random().toString(36).slice(2);
    setItems((arr) => [...arr, { id, message }]);
    setTimeout(() => {
      setItems((arr) => arr.filter((i) => i.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    push = add;
    return () => {
      push = () => {};
    };
  }, [add]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end pointer-events-none"
      data-testid="toast-host"
    >
      {items.map((it) => (
        <div
          key={it.id}
          className="pointer-events-auto bg-[#1a1a1a] text-[#F5F0E8] border border-white/10 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 min-w-[280px] toast-enter"
        >
          <CheckCircle2 size={16} className="text-green-400 shrink-0" />
          <span className="font-body text-[13px]">{it.message}</span>
        </div>
      ))}
      <style>{`
        @keyframes toastIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .toast-enter { animation: toastIn 240ms ease-out; }
      `}</style>
    </div>
  );
}
