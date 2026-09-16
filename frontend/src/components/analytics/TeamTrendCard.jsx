"use client";

import { useMemo, useState } from "react";
import { driverTheme } from "./theme";

const MODES = [
  { key: "points", label: "POINTS" },
  { key: "wins", label: "WINS" },
  { key: "podiums", label: "PODIUMS" },
];

const SIGNAL_RED = "#e10600";
const SIGNAL_LIGHT = "#ff6b61";

export default function TeamTrendCard({ seasonTrend, variant }) {
  const [mode, setMode] = useState("points");
  const [selected, setSelected] = useState(null);
  const activeMode = MODES.find((item) => item.key === mode);
  const data = useMemo(() => seasonTrend.filter((item) => item.year && item[mode] !== null).slice(-16), [seasonTrend, mode]);
  const max = Math.max(...data.map((item) => Number(item[mode]) || 0), 1);
  const width = 900;
  const height = 360;
  const pad = { top: 28, right: 30, bottom: 50, left: 72 };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;
  const points = data.map((item, index) => ({
    ...item,
    x: pad.left + (index / Math.max(data.length - 1, 1)) * chartWidth,
    y: height - pad.bottom - ((Number(item[mode]) || 0) / max) * chartHeight,
  }));
  const path = points.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
  const area = points.length ? `${path} L ${points.at(-1).x},${height - pad.bottom} L ${points[0].x},${height - pad.bottom} Z` : "";
  const selectedPoint = selected ? points.find((point) => point.year === selected.year) : null;

  return (
    <div className="relative overflow-hidden p-8" style={{ background: variant === "A" ? `linear-gradient(120deg, ${driverTheme.bgMid}, ${driverTheme.bgDeep})` : `linear-gradient(120deg, ${driverTheme.steel}, ${driverTheme.bgMid})`, borderRadius: "18px", border: "1px solid rgba(193,232,255,0.16)" }}>
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-5">
        <div><p className="mb-2 text-[10px] tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: SIGNAL_LIGHT }}>CONSTRUCTOR TRAJECTORY / {activeMode.label}</p><h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.7rem", color: driverTheme.paleBlue }}>SEASON MOMENTUM</h2></div>
        <div className="flex gap-2">{MODES.map((item) => <button key={item.key} type="button" onClick={() => { setMode(item.key); setSelected(null); }} className="px-3 py-2 text-[10px] tracking-[0.16em] transition-colors" style={{ fontFamily: "var(--font-technical)", color: mode === item.key ? "#ffffff" : driverTheme.paleBlue, background: mode === item.key ? SIGNAL_RED : "rgba(2,16,36,0.35)", border: `1px solid ${mode === item.key ? SIGNAL_LIGHT : "rgba(193,232,255,0.28)"}`, borderRadius: "4px" }}>{item.label}</button>)}</div>
      </div>
      {data.length < 2 ? <p className="mt-8" style={{ color: driverTheme.skyLight }}>Not enough season data for a trend.</p> : <>
        <div className="relative mt-8 overflow-hidden rounded-xl p-3" style={{ background: "rgba(1,8,23,0.48)", border: "1px solid rgba(193,232,255,0.16)" }}>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={`Team season ${activeMode.label.toLowerCase()} trend`}>
            <defs><linearGradient id="team-trend-area" x1="0" y1="0" x2="0" y2="1"><stop stopColor={SIGNAL_RED} stopOpacity="0.38" /><stop offset="1" stopColor={SIGNAL_RED} stopOpacity="0" /></linearGradient></defs>
            <text x="18" y={height / 2} transform={`rotate(-90 18 ${height / 2})`} textAnchor="middle" fill={driverTheme.skyLight} fontSize="11" fontFamily="var(--font-technical)" letterSpacing="2">{activeMode.label}</text>
            {[0, 0.25, 0.5, 0.75, 1].map((level) => { const y = height - pad.bottom - level * chartHeight; return <g key={level}><line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="rgba(193,232,255,0.14)" strokeDasharray="4 8" /><text x={pad.left - 12} y={y + 4} textAnchor="end" fill={driverTheme.skyLight} fontSize="10" fontFamily="var(--font-technical)">{Math.round(max * level)}</text></g>; })}
            <line x1={pad.left} x2={pad.left} y1={pad.top} y2={height - pad.bottom} stroke="rgba(193,232,255,0.45)" /><line x1={pad.left} x2={width - pad.right} y1={height - pad.bottom} y2={height - pad.bottom} stroke="rgba(193,232,255,0.45)" />
            <path d={area} fill="url(#team-trend-area)" /><path d={path} fill="none" stroke={SIGNAL_RED} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {selectedPoint && <line x1={selectedPoint.x} x2={selectedPoint.x} y1={pad.top} y2={height - pad.bottom} stroke={SIGNAL_LIGHT} strokeDasharray="3 5" />}
            {points.map((point) => <g key={point.year} onMouseEnter={() => setSelected(point)} onFocus={() => setSelected(point)} tabIndex={0} className="cursor-crosshair"><circle cx={point.x} cy={point.y} r={selected?.year === point.year ? 10 : 6} fill={selected?.year === point.year ? "#ffffff" : SIGNAL_RED} stroke={SIGNAL_LIGHT} strokeWidth="2" /><text x={point.x} y={height - 14} textAnchor="middle" fill={driverTheme.skyLight} fontSize="11" fontFamily="var(--font-technical)">{point.year}</text><title>{point.year}: {point[mode]}</title></g>)}
          </svg>
        </div>
        <div className="mt-4 min-h-12 rounded-md px-4 py-3" style={{ background: "rgba(2,16,36,0.48)", borderLeft: `3px solid ${SIGNAL_RED}` }}>
          {selected ? <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs" style={{ fontFamily: "var(--font-technical)", color: driverTheme.paleBlue }}><span>{selected.year} SEASON</span><span>{selected[mode]} {activeMode.label}</span><span>{selected.races} RACE ENTRIES</span><span>{selected.wins} WINS</span><span>{selected.podiums} PODIUMS</span></div> : <span className="text-xs tracking-[0.16em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>HOVER A SEASON POINT TO INSPECT THE SIGNAL</span>}
        </div>
      </>}
    </div>
  );
}
