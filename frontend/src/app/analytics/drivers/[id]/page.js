"use client";

import { use } from "react";
import Link from "next/link";
import useDriverDetail from "@/components/analytics/driverDetail/useDriverDetail";
import StackCard from "@/components/analytics/driverDetail/StackCard";
import DriverHeroCard from "@/components/analytics/driverDetail/DriverHeroCard";
import SeasonPerformanceCard from "@/components/analytics/driverDetail/SeasonPerformanceCard";
import CareerStatsCard from "@/components/analytics/driverDetail/CareerStatsCard";
import DnaRadarCard from "@/components/analytics/driverDetail/DnaRadarCard";
import CareerMatrixCard from "@/components/analytics/driverDetail/CareerMatrixCard";
import { driverTheme } from "@/components/analytics/theme";

export default function DriverDetailPage({ params }) {
  const { id } = use(params);
  const { loading, error, profile, seasonTrend, careerStats, radar, careerMatrix } = useDriverDetail(id);

  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: `linear-gradient(160deg, ${driverTheme.bgDeep}, ${driverTheme.bgMid})` }}
      >
        <p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Loading driver…</p>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: `linear-gradient(160deg, ${driverTheme.bgDeep}, ${driverTheme.bgMid})` }}
      >
        <p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>
          Couldn&apos;t load this driver.
        </p>
        <Link href="/analytics/drivers" style={{ fontFamily: "var(--font-technical)", color: driverTheme.paleBlue }}>
          ← BACK TO DRIVERS
        </Link>
      </main>
    );
  }

  const availableYears = seasonTrend.map((s) => s.year);
  const cards = [
    <DriverHeroCard key="hero" profile={profile} />,
    availableYears.length > 0 && (
      <SeasonPerformanceCard key="season" driverId={id} availableYears={availableYears} variant="B" />
    ),
    <CareerStatsCard key="career" careerStats={careerStats} variant="A" />,
    <DnaRadarCard key="radar" radar={radar} variant="B" />,
    <CareerMatrixCard key="matrix" careerMatrix={careerMatrix} variant="A" />,
  ].filter(Boolean);

  return (
    <main
      style={{
        background: `linear-gradient(160deg, ${driverTheme.bgDeep} 0%, ${driverTheme.bgMid} 55%, ${driverTheme.bgDeep} 100%)`,
        minHeight: "100vh",
      }}
    >
      <div className="px-8 md:px-14 pt-8">
        <Link
          href="/analytics/drivers"
          className="text-xs tracking-[0.2em]"
          style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}
        >
          ← BACK TO DRIVERS
        </Link>
      </div>

      <div className="px-8 md:px-14 pt-6 pb-40">
        {cards.map((card, i) => (
          <StackCard key={card.key ?? i}>
            {card}
          </StackCard>
        ))}
      </div>
    </main>
  );
}