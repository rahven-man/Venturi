"use client";

import { useEffect, useRef, useState } from "react";
import { driverTheme } from "../theme";

const TEAM_COLORS = {
  "Red Bull": "#3671C6", "Ferrari": "#E8002D", "Mercedes": "#27F4D2",
  "McLaren": "#FF8000", "Aston Martin": "#229971", "Alpine": "#FF87BC",
  "Williams": "#64C4FF", "Haas": "#B6BABD", "Sauber": "#52E252",
  "RB": "#6692FF", "Racing Bulls": "#6692FF",
  "Lotus": "#FFB800", "Lotus F1": "#FFB800", "Brabham": "#00A651",
  "Tyrrell": "#002D62", "Benetton": "#00A651", "Renault": "#FFCD00",
};

function WinnerRow({ winner, index, isTop }) {
  const rowRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const stripeColor = TEAM_COLORS[winner.team_name] ?? "#5483b3";

  return (
    <div
      ref={rowRef}
      className="flex items-center gap-4 rounded-lg py-3 pr-4 transition-colors duration-200 hover:bg-white/[0.05]"
      style={{
        background: isTop ? "rgba(225,6,0,0.1)" : "rgba(1,8,23,0.35)",
        borderLeft: `3px solid ${stripeColor}`,
        paddingLeft: "1rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 450ms ease-out ${index * 60}ms, transform 450ms ease-out ${index * 60}ms, background-color 200ms`,
      }}
    >
      <span className="w-14 text-sm" style={{ fontFamily: "var(--font-technical)", color: isTop ? "#ff6b61" : driverTheme.skyLight }}>{winner.year}</span>
      <span className="flex-1 text-sm" style={{ fontFamily: "var(--font-body)", color: driverTheme.paleBlue }}>{winner.driver_name}</span>
      <span className="text-xs tracking-[0.1em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>{winner.team_name?.toUpperCase()}</span>
    </div>
  );
}

export default function WinnersCard({ winners }) {
  return (
    <div className="rounded-2xl p-8 md:p-10" style={{ background: `linear-gradient(135deg, ${driverTheme.bgMid} 0%, ${driverTheme.bgDeep} 100%)`, border: "1px solid rgba(193,232,255,0.12)" }}>
      <p className="mb-6 text-[10px] tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: "#e10600" }}>RECENT WINNERS</p>
      {winners.length === 0 ? (
        <p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>No winner history available.</p>
      ) : (
        <div className="space-y-2">
          {winners.map((w, i) => <WinnerRow key={`${w.year}-${w.driver_name}`} winner={w} index={i} isTop={i === 0} />)}
        </div>
      )}
    </div>
  );
}