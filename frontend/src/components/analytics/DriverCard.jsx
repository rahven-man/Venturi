"use client";

import Link from "next/link";
import DriverImage from "./DriverImage";
import { driverTheme } from "./theme";

const VARIANTS = {
  A: `linear-gradient(135deg, ${driverTheme.bgMid} 0%, ${driverTheme.bgDeep} 100%)`,
  B: `linear-gradient(135deg, ${driverTheme.steel} 0%, ${driverTheme.bgMid} 100%)`,
};
const FADE = { A: driverTheme.bgMid, B: driverTheme.steel };

export default function DriverCard({ driver, colorVariant }) {
  return (
    <Link
      href={`/analytics/drivers/${driver.driver_id}`}
      className="group relative flex overflow-hidden"
      style={{
        background: VARIANTS[colorVariant],
        borderRadius: "18px",
        minHeight: "22rem",
        border: "1px solid rgba(193,232,255,0.1)",
      }}
    >
<div
  className="relative z-10 flex flex-col justify-center p-7"
  style={{ width: "55%" }}
>
  <div>
    {driver.slogan && (
      <p
        className="mb-5"
        style={{
          fontFamily: "var(--font-script)",
          fontSize: "clamp(2rem, 3vw, 3rem)",
          lineHeight: 0.95,
          color: driverTheme.paleBlue,
          opacity: 0.92,
          whiteSpace: "nowrap",
        }}
      >
        {driver.slogan}
      </p>
    )}

    <h3
      className="transition-transform duration-300 group-hover:-translate-y-1"
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 400,
        fontSize: "clamp(1.7rem, 2.4vw, 2.2rem)",
        lineHeight: 1.1,
        color: driverTheme.paleBlue,
      }}
    >
      {driver.displayName}
    </h3>

    {driver.current_team && (
      <p
        className="mt-2 text-xs tracking-[0.15em]"
        style={{
          fontFamily: "var(--font-technical)",
          color: driverTheme.skyLight,
        }}
      >
        {driver.current_team.toUpperCase()}
      </p>
    )}
  </div>
</div>

      <div className="absolute top-0 right-0 h-full" style={{ width: "45%" }}>
        <DriverImage
          filename={driver.filename}
          alt={driver.displayName}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "  top center" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(90deg, ${FADE[colorVariant]} 0%, transparent 25%)` }}
        />
      </div>
    </Link>
  );
}