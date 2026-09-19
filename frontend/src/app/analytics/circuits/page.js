"use client";

import useCircuits from "@/hooks/useCircuits";
import CircuitDirectory from "@/components/analytics/circuits/CircuitDirectory";
import CircuitSearch from "@/components/analytics/circuits/CircuitSearch";
import AnalyticsNav from "@/components/analytics/AnalyticsNav";
import { driverTheme } from "@/components/analytics/theme";

export default function CircuitsPage() {
  const { circuits, loading, error } = useCircuits();
  return (
    <main style={{ background: `linear-gradient(160deg, ${driverTheme.bgDeep} 0%, ${driverTheme.bgMid} 55%, ${driverTheme.bgDeep} 100%)`, minHeight: "100vh" }}>
      <AnalyticsNav active="circuits" />
      <div className="px-8 md:px-14 pt-16 pb-10">
        <div className="mb-4 flex items-center gap-3 text-xs tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>
          <span style={{ color: "#e10600" }}>ANALYTICS</span><span>—</span><span>CIRCUIT DIRECTORY</span>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 0.95, color: driverTheme.paleBlue }}>EVERY TRACK.<br />EVERY LEGEND.</h1>
          <div className="w-full lg:w-80"><CircuitSearch circuits={circuits} /></div>
        </div>
      </div>
      <CircuitDirectory circuits={circuits} loading={loading} error={error} />
    </main>
  );
}