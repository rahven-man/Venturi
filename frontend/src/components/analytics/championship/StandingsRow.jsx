"use client";

import { useEffect, useRef, useState } from "react";
import { driverTheme } from "../theme";
import { getTeamColor } from "@/lib/teamColors";

export default function StandingsRow({ entry, index }) {
  const rowRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const teamColor = getTeamColor(entry.team);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setVisible(true); io.disconnect(); } },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className="flex items-center gap-4 rounded-lg py-3 pr-4 transition-colors duration-200 hover:bg-white/[0.05]"
      style={{
        background: "rgba(1,8,23,0.35)",
        borderLeft: `3px solid ${teamColor}`,
        paddingLeft: "1rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 450ms ease-out ${Math.min(index, 20) * 60}ms, transform 450ms ease-out ${Math.min(index, 20) * 60}ms, background-color 200ms`,
      }}
    >
      <span className="w-8 text-sm" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>{entry.position}</span>
      <span className="flex-1 text-sm" style={{ fontFamily: "var(--font-body)", color: driverTheme.paleBlue }}>{entry.name}</span>
      <span className="hidden text-xs tracking-[0.1em] sm:block" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>{entry.team?.toUpperCase()}</span>
      <span className="w-14 text-right text-xs" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>{entry.wins}W</span>
      <span className="w-16 text-right text-sm" style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: driverTheme.paleBlue }}>{entry.points}</span>
    </div>
  );
}