"use client";

import Link from "next/link";
import { driverTheme } from "../theme";
import { CIRCUIT_META } from "@/lib/circuitData";

const VARIANTS = {
  A: `linear-gradient(135deg, ${driverTheme.bgMid} 0%, ${driverTheme.bgDeep} 100%)`,
  B: `linear-gradient(135deg, ${driverTheme.steel} 0%, ${driverTheme.bgMid} 100%)`,
};

export default function CircuitCard({ circuit, colorVariant }) {
  const meta = CIRCUIT_META[circuit.circuit_id] ?? {};
  return (
    <Link href={`/analytics/circuits/${circuit.circuit_id}`} className="group relative flex overflow-hidden" style={{ background: VARIANTS[colorVariant], borderRadius: "18px", minHeight: "22rem", border: "1px solid rgba(193,232,255,0.1)" }}>
      <div className="relative z-10 flex flex-col justify-center p-7" style={{ width: "55%" }}>
        {meta.slogan && <p className="mb-5" style={{ fontFamily: "var(--font-script)", fontSize: "clamp(1.7rem, 2.6vw, 2.6rem)", lineHeight: 0.95, color: driverTheme.paleBlue, opacity: 0.92 }}>{meta.slogan}</p>}
        <h3 className="transition-transform duration-300 group-hover:-translate-y-1" style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "clamp(1.4rem, 2vw, 1.9rem)", lineHeight: 1.15, color: driverTheme.paleBlue }}>{circuit.name}</h3>
        <p className="mt-2 text-xs tracking-[0.15em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>{circuit.locality?.toUpperCase()}, {circuit.country?.toUpperCase()}</p>
        {(meta.lengthKm || meta.corners) && (
          <div className="mt-5 flex gap-3 text-xs" style={{ fontFamily: "var(--font-technical)" }}>
            {meta.lengthKm && <span className="rounded-full px-3 py-1" style={{ border: "1px solid rgba(193,232,255,0.25)", color: driverTheme.skyLight }}>{meta.lengthKm} KM</span>}
            {meta.corners && <span className="rounded-full px-3 py-1" style={{ border: "1px solid rgba(193,232,255,0.25)", color: driverTheme.skyLight }}>{meta.corners} TURNS</span>}
          </div>
        )}
      </div>
      <div className="absolute top-0 right-0 flex h-full items-center justify-center p-6" style={{ width: "45%" }}>
        {meta.slug && (
          <img
            src={`/circuits/white-outline/${meta.slug}.svg`}
            alt={circuit.name}
            className="transition-transform duration-500 ease-out group-hover:scale-110"
            style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 0 6px rgba(193,232,255,0.15))" }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "drop-shadow(0 0 20px rgba(225,6,0,0.55))")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "drop-shadow(0 0 6px rgba(193,232,255,0.15))")}
          />
        )}
      </div>
    </Link>
  );
}