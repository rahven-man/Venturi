import { driverTheme } from "@/components/analytics/theme";
import StatGrid from "./StatGrid";

export default function CareerStatsCard({ careerStats }) {
  return (
    <div
      className="relative overflow-hidden p-8 rounded-[20px]"
      style={{
        backgroundColor: "#052659",
        border: "1px solid rgba(193,232,255,0.16)",
        boxShadow: "0 20px 45px -12px rgba(0, 0, 0, 0.65)",
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

      <div className="relative z-10 mb-8">
        <p
          className="mb-1 text-[10px] tracking-[0.24em] uppercase"
          style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}
        >
          LIFETIME RECORD // ARCHIVE
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "1.7rem",
            color: driverTheme.paleBlue,
          }}
        >
          CAREER STATISTICS
        </h2>
      </div>

      <div className="relative z-10">
        <StatGrid
          stats={[
            { label: "WORLD CHAMPIONSHIPS", value: careerStats?.world_championships ?? 0 },
            { label: "GP ENTERED", value: careerStats?.gp_entered ?? 0 },
            { label: "GP WON", value: careerStats?.gp_won ?? careerStats?.wins ?? 0 },
            { label: "PODIUMS", value: careerStats?.podiums ?? 0 },
            { label: "POLE POSITIONS", value: careerStats?.poles ?? 0 },
            { label: "FASTEST LAPS", value: careerStats?.fastest_laps ?? 0 },
            { label: "CAREER POINTS", value: careerStats?.career_points ?? 0 },
            { label: "DNFs", value: careerStats?.dnfs ?? 0 },
          ]}
        />
      </div>
    </div>
  );
}