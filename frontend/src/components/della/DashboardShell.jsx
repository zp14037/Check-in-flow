import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useApp } from "../../context/AppContext";

/**
 * DashboardShell — shared frame for every staff-facing dashboard.
 * No decorative animation: staff are time-pressured.
 */
export default function DashboardShell({
  title,
  subtitle,
  accent = "Front Desk",
  children,
  rightSlot,
}) {
  const navigate = useNavigate();
  const { resetDemo } = useApp();

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#0D0D0D]" data-testid="dashboard-shell">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[#0D1F0F] text-[#F5F0E8] border-b border-[#C9A84C]/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              data-testid="back-to-landing"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-[11px] font-ui uppercase tracking-[0.2em] text-[#F5F0E8]/70 hover:text-[#C9A84C] transition-colors"
            >
              <ArrowLeft size={14} />
              Roles
            </button>
            <div className="h-5 w-px bg-[#C9A84C]/30" />
            <Link to="/" className="flex items-center" data-testid="brand-wordmark">
              <img src="/della-logo.png" alt="Della Resorts" className="h-8 w-auto" />
            </Link>
            <span className="text-[10px] font-ui uppercase tracking-[0.32em] text-[#F5F0E8]/50 pl-3 border-l border-[#C9A84C]/20">
              {accent}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {rightSlot}
            <button
              data-testid="reset-demo"
              onClick={() => {
                resetDemo();
                window.location.reload();
              }}
              className="inline-flex items-center gap-1.5 text-[10px] font-ui uppercase tracking-[0.2em] text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors"
              title="Reset demo data"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Page header */}
      <div className="border-b border-[#E8E2D9] bg-[#F5F0E8]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
          <p className="text-[10px] font-ui uppercase tracking-[0.4em] text-[#C9A84C] mb-2">
            Della Resorts · Lonavala
          </p>
          <h1 className="font-display italic text-4xl lg:text-5xl text-[#0D0D0D] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-[#0D0D0D]/60 font-body max-w-2xl">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">{children}</main>
    </div>
  );
}
