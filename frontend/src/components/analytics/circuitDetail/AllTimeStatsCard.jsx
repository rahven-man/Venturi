"use client";

import { driverTheme } from "../theme";

export default function AllTimeStatsCard({ allTimeStats }) {
  const driver = allTimeStats?.most_wins_driver;
  const team = allTimeStats?.most_wins_team;
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-2xl p-8" style={{ background: `linear-gradient(135deg, ${driverTheme.steel} 0%, ${driverTheme.bgMid} 100%)`, border: "1px solid rgba(193,232,255,0.14)" }}>
        <p className="text-[10px] tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: "#e10600" }}>MOST SUCCESSFUL DRIVER</p>
        {driver ? (
          <>
            <h3 className="mt-4 text-3xl" style={{ fontFamily: "var(--font-serif)", color: "#ffffff" }}>{driver.driver_name}</h3>
            <p className="mt-2 text-sm" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>{driver.wins} wins at this circuit</p>
          </>
        ) : <p className="mt-4 text-sm" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>No data available.</p>}
      </div>
      <div className="rounded-2xl p-8" style={{ background: `linear-gradient(135deg, ${driverTheme.bgMid} 0%, ${driverTheme.bgDeep} 100%)`, border: "1px solid rgba(193,232,255,0.14)" }}>
        <p className="text-[10px] tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: "#e10600" }}>MOST SUCCESSFUL TEAM</p>
        {team ? (
          <>
            <h3 className="mt-4 text-3xl" style={{ fontFamily: "var(--font-serif)", color: "#ffffff" }}>{team.team_name}</h3>
            <p className="mt-2 text-sm" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>{team.wins} wins at this circuit</p>
          </>
        ) : <p className="mt-4 text-sm" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>No data available.</p>}
      </div>
    </div>
  );
}