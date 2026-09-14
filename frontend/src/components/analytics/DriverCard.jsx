"use client";

import Link from "next/link";
import DriverImage from "./DriverImage";

// Alternating rich background per row - burgundy for variant A, petrol
// for variant B, per the VENTURI driver-card color system.
const VARIANTS = {
  A: "linear-gradient(135deg, #7A1B22 0%, #4A0F14 100%)",
  B: "linear-gradient(135deg, #0A6B71 0%, #043D41 100%)",
};

export default function DriverCard({ driver, colorVariant }) {
  return (
    <Link
      href={`/analytics/drivers/${driver.driver_id}`}
      className="group relative flex items-end overflow-hidden"
      style={{
        background: VARIANTS[colorVariant],
        borderRadius: "18px",
        minHeight: "22rem",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="absolute top-7 left-7 z-10">
        <h3
          className="transition-transform duration-300 group-hover:-translate-y-1"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(1.7rem, 2.4vw, 2.2rem)",
            lineHeight: 1.1,
            color: "var(--color-offwhite)",
          }}
        >
          {driver.full_name}
        </h3>
        {driver.current_team && (
          <p
            className="mt-2 text-xs tracking-[0.15em]"
            style={{ fontFamily: "var(--font-technical)", color: "rgba(242,242,239,0.7)" }}
          >
            {driver.current_team.toUpperCase()}
          </p>
        )}
      </div>

      <DriverImage
        fullName={driver.full_name}
        className="relative ml-auto h-full max-h-[22rem] w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
    </Link>
  );
}