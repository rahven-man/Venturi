import { driverTheme } from "./theme";
import StatGrid from "./driverDetail/StatGrid";

export default function TeamCareerStatsCard({ careerStats }) {
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
          CONSTRUCTOR ARCHIVE // ALL-TIME RECORD
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
            { label: "RACE ENTRIES", value: careerStats?.gp_entered ?? 0 },
            { label: "CAREER POINTS", value: careerStats?.career_points ?? 0 },
            { label: "BEST FINISH", value: careerStats?.highest_finish ?? "—" },
            { label: "PODIUMS", value: careerStats?.podiums ?? 0 },
            { label: "BEST GRID", value: careerStats?.highest_grid ?? "—" },
            { label: "DNFs", value: careerStats?.dnfs ?? 0 },
            { label: "CONSTRUCTOR TITLES", value: careerStats?.world_championships ?? 0 },
          ]}
        />
      </div>
    </div>
  );
}