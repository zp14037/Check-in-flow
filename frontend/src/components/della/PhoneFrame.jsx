import React from "react";

/**
 * PhoneFrame — adds subtle device chrome on desktop, becomes a no-op on small screens.
 * Width 390px (iPhone 14 Pro), aspect ratio kept loose so content can scroll vertically.
 */
export default function PhoneFrame({ children, dataTestid = "phone-frame" }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0D1F0F] px-4 py-6 lg:py-10">
      <div
        data-testid={dataTestid}
        className="relative w-full max-w-[390px] mx-auto lg:rounded-[40px] lg:border-4 lg:border-[#333] lg:bg-[#1a1a1a] lg:p-[10px] lg:shadow-2xl"
      >
        {/* Glow on desktop */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute -inset-10 -z-10 rounded-[60px] pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgba(201,168,76,0.18), transparent 70%)",
          }}
        />
        <div className="relative bg-[#0D1F0F] overflow-hidden lg:rounded-[32px] min-h-[844px] flex flex-col">
          {/* Notch on desktop */}
          <div className="hidden lg:flex absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 rounded-full bg-black z-50 items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#1a1a1a] mr-2" />
            <span className="w-12 h-1.5 rounded-full bg-[#0a0a0a]" />
          </div>
          {children}
          {/* Home indicator bar */}
          <div className="hidden lg:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-[#F5F0E8]/60 z-50" />
        </div>
      </div>
    </div>
  );
}
