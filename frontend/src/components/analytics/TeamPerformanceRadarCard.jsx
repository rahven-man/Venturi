"use client";

import { useMemo, useState } from "react";
import { driverTheme } from "./theme";

const AXES = [
  ["POINTS", "Career points efficiency."],
  ["WINS", "Race wins relative to team entries."],
  ["PODIUMS", "Podium conversion across the career."],
  ["RELIABILITY", "Races completed without a DNF."],
  ["CONSISTENCY", "Sustained points output over seasons."],
  ["TITLES", "Constructor championship success."],
];
const CENTER = 220;
const RADIUS = 145;
const RED = "#e10600";
const LIGHT_RED = "#ff6b61";

function point(index, radius) {
  const angle = -Math.PI / 2 + index * (Math.PI * 2) / AXES.length;
  return [CENTER + Math.cos(angle) * radius, CENTER + Math.sin(angle) * radius];
}

function polygon(values, radius = RADIUS) {
  return values.map((value, index) => point(index, value * radius).join(",")).join(" ");
}

export default function TeamPerformanceRadarCard({ seasonTrend, careerStats, variant }) {
  const [focused, setFocused] = useState(null);
  const values = useMemo(() => {
    const maxPoints = Math.max(...seasonTrend.map((item) => Number(item.points) || 0), 1);
    const entries = Number(careerStats?.gp_entered) || 1;
    const points = Number(careerStats?.career_points) || 0;
    return [
      Math.min(points / Math.max(entries * 26, 1), 1),
      Math.min((Number(careerStats?.highest_finish) === 1 ? 1 : 0.25) + (Number(careerStats?.podiums) || 0) / entries, 1),
      Math.min((Number(careerStats?.podiums) || 0) / entries, 1),
      Math.max(0, 1 - (Number(careerStats?.dnfs) || 0) / entries),
      Math.min(points / Math.max(maxPoints * Math.max(seasonTrend.length, 1), 1), 1),
      Math.min((Number(careerStats?.world_championships) || 0) / 10, 1),
    ];
  }, [careerStats, seasonTrend]);
  const gradient = variant === "A" ? `linear-gradient(120deg, ${driverTheme.bgMid}, ${driverTheme.bgDeep})` : `linear-gradient(120deg, ${driverTheme.steel}, ${driverTheme.bgMid})`;

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
      <div className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(circle at 66% 48%, rgba(225,6,0,0.14), transparent 32%)" }} />

      <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] tracking-[0.24em] uppercase" style={{ fontFamily: "var(--font-technical)", color: LIGHT_RED }}>DERIVED CONSTRUCTOR MODEL / NORMALISED 0—100</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.7rem", color: driverTheme.paleBlue }}>TEAM PERFORMANCE VECTOR</h2>
        </div>
        <span className="rounded-full px-3 py-1 text-[10px] tracking-[0.15em]" style={{ fontFamily: "var(--font-technical)", color: LIGHT_RED, border: `1px solid ${RED}99`, background: "#021024" }}>CAREER SIGNAL</span>
      </div>

      <div className="relative z-10 mt-6 grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(15rem,1fr)]">
        <div className="rounded-2xl p-3" style={{ background: "#021024", border: "1px solid rgba(84,131,179,0.5)", boxShadow: `inset 0 0 36px #010817, 0 0 24px ${RED}16` }}>
          <svg viewBox="0 0 440 440" className="mx-auto w-full max-w-[34rem]" role="img" aria-label="Interactive derived team performance radar"><defs><linearGradient id="team-vector-fill" x1="0" y1="0" x2="1" y2="1"><stop stopColor={LIGHT_RED} stopOpacity="0.8" /><stop offset="1" stopColor={RED} stopOpacity="0.2" /></linearGradient></defs>{[0.25, 0.5, 0.75, 1].map((level) => <polygon key={level} points={polygon(AXES.map(() => 1), RADIUS * level)} fill={level === 1 ? "rgba(84,131,179,0.07)" : "none"} stroke="rgba(125,160,202,0.34)" />)}{AXES.map(([label], index) => { const [x, y] = point(index, RADIUS); return <line key={label} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="rgba(125,160,202,0.45)" strokeDasharray="3 6" />; })}<polygon points={polygon(values)} fill="url(#team-vector-fill)" stroke={LIGHT_RED} strokeWidth="4" className="dna-radar-shape" />{values.map((value, index) => { const [x, y] = point(index, value * RADIUS); const active = focused === index; return <g key={AXES[index][0]} onMouseEnter={() => setFocused(index)} onMouseLeave={() => setFocused(null)} onFocus={() => setFocused(index)} tabIndex={0} className="cursor-crosshair"><circle cx={x} cy={y} r={active ? 12 : 8} fill={active ? "#ffffff" : RED} stroke={active ? LIGHT_RED : "#010817"} strokeWidth="3" /><title>{AXES[index][0]}: {Math.round(value * 100)}%</title></g>; })}{AXES.map(([label], index) => { const [x, y] = point(index, RADIUS); return <text key={label} x={x} y={y < CENTER ? y - 14 : y + 23} textAnchor="middle" fill={focused === index ? "#ffffff" : driverTheme.paleBlue} fontSize="10" fontFamily="var(--font-technical)" letterSpacing="1">{label}</text>; })}</svg>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">{AXES.map(([label, description], index) => { const active = focused === index; return <button key={label} type="button" onMouseEnter={() => setFocused(index)} onMouseLeave={() => setFocused(null)} onFocus={() => setFocused(index)} className={`relative overflow-hidden text-left ${active ? "dna-detail-active" : ""}`} style={{ borderLeft: `3px solid ${active ? RED : "rgba(84,131,179,0.55)"}`, padding: "0.7rem 0.8rem" }}><span className="dna-detail-fill" aria-hidden /><span className="relative z-10 flex items-baseline justify-between gap-3"><span className="text-sm tracking-[0.16em]" style={{ fontFamily: "var(--font-technical)", color: active ? "#ffffff" : LIGHT_RED }}>{label}</span><strong className="text-2xl tabular-nums" style={{ fontFamily: "var(--font-display)", color: active ? "#ffffff" : LIGHT_RED }}>{Math.round(values[index] * 100)}%</strong></span><span className="relative z-10 mt-1 block text-xs leading-relaxed" style={{ fontFamily: "var(--font-body)", color: active ? "#ffffff" : driverTheme.skyLight }}>{active ? description : "Hover to inspect signal"}</span></button>; })}</div>
      </div>
    </div>
  );
}
