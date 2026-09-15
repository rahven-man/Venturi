"use client";

import { useEffect, useState } from "react";
import { getDriverSeasonStats } from "@/lib/api";
import { driverTheme } from "@/components/analytics/theme";
import StatGrid from "./StatGrid";

export default function SeasonPerformanceCard({ driverId, availableYears, variant }) {
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

  const gradient =
    variant === "A"
      ? `linear-gradient(120deg, ${driverTheme.bgMid} 0%, ${driverTheme.bgDeep} 100%)`
      : `linear-gradient(120deg, ${driverTheme.steel} 0%, ${driverTheme.bgMid} 100%)`;

  const noData = !stats || stats.gp.gp_races === 0;
  return (
    <div
      className="p-8"
      style={{
        background: gradient,
        borderRadius: "18px",
        border: "1px solid rgba(193,232,255,0.1)",
        minHeight: "20rem",
      }}
    >
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.6rem", color: driverTheme.paleBlue }}
        >
          SEASON PERFORMANCE
        </h2>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-4 py-2 text-sm outline-none"
          style={{
            fontFamily: "var(--font-technical)",
            background: "rgba(2,16,36,0.5)",
            color: driverTheme.paleBlue,
            border: "1px solid rgba(193,232,255,0.25)",
            borderRadius: "6px",
          }}
        >
          {availableYears
            .slice()
            .reverse()
            .map((y) => (
              <option key={y} value={y} style={{ color: "#021024" }}>
                {y}
              </option>
            ))}
        </select>
      </div>

      {loading ? (
        <p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Loading…</p>
      ) : noData ? (
        <p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>
          Didn&apos;t participate in {year}.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
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