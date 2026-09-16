"use client";

import AnalyticsNav from "@/components/analytics/AnalyticsNav";
import TeamSearch from "@/components/analytics/TeamSearch";
import TeamDirectory from "@/components/analytics/TeamDirectory";
import useTeams from "@/hooks/useTeams";
import { driverTheme } from "@/components/analytics/theme";

export default function TeamsPage() {
  const { teams, loading, error } = useTeams(false);

  return (
    <main style={{ background: `linear-gradient(160deg, ${driverTheme.bgDeep} 0%, ${driverTheme.bgMid} 55%, ${driverTheme.bgDeep} 100%)`, minHeight: "100vh" }}>
      <AnalyticsNav active="teams" />

      <div className="px-8 pb-14 pt-16 md:px-14">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-xs tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.red }}>ANALYTICS</span>
          <span className="h-px w-8" style={{ background: driverTheme.steel }} />
          <span className="text-xs tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>TEAM DIRECTORY</span>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h1 className="max-w-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)", lineHeight: 1.1, color: driverTheme.paleBlue }}>
              EVERY TEAM.
              <br />
              EVERY CONSTRUCTOR STORY.
            </h1>
          </div>
          <div className="w-full md:max-w-sm md:shrink-0"><TeamSearch teams={teams} /></div>
        </div>
      </div>

      <TeamDirectory teams={teams} loading={loading} error={error} />
    </main>
  );
}
