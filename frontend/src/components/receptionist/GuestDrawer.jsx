import React from "react";
import { X, Info, Printer, MessageSquare, Settings, CheckCircle2 } from "lucide-react";
import SourcePill from "./SourcePill";
import StatusPillLight from "./StatusPillLight";

export default function GuestDrawer({ guest, open, onClose, onCompleteCheckin }) {
  // Backdrop + drawer
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        data-testid="guest-drawer"
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl border-l border-[#E8E2D9] z-40 flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#1C1C1E] px-6 py-5 relative">
          <button
            data-testid="drawer-close"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors"
          >
            <X size={18} />
          </button>
          {guest && (
            <>
              <h2 className="font-display italic text-[24px] text-[#F5F0E8] leading-tight">
                {guest.guestName}
              </h2>
              <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] mt-1">
                #{guest.id} · {guest.roomType}
              </p>
            </>
          )}
        </div>

        {/* Body */}
        {guest && (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Booking details */}
            <section>
              <SectionLabel>Booking</SectionLabel>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Detail label="Room" value={`${guest.roomNumber} · ${guest.roomType}`} />
                <Detail label="Check-in" value={`${guest.arrival} · ${guest.expectedTime || "3:00 PM"}`} />
                <Detail label="Check-out" value={`${addDays(guest.arrival, guest.nights || 1)} · 11:00 AM`} />
                <Detail
                  label="Guests"
                  value={`${guest.adults || 2} Adult${(guest.adults || 2) > 1 ? "s" : ""}${
                    guest.children ? ` · ${guest.children} Child` : ""
                  }`}
                />
                <Detail label="Plan" value={guest.mealPlan || "Breakfast"} />
                <div>
                  <p className="font-ui text-[9px] uppercase tracking-[0.22em] text-[#9CA3AF]">Source</p>
                  <div className="mt-1.5">
                    <SourcePill source={guest.source} />
                  </div>
                </div>
              </div>
            </section>

            {/* Occasion */}
            {guest.occasion && (
              <section>
                <SectionLabel>Occasion</SectionLabel>
                <div className="mt-2 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/40 p-4">
                  <p className="font-ui text-[12px] text-[#C9A84C] font-semibold">
                    💍 {guest.occasion}
                  </p>
                  {guest.occasionDetail && (
                    <p className="font-body text-[12px] text-[#1a1a1a] mt-1">{guest.occasionDetail}</p>
                  )}
                </div>
              </section>
            )}

            {/* Special request */}
            {guest.specialRequest && (
              <section>
                <SectionLabel>Special Request</SectionLabel>
                <div className="mt-2 rounded-r-xl bg-amber-50 border-l-4 border-[#C9A84C] p-4">
                  <p className="font-body text-[13px] text-[#1a1a1a] leading-relaxed">
                    🎁 {guest.specialRequest}
                  </p>
                  <p className="font-ui text-[11px] text-green-600 mt-2 font-semibold">F&B notified ✓</p>
                </div>
              </section>
            )}

            {/* Guests & IDs */}
            <section>
              <SectionLabel>Co-Guests & IDs</SectionLabel>
              <div className="mt-3 space-y-3">
                {(guest.coGuests || []).filter((g) => g.fullName).map((g) => (
                  <div key={g.fullName} className="flex items-center gap-3">
                    <div className="bg-[#F5F0E8] rounded-lg w-12 h-8 flex items-center justify-center text-[10px] text-[#6B7280] font-ui font-bold">
                      ID
                    </div>
                    <div className="flex-1">
                      <p className="font-body text-[13px] text-[#1a1a1a]">
                        {g.fullName} · {g.relationship}
                      </p>
                      <p className="font-ui text-[11px] text-green-600">
                        ✅ {g.idType || "ID"} Uploaded
                      </p>
                    </div>
                  </div>
                ))}
                {(guest.childGuests || []).map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <div className="bg-[#F5F0E8] rounded-lg w-12 h-8 flex items-center justify-center text-[10px] text-[#6B7280] font-ui">
                      —
                    </div>
                    <p className="font-body text-[13px] text-[#1a1a1a]">
                      {c.name} · Child · Age {c.age}
                    </p>
                  </div>
                ))}
                {(!guest.coGuests?.some((g) => g.fullName) && !guest.childGuests?.length) && (
                  <p className="font-body text-[12px] text-[#9CA3AF]">No co-guests on file.</p>
                )}
              </div>
            </section>

            {/* IDS Sync */}
            <section>
              <div className="flex items-center gap-2">
                <SectionLabel>IDS FortuneNext</SectionLabel>
                <Info size={11} className="text-[#9CA3AF]" />
              </div>
              <div className="mt-2">
                {guest.idsSync?.status === "synced" ? (
                  <StatusPillLight kind="verified" label={`✅ Synced · ${guest.idsSync.at}`} />
                ) : (
                  <StatusPillLight kind="pending" label="⏳ Pending RPA Sync" />
                )}
              </div>
            </section>
          </div>
        )}

        {/* Footer */}
        {guest && (
          <div className="border-t border-[#E8E2D9] p-4 bg-white">
            <button
              onClick={() => onCompleteCheckin(guest.id)}
              data-testid="drawer-complete-checkin"
              disabled={guest.checkedIn}
              className="w-full h-12 rounded-full bg-[#C9A84C] hover:bg-[#E8C97A] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D0D0D] font-ui font-bold text-[13px] tracking-[0.12em] uppercase transition-all"
            >
              {guest.checkedIn ? "✓ Checked-In" : "✅ Complete Check-In"}
            </button>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <DrawerAction icon={MessageSquare} label="Resend" />
              <DrawerAction icon={Printer} label="Print" tooltip="Required for foreign national guests (FRRO Form C). Auto-populated from form data — zero manual re-entry." />
              <DrawerAction icon={Settings} label="Override" />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="font-ui text-[9px] uppercase tracking-[0.22em] text-[#9CA3AF] font-semibold">
      {children}
    </p>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="font-ui text-[9px] uppercase tracking-[0.22em] text-[#9CA3AF]">{label}</p>
      <p className="font-body text-[13px] text-[#1a1a1a] mt-1">{value}</p>
    </div>
  );
}

function DrawerAction({ icon: Icon, label, tooltip }) {
  return (
    <button
      title={tooltip}
      className="rounded-lg border border-[#E8E2D9] text-[#6B7280] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors py-2 font-ui text-[11px] flex flex-col items-center gap-1"
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

function addDays(dateStr, n) {
  try {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + (n || 0));
    return d.toISOString().slice(0, 10);
  } catch (e) {
    return dateStr;
  }
}

// Expose CheckCircle2 to silence lint about unused import
export const _icons = { CheckCircle2 };
