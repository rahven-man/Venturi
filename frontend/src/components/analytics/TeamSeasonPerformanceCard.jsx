"use client";

import { useEffect, useState } from "react";
import { getTeamSeasonStats } from "@/lib/api";
import { driverTheme } from "./theme";
import StatGrid from "./driverDetail/StatGrid";

export default function TeamSeasonPerformanceCard({ teamId, availableYears }) {
  const [year, setYear] = useState(availableYears[availableYears.length - 1]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getTeamSeasonStats(teamId, year).then(setStats).catch(() => setStats(null));
  }, [teamId, year]);

  const values = stats?.stats;

  return (
    <div
      className="relative overflow-hidden p-8 rounded-[20px]"
      style={{
        backgroundColor: "#052659",
        border: "1px solid rgba(193,232,255,0.16)",
        boxShadow: "0 20px 45px -12px rgba(0, 0, 0, 0.65)",
        minHeight: "20rem",
      }}
    >
      {/* Telemetry micro-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(193,232,255,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(193,232,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p
            className="mb-1 text-[10px] tracking-[0.24em] uppercase"
            style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}
          >
            CONSTRUCTOR CAMPAIGN // TELEMETRY
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1.7rem",
              color: driverTheme.paleBlue,
            }}
          >
            SEASON PERFORMANCE
          </h2>
        </div>

        <select
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
          className="px-4 py-2 text-sm outline-none cursor-pointer"
          style={{
            fontFamily: "var(--font-technical)",
            background: "#021024",
            color: driverTheme.paleBlue,
            border: "1px solid rgba(193,232,255,0.25)",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          {availableYears.slice().reverse().map((availableYear) => (
            <option key={availableYear} value={availableYear} style={{ background: "#021024", color: "#C1E8FF" }}>
              {availableYear}
            </option>
          ))}
        </select>
      </div>

      <div className="relative z-10">
        {!values ? (
          <p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Loading season data…</p>
        ) : (
          <StatGrid
            stats={[
              { label: "RACE ENTRIES", value: values.gp_entries ?? 0 },
              { label: "TEAM POINTS", value: values.team_points ?? 0 },
              { label: "DRIVER WINS", value: values.wins ?? 0 },
              { label: "PODIUMS", value: values.podiums ?? 0 },
              { label: "POLES", value: values.poles ?? 0 },
              { label: "TOP 10s", value: values.top10s ?? 0 },
              { label: "DNFs", value: values.dnfs ?? 0 },
            ]}
          />
        )}
      </div>
    </div>
  );
}