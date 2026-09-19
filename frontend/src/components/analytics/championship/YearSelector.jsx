"use client";

import { driverTheme } from "../theme";

export default function YearSelector({ year, setYear, seasons }) {
  const minYear = seasons[seasons.length - 1];
  const maxYear = seasons[0];

  function step(delta) {
    const next = year + delta;
    if (seasons.includes(next)) setYear(next);
  }

  return (
    <div className="flex items-center overflow-hidden rounded-md" style={{ background: "rgba(1,8,23,0.5)", border: "1px solid rgba(193,232,255,0.2)" }}>
      <button type="button" onClick={() => step(-1)} disabled={year <= minYear} className="h-11 w-11 text-lg transition-colors duration-150 hover:bg-[rgba(225,6,0,0.18)] disabled:opacity-30" style={{ color: driverTheme.skyLight, fontFamily: "var(--font-technical)" }}>−</button>
      <span className="w-20 text-center text-lg" style={{ color: driverTheme.paleBlue, fontFamily: "var(--font-display)", fontWeight: 600 }}>{year}</span>
      <button type="button" onClick={() => step(1)} disabled={year >= maxYear} className="h-11 w-11 text-lg transition-colors duration-150 hover:bg-[rgba(225,6,0,0.18)] disabled:opacity-30" style={{ color: driverTheme.skyLight, fontFamily: "var(--font-technical)" }}>+</button>
    </div>
  );
}