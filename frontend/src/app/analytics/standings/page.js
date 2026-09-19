"use client";

import useStandings from "@/hooks/useStandings";
import StandingsList from "@/components/analytics/championship/StandingsList";
import YearSelector from "@/components/analytics/championship/YearSelector";
import AnalyticsNav from "@/components/analytics/AnalyticsNav";
import { driverTheme } from "@/components/analytics/theme";

const TABS = [{ key: "drivers", label: "DRIVERS" }, { key: "constructors", label: "CONSTRUCTORS" }];

export default function ChampionshipPage() {
  const { seasons, seasonsLoading, year, setYear, type, setType, standings, loading, error } = useStandings();

  return (
    <main style={{ background: `linear-gradient(160deg, ${driverTheme.bgDeep} 0%, ${driverTheme.bgMid} 55%, ${driverTheme.bgDeep} 100%)`, minHeight: "100vh" }}>
      <AnalyticsNav active="championship" />

      <div className="px-8 pb-10 pt-16 md:px-14">
        <div className="mb-4 flex items-center gap-3 text-xs tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>
          <span style={{ color: "#e10600" }}>ANALYTICS</span><span>—</span><span>CHAMPIONSHIP</span>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1, color: driverTheme.paleBlue }}>SEASON STANDINGS</h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-1 rounded-full p-1" style={{ border: "1px solid rgba(193,232,255,0.15)" }}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setType(tab.key)}
                  className="rounded-full px-4 py-2 text-xs transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-technical)",
                    letterSpacing: "0.12em",
                    background: type === tab.key ? "#e10600" : "transparent",
                    color: type === tab.key ? "#ffffff" : driverTheme.skyLight,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {!seasonsLoading && year && <YearSelector year={year} setYear={setYear} seasons={seasons} />}
          </div>
        </div>
      </div>

      <div className="px-8 pb-40 md:px-14">
        <StandingsList standings={standings} loading={loading || seasonsLoading} error={error} />
      </div>
    </main>
  );
}