"use client";

import { useState, useRef, useEffect } from "react";
import { driverTheme } from "@/components/analytics/theme";

function cellColor(race) {
  if (race.is_dnf) return "rgba(225,6,0,0.65)";
  if (race.points >= 18) return driverTheme.paleBlue;
  if (race.points >= 10) return "#9ECBEA";
  if (race.points >= 4) return driverTheme.skyLight;
  if (race.points > 0) return driverTheme.steel;
  return "rgba(193,232,255,0.1)";
}

export default function CareerMatrixCard({ careerMatrix, variant }) {
  const [hovered, setHovered] = useState(null);
  const gridRef = useRef(null);

  const gradient =
    variant === "A"
      ? `linear-gradient(120deg, ${driverTheme.bgMid} 0%, ${driverTheme.bgDeep} 100%)`
      : `linear-gradient(120deg, ${driverTheme.steel} 0%, ${driverTheme.bgMid} 100%)`;

  useEffect(() => {
    const el = gridRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.opacity = "0";
    el.style.transform = "scale(0.97)";
    el.style.transition = "opacity 700ms ease, transform 700ms ease";

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "scale(1)";
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="relative p-8"
      style={{ background: gradient, borderRadius: "18px", border: "1px solid rgba(193,232,255,0.1)" }}
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.6rem", color: driverTheme.paleBlue }}>
          CAREER RESULTS MATRIX
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { color: driverTheme.paleBlue, label: "18+ PTS" },
            { color: "#9ECBEA", label: "10-17 PTS" },
            { color: driverTheme.skyLight, label: "4-9 PTS" },
            { color: driverTheme.steel, label: "1-3 PTS" },
            { color: "rgba(193,232,255,0.1)", label: "NO POINTS" },
            { color: "rgba(225,6,0,0.65)", label: "DNF" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: item.color }} />
              <span className="text-[10px] tracking-[0.1em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {careerMatrix.length === 0 ? (
        <p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>No race history available.</p>
      ) : (
        <div
          ref={gridRef}
          className="grid gap-[4px]"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(22px, 1fr))" }}
        >
          {careerMatrix.map((race, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(race)}
              onMouseLeave={() => setHovered(null)}
              className="aspect-square rounded-[3px] cursor-pointer transition-transform duration-150 hover:scale-125"
              style={{ background: cellColor(race) }}
            />
          ))}
        </div>
      )}

      {hovered && (
        <div
          className="absolute bottom-4 left-8 px-4 py-2 text-xs pointer-events-none"
          style={{
            fontFamily: "var(--font-technical)",
            background: "rgba(2,16,36,0.92)",
            border: "1px solid rgba(193,232,255,0.25)",
            borderRadius: "6px",
            color: driverTheme.paleBlue,
          }}
        >
          {hovered.year} · {hovered.circuit_name} · P{hovered.position ?? "DNF"} · {hovered.points} PTS
        </div>
      )}
    </div>
  );
}