"use client";

import { use, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import useCircuitDetail from "@/hooks/useCircuitDetail";
import DepthStack from "@/components/shared/DepthStack";
import CircuitHeroCard from "@/components/analytics/circuitDetail/CircuitHeroCard";
import LapRecordCard from "@/components/analytics/circuitDetail/LapRecordCard";
import WinnersCard from "@/components/analytics/circuitDetail/WinnersCard";
import AllTimeStatsCard from "@/components/analytics/circuitDetail/AllTimeStatsCard";
import { driverTheme } from "@/components/analytics/theme";

export default function CircuitDetailPage({ params }) {
  const { id } = use(params);
  const { loading, error, profile, lapRecord, winners, allTimeStats } = useCircuitDetail(id);
  const cardRefs = useRef([]);



  if (loading) {
    return <main className="flex min-h-screen items-center justify-center" style={{ background: `linear-gradient(160deg, ${driverTheme.bgDeep}, ${driverTheme.bgMid})` }}><p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Loading circuit…</p></main>;
  }

  if (error || !profile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4" style={{ background: `linear-gradient(160deg, ${driverTheme.bgDeep}, ${driverTheme.bgMid})` }}>
        <p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Couldn&apos;t load this circuit.</p>
        <Link href="/analytics/circuits" style={{ fontFamily: "var(--font-technical)", color: driverTheme.paleBlue }}>← BACK TO CIRCUITS</Link>
      </main>
    );
  }

  const cards = [
    <CircuitHeroCard key="hero" profile={profile} />,
    <LapRecordCard key="lap" lapRecord={lapRecord} />,
    <WinnersCard key="winners" winners={winners} />,
    <AllTimeStatsCard key="stats" allTimeStats={allTimeStats} />,
  ];

  return (
    <main style={{ background: `linear-gradient(160deg, ${driverTheme.bgDeep} 0%, ${driverTheme.bgMid} 55%, ${driverTheme.bgDeep} 100%)`, minHeight: "100vh" }}>
      <div className="px-8 pt-8 md:px-14">
        <Link href="/analytics/circuits" className="text-xs tracking-[0.2em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>← BACK TO CIRCUITS</Link>
      </div>
      <div className="px-8 pb-40 pt-6 md:px-14">
        <DepthStack>{cards}</DepthStack>
      </div>
    </main>
  );
}