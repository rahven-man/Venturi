"use client";

import { useEffect, useState } from "react";
import { getDriverSeasonStats } from "@/lib/api";
import { driverTheme } from "@/components/analytics/theme";
import StatGrid from "./StatGrid";

export default function SeasonPerformanceCard({ driverId, availableYears }) {
  const [year, setYear] = useState(availableYears[availableYears.length - 1]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDriverSeasonStats(driverId, year)
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setStats({ year, gp: { gp_races: 0 }, sprint: { sprint_races: 0 } });
        setLoading(false);
      });
  }, [driverId, year]);

  const noData = !stats || stats.gp.gp_races === 0;

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
      {/* Telemetry micro-grid texture overlay */}
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

      <div className="relative z-10 flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p
            className="mb-1 text-[10px] tracking-[0.24em] uppercase"
            style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}
          >
            ANNUAL CAMPAIGN // TELEMETRY
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
          onChange={(e) => setYear(Number(e.target.value))}
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
          {availableYears
            .slice()
            .reverse()
            .map((y) => (
              <option key={y} value={y} style={{ background: "#021024", color: "#C1E8FF" }}>
                {y}
              </option>
            ))}
        </select>
      </div>

      {loading ? (
        <p className="relative z-10" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Loading…</p>
      ) : noData ? (
        <p className="relative z-10" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>
          Didn&apos;t participate in {year}.
        </p>
      ) : (
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <p className="mb-3 text-xs tracking-[0.2em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>
              GRAND PRIX
            </p>
            <StatGrid
              stats={[
                { label: "RACES", value: stats.gp.gp_races },
                { label: "POINTS", value: stats.gp.gp_points },
                { label: "WINS", value: stats.gp.gp_wins },
                { label: "PODIUMS", value: stats.gp.gp_podiums },
                { label: "POLES", value: stats.gp.gp_poles },
                { label: "TOP 10s", value: stats.gp.gp_top10s },
                { label: "FASTEST LAPS", value: stats.gp.gp_fastest_laps },
                { label: "DNFs", value: stats.gp.gp_dnfs },
              ]}
            />
          </div>

          {stats.sprint.sprint_races > 0 && (
            <div>
              <p className="mb-3 text-xs tracking-[0.2em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>
                SPRINT
              </p>
              <StatGrid
                stats={[
                  { label: "RACES", value: stats.sprint.sprint_races },
                  { label: "POINTS", value: stats.sprint.sprint_points },
                  { label: "WINS", value: stats.sprint.sprint_wins },
                  { label: "PODIUMS", value: stats.sprint.sprint_podiums },
                ]}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}