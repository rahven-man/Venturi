"use client";

import { driverTheme } from "../theme";
import { CIRCUIT_META } from "@/lib/circuitData";

export default function CircuitHeroCard({ profile }) {
  const meta = CIRCUIT_META[profile.circuit_id] ?? {};
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl md:flex-row" style={{ background: `linear-gradient(135deg, ${driverTheme.bgMid} 0%, ${driverTheme.bgDeep} 100%)`, border: "1px solid rgba(193,232,255,0.12)", minHeight: "28rem" }}>
      <div className="relative z-10 flex flex-col justify-center p-8 md:p-12" style={{ width: "100%", maxWidth: "34rem" }}>
        {meta.slogan && <p className="mb-4" style={{ fontFamily: "var(--font-script)", fontSize: "clamp(2rem, 3.4vw, 3.2rem)", color: driverTheme.paleBlue, opacity: 0.92 }}>{meta.slogan}</p>}
        <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "clamp(2rem, 3.4vw, 3.2rem)", lineHeight: 1.05, color: "#ffffff" }}>{profile.name}</h1>
        <div className="mt-4 h-px w-16" style={{ background: "#e10600" }} />
        <p className="mt-5 text-sm tracking-[0.2em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>{profile.locality?.toUpperCase()} · {profile.country?.toUpperCase()}</p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["LENGTH", meta.lengthKm ? `${meta.lengthKm} KM` : "—"], ["TURNS", meta.corners ?? "—"], ["FIRST HOSTED", profile.first_hosted_year ?? "—"], ["RACES HOSTED", profile.total_races_hosted ?? "—"]].map(([label, value]) => (
            <div key={label} className="rounded-lg p-3" style={{ background: "rgba(1,8,23,0.4)", border: "1px solid rgba(193,232,255,0.14)" }}>
              <span className="block text-[10px] tracking-[0.15em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>{label}</span>
              <strong style={{ fontFamily: "var(--font-body)", color: driverTheme.paleBlue }}>{value}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex items-center justify-center p-8" style={{ width: "100%", flex: 1 }}>
        {meta.slug && <img src={`/circuits/white-outline/${meta.slug}.svg`} alt={profile.name} className="transition-transform duration-700 ease-out hover:scale-105" style={{ width: "100%", maxWidth: "26rem", filter: "drop-shadow(0 0 24px rgba(225,6,0,0.25))" }} />}
      </div>
    </div>
  );
}