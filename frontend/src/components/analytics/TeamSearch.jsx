"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { driverTheme } from "./theme";

export default function TeamSearch({ teams }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const matches = useMemo(() => {
    if (!query.trim()) return [];
    return teams.filter((team) => team.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6);
  }, [query, teams]);

  function goToTeam(team) {
    router.push(`/analytics/teams/${team.team_id}`);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); if (event.key === "Enter" && matches[0]) goToTeam(matches[0]); }}
        placeholder="Search team…"
        aria-label="Search team"
        className="w-full bg-transparent px-4 py-3 text-base outline-none"
        style={{ fontFamily: "var(--font-body)", color: driverTheme.paleBlue, border: "1px solid rgba(193,232,255,0.25)", borderRadius: "6px" }}
      />
      {open && query.trim() && (
        <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden" style={{ background: driverTheme.bgMid, border: "1px solid rgba(193,232,255,0.15)", borderRadius: "6px" }}>
          {matches.length ? matches.map((team) => (
            <button key={team.team_id} onClick={() => goToTeam(team)} className="w-full px-4 py-3 text-left text-sm hover:bg-white/[0.06]" style={{ fontFamily: "var(--font-body)", color: driverTheme.paleBlue }}>
              {team.name}<span className="ml-2 text-xs" style={{ color: driverTheme.skyLight }}>{team.nationality}</span>
            </button>
          )) : <p className="px-4 py-3 text-sm" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>No team found matching &quot;{query}&quot;.</p>}
        </div>
      )}
    </div>
  );
}