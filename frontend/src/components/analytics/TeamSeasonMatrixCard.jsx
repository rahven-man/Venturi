"use client";

import { useState } from "react";
import { driverTheme } from "./theme";

export default function TeamSeasonMatrixCard({ seasonTrend }) {
  const [selected, setSelected] = useState(null);
  const maxPoints = Math.max(...seasonTrend.map((item) => Number(item.points) || 0), 1);

  return (
    <div
      className="relative overflow-hidden p-8 rounded-[20px]"
      style={{
        backgroundColor: "#052659",
        borderRadius: "20px",
        border: "1px solid rgba(193,232,255,0.16)",
        boxShadow: "0 20px 45px -12px rgba(0, 0, 0, 0.65)",
      }}
    >
      {/* Telemetry micro-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(193,232,255,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(193,232,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10">
        <p className="mb-1 text-[10px] tracking-[0.24em] uppercase" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>SEASON FIELD / PERFORMANCE INTENSITY</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.7rem", color: driverTheme.paleBlue }}>CONSTRUCTOR SEASON MATRIX</h2>
      </div>

      <div className="relative z-10 mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {seasonTrend.map((item) => {
          const intensity = Math.max(0.12, (Number(item.points) || 0) / maxPoints);
          const active = selected === item;
          return (
            <button
              key={item.year}
              type="button"
              onClick={() => setSelected(active ? null : item)}
              className="group relative overflow-hidden rounded-xl p-4 text-left transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-[var(--color-palette-ice)]"
              style={{
                background: `linear-gradient(135deg, rgba(225,6,0,${intensity}), #021024)`,
                border: `1px solid ${active ? driverTheme.paleBlue : "rgba(193,232,255,0.16)"}`,
                boxShadow: active ? `0 0 0 2px ${driverTheme.paleBlue}55` : "0 4px 14px rgba(0,0,0,0.3)",
              }}
            >
              <span className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100" style={{ background: driverTheme.paleBlue }} />
              <span className="relative z-10 block text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "#ffffff" }}>{item.year}</span>
              <span className="relative z-10 mt-2 block text-2xl font-bold tabular-nums" style={{ fontFamily: "var(--font-display)", color: driverTheme.paleBlue }}>{item.points ?? 0}</span>
              <span className="relative z-10 mt-1 block text-[10px] tracking-[0.16em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>POINTS · {item.wins ?? 0} WINS · {item.podiums ?? 0} PODIUMS</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="relative z-10 mt-6 flex flex-wrap gap-6 rounded-xl px-5 py-4" style={{ background: "#021024", border: `1px solid ${driverTheme.paleBlue}88`, fontFamily: "var(--font-technical)", color: driverTheme.paleBlue, boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
          <span>{selected.year} SEASON</span>
          <span>{selected.races} RACE ENTRIES</span>
          <span>{selected.points} POINTS</span>
          <span>{selected.wins} WINS</span>
          <span>{selected.podiums} PODIUMS</span>
        </div>
      )}
    </div>
  );
}
