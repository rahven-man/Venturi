"use client";

import PodiumCard from "./PodiumCard";
import StandingsRow from "./StandingsRow";
import { driverTheme } from "../theme";

export default function StandingsList({ standings, loading, error }) {
  if (loading) return <p className="py-16 text-sm" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Loading standings…</p>;
  if (error) return <p className="py-16 text-sm" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Could not load standings: {error}</p>;
  if (standings.length === 0) return <p className="py-16 text-sm" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>No standings data for this season.</p>;

  const podium = standings.slice(0, 3);
  const rest = standings.slice(3);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        {podium.map((entry, i) => <PodiumCard key={`${entry.position}-${entry.name}`} entry={entry} rank={i + 1} />)}
      </div>
      <div className="mt-10 space-y-2">
        {rest.map((entry, i) => <StandingsRow key={`${entry.position}-${entry.name}-${i}`} entry={entry} index={i} />)}
      </div>
    </div>
  );
}