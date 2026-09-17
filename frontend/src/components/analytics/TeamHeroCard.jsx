"use client";

import TeamImage from "./TeamImage";
import { resolveTeamImage, CURATED_TEAMS } from "./teamPhotos";
import { driverTheme } from "./theme";

export default function TeamHeroCard({ profile, variant }) {
  const curated = CURATED_TEAMS.find((team) => profile.name.toLowerCase() === team.searchKey.toLowerCase())
    ?? CURATED_TEAMS.find((team) => profile.name.toLowerCase().includes(team.searchKey.toLowerCase()));
  const gradient = variant === "A"
    ? `linear-gradient(120deg, ${driverTheme.bgMid} 0%, ${driverTheme.bgDeep} 100%)`
    : `linear-gradient(120deg, ${driverTheme.steel} 0%, ${driverTheme.bgMid} 100%)`;
  const drivers = profile.current_drivers || "CURRENT DRIVER LINE-UP";

  return (
    <div className="relative min-h-[34rem] overflow-hidden" style={{ background: gradient, borderRadius: "18px", border: "1px solid rgba(193,232,255,0.16)" }}>
      <div className="relative z-10 flex h-[58%] w-full flex-col items-center justify-center px-8 pt-8 text-center md:px-14">
        <div className="w-full max-w-[60rem]">
          <div className="mb-5 flex items-center gap-4 px-[5%]">
            <span className="h-2 flex-1" style={{ background: driverTheme.paleBlue }} />
            <span className="h-5 w-5 rotate-45" style={{ border: `3px solid ${driverTheme.paleBlue}` }} />
            <span className="h-2 flex-1" style={{ background: driverTheme.paleBlue }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-technical)", fontWeight: 600, fontSize: "clamp(2.8rem, 5.5vw, 5.2rem)", lineHeight: 0.92, letterSpacing: "0.03em", color: "#ffffff", textTransform: "uppercase" }}>
            {curated?.displayName ?? profile.name}
          </h1>
          <p className="mt-3 text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: driverTheme.paleBlue }}>{drivers}</p>
          <div className="mt-3 flex items-center justify-center gap-5 text-xs tracking-[0.16em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.paleBlue }}>
            <span>{profile.nationality?.toUpperCase()}</span><i className="h-5 w-px" style={{ background: driverTheme.skyLight }} /><span>{profile.first_entry_year ?? "—"}</span>
          </div>
          <div className="mt-5 flex items-center gap-4 px-[5%]">
            <span className="h-2 flex-1" style={{ background: driverTheme.paleBlue }} />
            <span className="h-5 w-5 -rotate-45" style={{ border: `3px solid ${driverTheme.paleBlue}` }} />
            <span className="h-2 flex-1" style={{ background: driverTheme.paleBlue }} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 h-[48%] w-[86%] -translate-x-1/2">
        <TeamImage filename={curated?.filename ?? resolveTeamImage(profile.name)} alt={`${profile.name} Formula One car`} className="h-full w-full object-contain object-center" />
      </div>
    </div>
  );
}