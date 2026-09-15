import { driverTheme } from "@/components/analytics/theme";
import StatGrid from "./StatGrid";

export default function CareerStatsCard({ careerStats, variant }) {
  const gradient =
    variant === "A"
      ? `linear-gradient(120deg, ${driverTheme.bgMid} 0%, ${driverTheme.bgDeep} 100%)`
      : `linear-gradient(120deg, ${driverTheme.steel} 0%, ${driverTheme.bgMid} 100%)`;

  return (
    <div
      className="p-8"
      style={{
        background: gradient,
        borderRadius: "18px",
        border: "1px solid rgba(193,232,255,0.1)",
      }}
    >
      <h2
        className="mb-8"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.6rem", color: driverTheme.paleBlue }}
      >
        CAREER STATISTICS
      </h2>

      <StatGrid
        stats={[
          { label: "GP ENTERED", value: careerStats.gp_entered },
          { label: "CAREER POINTS", value: careerStats.career_points },
          { label: "HIGHEST FINISH", value: careerStats.highest_finish ?? "—" },
          { label: "PODIUMS", value: careerStats.podiums },
          { label: "HIGHEST GRID", value: careerStats.highest_grid ?? "—" },
          { label: "DNFs", value: careerStats.dnfs },
          { label: "WORLD CHAMPIONSHIPS", value: careerStats.world_championships },
        ]}
      />
    </div>
  );
}