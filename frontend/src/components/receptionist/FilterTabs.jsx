import React from "react";

export default function FilterTabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-[#F5EDD3] rounded-full w-fit" data-testid="filter-tabs">
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            data-testid={`tab-${t.key}`}
            className={`px-4 py-1.5 rounded-full font-ui text-[12px] font-medium transition-all ${
              isActive
                ? "bg-[#C9A84C] text-[#0D0D0D] shadow-sm"
                : "text-[#6B7280] hover:text-[#1a1a1a]"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
