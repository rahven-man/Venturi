import { driverTheme } from "./theme";
import StatGrid from "./driverDetail/StatGrid";

export default function TeamCareerStatsCard({ careerStats, variant }) {
  const gradient = variant === "A" ? `linear-gradient(120deg, ${driverTheme.bgMid}, ${driverTheme.bgDeep})` : `linear-gradient(120deg, ${driverTheme.steel}, ${driverTheme.bgMid})`;
  return <div className="p-8" style={{ background: gradient, borderRadius: "18px", border: "1px solid rgba(193,232,255,0.14)" }}><h2 className="mb-8" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.6rem", color: driverTheme.paleBlue }}>CAREER STATISTICS</h2><StatGrid stats={[{ label: "RACE ENTRIES", value: careerStats.gp_entered ?? 0 }, { label: "CAREER POINTS", value: careerStats.career_points ?? 0 }, { label: "BEST FINISH", value: careerStats.highest_finish ?? "—" }, { label: "PODIUMS", value: careerStats.podiums ?? 0 }, { label: "BEST GRID", value: careerStats.highest_grid ?? "—" }, { label: "DNFs", value: careerStats.dnfs ?? 0 }, { label: "CONSTRUCTOR TITLES", value: careerStats.world_championships ?? 0 }]} /></div>;
}