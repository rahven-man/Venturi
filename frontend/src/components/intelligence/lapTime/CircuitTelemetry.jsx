"use client";

const TRACK_POINTS = "M70 210 C110 55 270 42 325 105 C375 162 305 188 356 235 C405 282 510 244 514 145 C518 55 642 42 710 105 C776 171 730 252 640 252 C557 252 540 318 600 350 C665 385 780 342 848 250";

export default function CircuitTelemetry({ eventName }) {
  const label = eventName?.replaceAll("_", " ") || "CIRCUIT TRACE";
  return (
    <div className="relative overflow-hidden rounded-2xl p-5" style={{ background: "linear-gradient(145deg, #010817, #052659)", border: "1px solid rgba(193,232,255,0.2)" }}>
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div><p className="text-[10px] tracking-[0.3em]" style={{ color: "#e10600", fontFamily: "var(--font-technical)" }}>TRACK TELEMETRY</p><h3 className="mt-1 text-sm uppercase" style={{ color: "#c1e8ff", fontFamily: "var(--font-technical)" }}>{label}</h3></div>
        <span className="rounded-full border px-2 py-1 text-[9px] tracking-[0.16em]" style={{ color: "#7da0ca", borderColor: "rgba(193,232,255,0.25)", fontFamily: "var(--font-technical)" }}>SCHEMATIC</span>
      </div>
      <svg viewBox="0 0 920 430" className="mt-4 w-full" role="img" aria-label="Decorative circuit telemetry schematic">
        <defs><linearGradient id="track-line" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#e10600" /><stop offset="0.5" stopColor="#ff6b61" /><stop offset="1" stopColor="#e10600" /></linearGradient></defs>
        <path d={TRACK_POINTS} fill="none" stroke="rgba(125,160,202,0.2)" strokeWidth="22" strokeLinecap="round" />
        <path d={TRACK_POINTS} fill="none" stroke="url(#track-line)" strokeWidth="4" strokeDasharray="16 12" strokeLinecap="round" className="lap-track-flow" />
        <circle cx="70" cy="210" r="9" fill="#c1e8ff" stroke="#e10600" strokeWidth="4" />
        <text x="70" y="186" textAnchor="middle" fill="#c1e8ff" fontSize="12" fontFamily="var(--font-technical)" letterSpacing="2">START</text>
        <g fill="#7da0ca" fontSize="11" fontFamily="var(--font-technical)" letterSpacing="2"><text x="285" y="72">SECTOR 01</text><text x="515" y="405">SECTOR 02</text><text x="770" y="92">SECTOR 03</text></g>
      </svg>
    </div>
  );
}
