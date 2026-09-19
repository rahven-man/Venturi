"use client";

import { useEffect, useRef, useState } from "react";
import TextScramble from "@/components/shared/TextScramble";
import { driverTheme } from "../theme";

export default function LapRecordCard({ lapRecord }) {
  const wrapperRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!lapRecord) {
    return (
      <div className="flex items-center justify-center rounded-2xl p-8" style={{ background: `linear-gradient(135deg, ${driverTheme.steel} 0%, ${driverTheme.bgMid} 100%)`, border: "1px solid rgba(193,232,255,0.12)", minHeight: "16rem" }}>
        <p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>No lap record data available.</p>
      </div>
    );
  }

  const minutes = Math.floor(lapRecord.lap_seconds / 60);
  const remainder = (lapRecord.lap_seconds % 60).toFixed(3).padStart(6, "0");
  const timeText = `${minutes}:${remainder}`;

  return (
    <div ref={wrapperRef} className="relative overflow-hidden rounded-2xl p-8 md:p-12" style={{ background: `linear-gradient(135deg, ${driverTheme.steel} 0%, ${driverTheme.bgMid} 100%)`, border: "1px solid rgba(225,6,0,0.5)" }}>
      <p className="text-[10px] tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: "#ff6b61" }}>ALL-TIME LAP RECORD</p>
      {inView ? (
        <TextScramble key={timeText} text={timeText} trigger="mount" charset="binary" speed={26} spread={24} className="mt-4 block text-6xl md:text-8xl" style={{ color: "#ffffff", fontFamily: "var(--font-display)" }} />
      ) : (
        <span className="mt-4 block text-6xl md:text-8xl" style={{ color: "#ffffff", fontFamily: "var(--font-display)" }}>0:00.000</span>
      )}
      <div className="mt-8 flex flex-wrap gap-8 text-sm">
        <div><span className="block text-[10px] tracking-[0.15em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>DRIVER</span><strong style={{ fontFamily: "var(--font-body)", color: driverTheme.paleBlue }}>{lapRecord.driver_name}</strong></div>
        <div><span className="block text-[10px] tracking-[0.15em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>TEAM</span><strong style={{ fontFamily: "var(--font-body)", color: driverTheme.paleBlue }}>{lapRecord.team_name}</strong></div>
        <div><span className="block text-[10px] tracking-[0.15em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>SEASON</span><strong style={{ fontFamily: "var(--font-body)", color: driverTheme.paleBlue }}>{lapRecord.year}</strong></div>
      </div>
    </div>
  );
}