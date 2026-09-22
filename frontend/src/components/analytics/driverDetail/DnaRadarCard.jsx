"use client";

import { useState } from "react";
import { driverTheme } from "@/components/analytics/theme";

const TRAITS = [
  { key: "qualifying_pole_rate", label: "QUALIFYING", short: "QUAL", desc: "Pole positions per race entered." },
  { key: "race_pace_win_rate", label: "RACE PACE", short: "PACE", desc: "Wins converted per race started." },
  { key: "consistency_points_rate", label: "CONSISTENCY", short: "CONS", desc: "Points-scoring rate against the maximum available." },
  { key: "reliability_finish_rate", label: "RELIABILITY", short: "RELY", desc: "Share of races finished without a DNF." },
  { key: "racecraft_positions_gained", label: "RACECRAFT", short: "CRAFT", desc: "Average positions gained from grid to finish." },
  { key: "clutch_win_conversion", label: "CLUTCH FACTOR", short: "CLUTCH", desc: "Wins converted from pole positions." },
];

const CENTER = 250;
const RADIUS = 158;
const RADAR_RED = "#e10600";
const RADAR_ORANGE = "#ff5a36";
const RADAR_INK = "#010817";
const RADAR_BLUE = "#5483b3";

function pointFor(index, radius) {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / TRAITS.length;
  return [CENTER + Math.cos(angle) * radius, CENTER + Math.sin(angle) * radius];
}

function pointsFor(values, radius = RADIUS) {
  return values
    .map((value, index) => pointFor(index, radius * value))
    .map((point) => point.join(","))
    .join(" ");
}

