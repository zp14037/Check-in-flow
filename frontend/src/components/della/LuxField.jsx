import React from "react";

/**
 * Underline-only luxury field (dark surfaces).
 */
export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  prefilled = false,
  required = false,
  dataTestid,
  readOnly = false,
}) {
  return (
    <label className="block py-2" data-testid={dataTestid ? `${dataTestid}-wrap` : undefined}>
      <div className="flex items-end justify-between">
        <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#F5F0E8]/55">
          {label} {required && <span className="text-[#C9A84C]">*</span>}
        </span>
        {prefilled && (
          <span className="font-display italic text-[9px] text-[#C9A84C]">
            ✓ Pre-filled by Della
          </span>
        )}
      </div>
      <input
        type={type}
        value={value ?? ""}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        data-testid={dataTestid}
        className={`w-full bg-transparent border-b border-[#C9A84C]/40 focus:border-[#C9A84C] outline-none py-2.5 font-body text-[14px] ${
          prefilled ? "text-[#E8C97A]" : "text-[#F5F0E8]"
        } placeholder:text-[#F5F0E8]/40 transition-colors`}
        style={{ colorScheme: "dark" }}
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  prefilled = false,
  required = false,
  dataTestid,
}) {
  return (
    <label className="block py-2">
      <div className="flex items-end justify-between">
        <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#F5F0E8]/55">
          {label} {required && <span className="text-[#C9A84C]">*</span>}
        </span>
        {prefilled && (
          <span className="font-display italic text-[9px] text-[#C9A84C]">
            ✓ Pre-filled by Della
          </span>
        )}
      </div>
      <select
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        data-testid={dataTestid}
        className={`w-full bg-transparent border-b border-[#C9A84C]/40 focus:border-[#C9A84C] outline-none py-2.5 font-body text-[14px] ${
          prefilled ? "text-[#E8C97A]" : "text-[#F5F0E8]"
        } appearance-none transition-colors`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23C9A84C' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 4px center",
          paddingRight: 24,
        }}
      >
        <option value="" disabled className="bg-[#0D1F0F]">
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#0D1F0F] text-[#F5F0E8]">
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
