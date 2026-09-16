"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TeamCard from "./TeamCard";
import { CURATED_TEAMS } from "./teamPhotos";
import { driverTheme } from "./theme";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function TeamDirectory({ teams, loading, error }) {
  const rowRefs = useRef([]);
  const curatedTeams = CURATED_TEAMS.map((curated) => ({
    curated,
    team: teams.find((team) => team.name.toLowerCase().includes(curated.searchKey.toLowerCase())),
  })).filter((item) => item.team);

  useLayoutEffect(() => {
    if (loading || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = gsap.context(() => {
      rowRefs.current.forEach((row, index) => {
        if (!row || index === curatedTeams.length - 1) return;
        gsap.to(row, { scale: 0.96, opacity: 0.82, ease: "none", transformOrigin: "center top", scrollTrigger: { trigger: row, start: "top 96px", end: "bottom 96px", scrub: true } });
      });
    });
    return () => ctx.revert();
  }, [curatedTeams.length, loading]);

  if (loading) return <p className="px-8 py-24 text-sm md:px-14" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Loading teams…</p>;
  if (error) return <p className="px-8 py-24 text-sm md:px-14" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Could not load teams: {error}</p>;

  return (
    <div className="px-8 pb-40 md:px-14">
      {curatedTeams.map(({ team, curated }, index) => (
        <div key={team.team_id} ref={(element) => { rowRefs.current[index] = element; }} className="sticky pb-8 will-change-transform" style={{ top: "96px", zIndex: index + 1 }}>
          <TeamCard team={team} curated={curated} index={index} />
        </div>
      ))}
    </div>
  );
}
