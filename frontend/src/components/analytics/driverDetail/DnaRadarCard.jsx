"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { driverTheme } from "@/components/analytics/theme";

const TRAITS = [
  { key: "qualifying_pole_rate", label: "QUALIFYING", desc: "Pole positions per race entered." },
  { key: "race_pace_win_rate", label: "RACE PACE", desc: "Wins converted per race started." },
  { key: "consistency_points_rate", label: "CONSISTENCY", desc: "Points-scoring rate against the maximum available." },
  { key: "reliability_finish_rate", label: "RELIABILITY", desc: "Share of races finished without a DNF." },
  { key: "racecraft_positions_gained", label: "RACECRAFT", desc: "Average positions gained from grid to finish." },
  { key: "clutch_win_conversion", label: "CLUTCH FACTOR", desc: "Wins converted from pole positions." },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div
      className="px-3 py-2 text-xs"
      style={{
        fontFamily: "var(--font-technical)",
        background: "rgba(2,16,36,0.92)",
        border: "1px solid rgba(193,232,255,0.25)",
        borderRadius: "6px",
        color: driverTheme.paleBlue,
      }}
    >
      <p className="tracking-[0.1em]">{point.axis}</p>
      <p className="mt-1" style={{ color: driverTheme.skyLight }}>{point.value}%</p>
    </div>
  );
}

export default function DnaRadarCard({ radar, variant }) {
  const gradient =
    variant === "A"
      ? `linear-gradient(120deg, ${driverTheme.bgMid} 0%, ${driverTheme.bgDeep} 100%)`
      : `linear-gradient(120deg, ${driverTheme.steel} 0%, ${driverTheme.bgMid} 100%)`;

  const chartData = radar?.radar
    ? TRAITS.map((t) => ({ axis: t.label, value: Math.round(radar.radar[t.key] * 100) }))
    : null;

  return (
    <div
      className="p-8"
      style={{
        background: gradient,
        borderRadius: "18px",
        border: "1px solid rgba(193,232,255,0.1)",
        minHeight: "26rem",
      }}
    >
      <h2
        className="mb-6"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.6rem", color: driverTheme.paleBlue }}
      >
        DRIVER DNA
      </h2>

      {!chartData ? (
        <p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>
          No career race data available for this driver.
        </p>
      ) : (
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8 items-center">
          <div className="flex flex-col gap-4">
            {TRAITS.map((t, i) => (
              <div key={t.key} className="flex items-start gap-3">
                <span
                  className="mt-0.5 text-lg tabular-nums"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: driverTheme.paleBlue, minWidth: "2.5rem" }}
                >
                  {chartData[i].value}%
                </span>
                <div>
                  <p className="text-xs tracking-[0.15em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.paleBlue }}>
                    {t.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={chartData} outerRadius="75%">
              <PolarGrid stroke="rgba(193,232,255,0.25)" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: driverTheme.paleBlue, fontSize: 11, fontFamily: "var(--font-technical)" }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "rgba(193,232,255,0.4)", fontSize: 9 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                dataKey="value"
                stroke={driverTheme.paleBlue}
                fill={driverTheme.paleBlue}
                fillOpacity={0.42}
                strokeWidth={2.5}
                dot={{ r: 4, fill: driverTheme.paleBlue, stroke: driverTheme.bgDeep, strokeWidth: 1 }}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}