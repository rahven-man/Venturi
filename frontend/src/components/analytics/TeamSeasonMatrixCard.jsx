"use client";

import { useState } from "react";
import { driverTheme } from "./theme";

export default function TeamSeasonMatrixCard({ seasonTrend, variant }) {
  const [selected, setSelected] = useState(null);
  const gradient = variant === "A" ? `linear-gradient(120deg, ${driverTheme.bgMid}, ${driverTheme.bgDeep})` : `linear-gradient(120deg, ${driverTheme.steel}, ${driverTheme.bgMid})`;
  const maxPoints = Math.max(...seasonTrend.map((item) => Number(item.points) || 0), 1);
  return (
    <div className="relative overflow-hidden p-8" style={{ background: gradient, borderRadius: "18px", border: "1px solid rgba(193,232,255,0.16)" }}>
        <div><p className="mb-2 text-[10px] tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>SEASON FIELD / PERFORMANCE INTENSITY</p><h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.7rem", color: driverTheme.paleBlue }}>CONSTRUCTOR SEASON MATRIX</h2></div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{seasonTrend.map((item) => { const intensity = Math.max(0.12, (Number(item.points) || 0) / maxPoints); const active = selected === item; return <button key={item.year} type="button" onClick={() => setSelected(active ? null : item)} className="group relative overflow-hidden rounded-lg p-4 text-left transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-[var(--color-palette-ice)]" style={{ background: `linear-gradient(135deg, rgba(225,6,0,${intensity}), rgba(2,16,36,0.55))`, border: `1px solid ${active ? driverTheme.paleBlue : "rgba(193,232,255,0.16)"}`, boxShadow: "none" }}><span className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100" style={{ background: driverTheme.paleBlue }} /><span className="relative z-10 block text-lg" style={{ fontFamily: "var(--font-display)", color: "#ffffff" }}>{item.year}</span><span className="relative z-10 mt-3 block text-2xl tabular-nums" style={{ fontFamily: "var(--font-display)", color: driverTheme.paleBlue }}>{item.points ?? 0}</span><span className="relative z-10 mt-1 block text-[10px] tracking-[0.16em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>POINTS · {item.wins ?? 0} WINS · {item.podiums ?? 0} PODIUMS</span></button>; })}</div>
      {selected && <div className="mt-6 flex flex-wrap gap-6 rounded-lg px-5 py-4" style={{ background: "rgba(1,8,23,0.5)", border: `1px solid ${driverTheme.paleBlue}88`, fontFamily: "var(--font-technical)", color: driverTheme.paleBlue }}><span>{selected.year} SEASON</span><span>{selected.races} RACE ENTRIES</span><span>{selected.points} POINTS</span><span>{selected.wins} WINS</span><span>{selected.podiums} PODIUMS</span></div>}
    </div>
  );
}
