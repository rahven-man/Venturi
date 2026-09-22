"use client";

import { useMemo, useState } from "react";
import { driverTheme } from "@/components/analytics/theme";

function cellColor(race) {
  if (race.is_dnf) return "rgba(225,6,0,0.85)";
  if (race.is_win) return driverTheme.paleBlue;
  if (race.is_podium) return "#9ecbea";
  if (race.points >= 10) return driverTheme.skyLight;
  if (race.points > 0) return driverTheme.steel;
  return "rgba(193,232,255,0.12)";
}

function cellLabel(race) {
  if (race.is_dnf) return "DNF";
  if (race.is_win) return "WIN";
  if (race.is_podium) return "PODIUM";
  if (race.points > 0) return "POINTS";
  return "NO POINTS";
}

export default function CareerMatrixCard({ careerMatrix }) {
  const [selected, setSelected] = useState(null);

  const summary = useMemo(() => ({
    races: careerMatrix.length,
    wins: careerMatrix.filter((race) => race.is_win).length,
    dnfs: careerMatrix.filter((race) => race.is_dnf).length,
  }), [careerMatrix]);

  return (
    <div
      className="relative overflow-hidden p-8 rounded-[20px]"
      style={{
        backgroundColor: "#052659",
        border: "1px solid rgba(193,232,255,0.16)",
        boxShadow: "0 20px 45px -12px rgba(0, 0, 0, 0.65)",
        minHeight: "32rem",
      }}
    >
      {/* Telemetry micro-grid texture overlay */}
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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px heatmap-scanline z-0" style={{ background: driverTheme.paleBlue }} />

      <div className="relative z-10 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="mb-1 text-[10px] tracking-[0.24em] uppercase" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>RACE-BY-RACE TELEMETRY</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.7rem", color: driverTheme.paleBlue }}>CAREER RESULTS MATRIX</h2>
        </div>
        <div className="flex gap-5 text-right">
          {[['RACES', summary.races], ['WINS', summary.wins], ['DNF', summary.dnfs]].map(([label, value]) => (
            <div key={label}>
              <strong className="block text-xl tabular-nums" style={{ fontFamily: "var(--font-display)", color: driverTheme.paleBlue }}>{value}</strong>
              <span className="text-[9px] tracking-[0.2em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {careerMatrix.length === 0 ? (
        <p className="relative z-10 mt-10" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>No race history available.</p>
      ) : (
        <>
          <div className="relative z-10 mt-8 overflow-hidden rounded-[14px] p-5" style={{ background: "#021024", border: "1px solid rgba(193,232,255,0.14)", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6)" }}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-[10px] tracking-[0.2em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>SEASON / ROUND SEQUENCE</span>
              <span className="hidden text-[10px] tracking-[0.15em] sm:block" style={{ fontFamily: "var(--font-technical)", color: driverTheme.paleBlue }}>P1 ← PERFORMANCE → DNF</span>
            </div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(26px, 1fr))" }}>
              {careerMatrix.map((race, index) => {
                const isSelected = selected === race;
                return (
                  <button key={`${race.year}-${race.round_number}-${index}`} type="button" aria-label={`${race.year} ${race.circuit_name}, ${cellLabel(race)}`} onClick={() => setSelected(isSelected ? null : race)} onMouseEnter={() => setSelected(race)} className="group relative aspect-square rounded-[4px] transition-all duration-200 hover:z-10 hover:scale-150 focus:z-10 focus:scale-150 focus:outline-none" style={{ background: cellColor(race), boxShadow: isSelected ? `0 0 0 2px ${driverTheme.paleBlue}, 0 0 18px ${driverTheme.paleBlue}` : "none" }}>
                    <span className="pointer-events-none absolute inset-0 rounded-[4px] opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "rgba(255,255,255,0.35)" }} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 mt-5 grid grid-cols-2 gap-3 text-[10px] sm:grid-cols-5">
            {[[driverTheme.paleBlue, "WIN"], ["#9ECBEA", "PODIUM"], [driverTheme.skyLight, "POINTS"], [driverTheme.steel, "LOW SCORE"], ["rgba(225,6,0,0.85)", "DNF"]].map(([color, label]) => (
              <div key={label} className="flex items-center gap-2" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}><span className="h-2.5 w-2.5 rounded-[2px]" style={{ background: color }} />{label}</div>
            ))}
          </div>
        </>
      )}

      {selected && (
        <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md px-4 py-3" style={{ background: "#021024", border: "1px solid rgba(193,232,255,0.25)", boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}>
          <div>
            <p className="text-[10px] tracking-[0.18em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.paleBlue }}>{selected.year} / ROUND {selected.round_number}</p>
            <p className="mt-1 text-xs" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>{selected.circuit_name}</p>
          </div>
          <div className="flex gap-4 text-right text-[10px]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.paleBlue }}><span>GRID P{selected.grid ?? "—"}</span><span>FINISH P{selected.position ?? "—"}</span><span>{selected.points} PTS</span></div>
        </div>
      )}
    </div>
  );
}
