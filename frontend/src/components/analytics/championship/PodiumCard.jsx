"use client";

import { driverTheme } from "../theme";
import { getTeamColor } from "@/lib/teamColors";

const RANK_STYLE = {
  1: { accent: "#FFD700", label: "P1", scale: "md:-translate-y-5" },
  2: { accent: "#C7CCD1", label: "P2", scale: "" },
  3: { accent: "#CD7F32", label: "P3", scale: "" },
};

export default function PodiumCard({ entry, rank }) {
  const style = RANK_STYLE[rank];
  const teamColor = getTeamColor(entry.team);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 transition-transform duration-500 ${style.scale}`}
      style={{
        background: `linear-gradient(150deg, ${driverTheme.steel} 0%, ${driverTheme.bgMid} 100%)`,
        border: `1px solid ${style.accent}55`,
        boxShadow: rank === 1 ? `0 0 32px ${style.accent}33` : "none",
      }}
    >
      <div className="absolute left-0 top-0 h-full w-1" style={{ background: teamColor }} />
      <div className="flex items-center justify-between">
        <span className="rounded-full px-3 py-1 text-xs tracking-[0.15em]" style={{ background: `${style.accent}22`, color: style.accent, border: `1px solid ${style.accent}55`, fontFamily: "var(--font-technical)" }}>{style.label}</span>
        <span className="text-[10px] tracking-[0.15em]" style={{ color: driverTheme.skyLight, fontFamily: "var(--font-technical)" }}>{entry.wins} WINS</span>
      </div>
      <h3 className="mt-5" style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: rank === 1 ? "1.9rem" : "1.5rem", color: "#ffffff", lineHeight: 1.1 }}>{entry.name}</h3>
      <p className="mt-2 text-xs tracking-[0.15em]" style={{ color: driverTheme.skyLight, fontFamily: "var(--font-technical)" }}>{entry.team?.toUpperCase()}</p>
      <div className="mt-6 flex items-baseline gap-2">
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2.2rem", color: style.accent }}>{entry.points}</span>
        <span className="text-xs tracking-[0.15em]" style={{ color: driverTheme.skyLight, fontFamily: "var(--font-technical)" }}>PTS</span>
      </div>
    </div>
  );
}