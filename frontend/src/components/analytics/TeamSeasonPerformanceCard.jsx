"use client";

import { useEffect, useState } from "react";
import { getTeamSeasonStats } from "@/lib/api";
import { driverTheme } from "./theme";
import StatGrid from "./driverDetail/StatGrid";

export default function TeamSeasonPerformanceCard({ teamId, availableYears, variant }) {
  const [year, setYear] = useState(availableYears[availableYears.length - 1]);
  const [stats, setStats] = useState(null);
  useEffect(() => { getTeamSeasonStats(teamId, year).then(setStats).catch(() => setStats(null)); }, [teamId, year]);
  const gradient = variant === "A" ? `linear-gradient(120deg, ${driverTheme.bgMid}, ${driverTheme.bgDeep})` : `linear-gradient(120deg, ${driverTheme.steel}, ${driverTheme.bgMid})`;
  const values = stats?.stats;

  return (
    <div className="p-8" style={{ background: gradient, borderRadius: "18px", border: "1px solid rgba(193,232,255,0.14)", minHeight: "20rem" }}>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.6rem", color: driverTheme.paleBlue }}>SEASON PERFORMANCE</h2><select value={year} onChange={(event) => setYear(Number(event.target.value))} className="px-4 py-2 text-sm outline-none" style={{ fontFamily: "var(--font-technical)", background: "rgba(2,16,36,0.55)", color: driverTheme.paleBlue, border: "1px solid rgba(193,232,255,0.25)", borderRadius: "6px" }}>{availableYears.slice().reverse().map((availableYear) => <option key={availableYear} value={availableYear}>{availableYear}</option>)}</select></div>
      {!values ? <p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Loading season data…</p> : <StatGrid stats={[{ label: "RACE ENTRIES", value: values.gp_entries ?? 0 }, { label: "TEAM POINTS", value: values.team_points ?? 0 }, { label: "DRIVER WINS", value: values.wins ?? 0 }, { label: "PODIUMS", value: values.podiums ?? 0 }, { label: "POLES", value: values.poles ?? 0 }, { label: "TOP 10s", value: values.top10s ?? 0 }, { label: "DNFs", value: values.dnfs ?? 0 }]} />}
    </div>
  );
}