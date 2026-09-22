"use client";

import { use } from "react";
import Link from "next/link";
import AnalyticsNav from "@/components/analytics/AnalyticsNav";
import StackCard from "@/components/analytics/driverDetail/StackCard";
import TeamHeroCard from "@/components/analytics/TeamHeroCard";
import TeamSeasonPerformanceCard from "@/components/analytics/TeamSeasonPerformanceCard";
import TeamCareerStatsCard from "@/components/analytics/TeamCareerStatsCard";
import TeamTrendCard from "@/components/analytics/TeamTrendCard";
import TeamPerformanceRadarCard from "@/components/analytics/TeamPerformanceRadarCard";
import TeamSeasonMatrixCard from "@/components/analytics/TeamSeasonMatrixCard";
import useTeamDetail from "@/hooks/useTeamDetail";
import { driverTheme } from "@/components/analytics/theme";

export default function TeamDetailPage({ params }) {
  const { id } = use(params);
  const { loading, error, profile, seasonTrend, careerStats } = useTeamDetail(id);

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{
          background: `linear-gradient(160deg, ${driverTheme.bgDeep}, ${driverTheme.bgMid})`,
          color: driverTheme.paleBlue,
        }}
      >
        Loading team…
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center gap-4"
        style={{ background: driverTheme.bgDeep, color: driverTheme.paleBlue }}
      >
        <p>Couldn&apos;t load this team.</p>
        <Link href="/analytics/teams">← BACK TO TEAMS</Link>
      </main>
    );
  }

  const years = seasonTrend.map((item) => item.year);
  const cards = [
    <TeamHeroCard key="hero" profile={profile} />,
    <TeamSeasonPerformanceCard key="season" teamId={id} availableYears={years} variant="B" />,
    <TeamCareerStatsCard key="career" careerStats={careerStats} variant="A" />,
    <TeamTrendCard key="trend" seasonTrend={seasonTrend} variant="B" />,
    <TeamPerformanceRadarCard key="radar" seasonTrend={seasonTrend} careerStats={careerStats} variant="A" />,
    <TeamSeasonMatrixCard key="matrix" seasonTrend={seasonTrend} variant="B" />,
  ];

  return (
    <main
      style={{
        background: `linear-gradient(160deg, ${driverTheme.bgDeep} 0%, ${driverTheme.bgMid} 55%, ${driverTheme.bgDeep} 100%)`,
        minHeight: "100vh",
      }}
    >
      <AnalyticsNav active="teams" />
      <div className="px-8 pb-6 pt-8 md:px-14">
        <Link
          href="/analytics/teams"
          className="text-xs tracking-[0.2em]"
          style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}
        >
          ← ALL TEAMS
        </Link>
      </div>
      <div className="px-8 pb-40 pt-2 md:px-14">
        {cards.map((card, index) => (
          <StackCard key={card.key ?? index}>
            {card}
          </StackCard>
        ))}
      </div>
    </main>
  );
}