export default function DnaRadarCard({ radar }) {
  const [focused, setFocused] = useState(null);
  const values = radar?.radar
    ? TRAITS.map((trait) => Math.round(radar.radar[trait.key] * 100))
    : null;

  return (
    <div
      className="relative overflow-hidden p-8 rounded-[20px]"
      style={{
        backgroundColor: "#052659",
        borderRadius: "20px",
        border: "1px solid rgba(193,232,255,0.16)",
        boxShadow: "0 20px 45px -12px rgba(0, 0, 0, 0.65)",
        minHeight: "34rem",
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
      <div className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(circle at 66% 48%, rgba(225,6,0,0.14), transparent 32%)" }} />

      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: RADAR_ORANGE }}>PERFORMANCE VECTOR / 06 AXES</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.8rem", color: "#ffffff" }}>DRIVER DNA</h2>
        </div>
        <div className="rounded-full px-3 py-1 text-[10px] tracking-[0.2em]" style={{ fontFamily: "var(--font-technical)", color: RADAR_ORANGE, border: `1px solid ${RADAR_RED}99`, background: "#021024" }}>
          {radar?.year?.toString().toUpperCase() ?? "CAREER"}
        </div>
      </div>

      {!values ? (
        <p className="relative z-10 mt-10" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>No career race data available for this driver.</p>
      ) : (
        <div className="relative z-10 mt-5 grid items-center gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(15rem,1fr)]">
          <div className="relative mx-auto w-full max-w-[36rem] rounded-2xl p-2" style={{ background: "#021024", border: `1px solid ${RADAR_BLUE}66`, boxShadow: `inset 0 0 36px ${RADAR_INK}, 0 0 25px ${RADAR_RED}18` }}>
            <svg viewBox="0 0 500 460" className="w-full" role="img" aria-label="Interactive driver DNA radar chart">
              <defs>
                <linearGradient id="dna-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={RADAR_ORANGE} stopOpacity="0.88" />
                  <stop offset="55%" stopColor={RADAR_RED} stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#7b0010" stopOpacity="0.18" />
                </linearGradient>
                <filter id="dna-glow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <linearGradient id="dna-scan" x1="0" y1="0" x2="1" y2="0"><stop stopColor="transparent" /><stop offset="0.5" stopColor={RADAR_ORANGE} /><stop offset="1" stopColor="transparent" /></linearGradient>
              </defs>
              <circle cx={CENTER} cy={CENTER} r={RADIUS + 13} fill="none" stroke={RADAR_RED} strokeOpacity="0.22" strokeDasharray="2 12" strokeWidth="2" className="dna-radar-orbit" />
              {[0.25, 0.5, 0.75, 1].map((level) => (
                <polygon key={level} points={pointsFor(TRAITS.map(() => 1), RADIUS * level)} fill={level === 1 ? "rgba(84,131,179,0.06)" : "none"} stroke={level === 1 ? `${RADAR_BLUE}99` : `${RADAR_BLUE}55`} strokeWidth={level === 1 ? "1.5" : "1"} />
              ))}
              {TRAITS.map((trait, index) => {
                const [x, y] = pointFor(index, RADIUS);
                return <line key={trait.key} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke={`${RADAR_BLUE}88`} strokeDasharray="2 7" />;
              })}
              <polygon points={pointsFor(values.map((value) => value / 100), RADIUS)} fill="url(#dna-fill)" stroke={RADAR_ORANGE} strokeWidth="4" filter="url(#dna-glow)" className="dna-radar-shape" />
              <path d={`M ${CENTER - RADIUS} ${CENTER} L ${CENTER + RADIUS} ${CENTER}`} stroke="url(#dna-scan)" strokeWidth="2" className="dna-radar-scan" />
              {TRAITS.map((trait, index) => {
                const [x, y] = pointFor(index, RADIUS);
                const active = focused === index;
                return (
                  <g key={trait.key} onMouseEnter={() => setFocused(index)} onMouseLeave={() => setFocused(null)} onFocus={() => setFocused(index)} tabIndex={0} className="cursor-crosshair">
                    <circle cx={x} cy={y} r={active ? 12 : 8} fill={active ? "#ffffff" : RADAR_RED} stroke={active ? RADAR_ORANGE : RADAR_INK} strokeWidth="3" className="transition-all duration-300" />
                    <text x={x} y={y < CENTER ? y - 18 : y + 27} textAnchor="middle" fill={active ? "#ffffff" : RADAR_ORANGE} fontSize="10" fontFamily="var(--font-technical)" letterSpacing="1.5">{trait.short}</text>
                    <title>{trait.label}: {values[index]}%</title>
                  </g>
                );
              })}
            </svg>
            <div className="border-t px-4 pb-3 pt-3 text-center" style={{ borderColor: `${RADAR_RED}66` }}>
              <strong className="block text-2xl" style={{ fontFamily: "var(--font-display)", color: RADAR_RED }}>
                {focused === null ? "DRIVER DNA" : `${values[focused]}%`}
              </strong>
              <span className="text-[10px] tracking-[0.24em]" style={{ fontFamily: "var(--font-technical)", color: RADAR_RED }}>
                {focused === null ? "CAREER PROFILE" : TRAITS[focused].label}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {TRAITS.map((trait, index) => (
              <button key={trait.key} type="button" onMouseEnter={() => setFocused(index)} onMouseLeave={() => setFocused(null)} onFocus={() => setFocused(index)} className={`group relative overflow-hidden text-left ${focused === index ? "dna-detail-active" : ""}`} style={{ borderLeft: `3px solid ${focused === index ? RADAR_RED : `${RADAR_BLUE}66`}`, padding: "0.7rem 0.8rem" }}>
                <span className="dna-detail-fill" aria-hidden />
                <div className="relative z-10 flex items-baseline justify-between gap-3">
                  <span className="text-sm tracking-[0.18em]" style={{ fontFamily: "var(--font-technical)", color: focused === index ? "#ffffff" : RADAR_ORANGE }}>{trait.label}</span>
                  <strong className="text-2xl tabular-nums" style={{ fontFamily: "var(--font-display)", color: focused === index ? "#ffffff" : RADAR_ORANGE }}>{values[index]}%</strong>
                </div>
                <span className="relative z-10 mt-1 block text-xs leading-relaxed" style={{ fontFamily: "var(--font-body)", color: focused === index ? "#ffffff" : driverTheme.skyLight }}>{focused === index ? trait.desc : "Hover to inspect signal"}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
