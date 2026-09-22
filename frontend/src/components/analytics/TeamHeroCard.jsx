"use client";

import TeamImage from "./TeamImage";
import { resolveTeamImage, CURATED_TEAMS } from "./teamPhotos";
import { getTeamColor } from "@/lib/teamColors";

export default function TeamHeroCard({ profile }) {
  const curated =
    CURATED_TEAMS.find((team) => profile.name.toLowerCase() === team.searchKey.toLowerCase()) ??
    CURATED_TEAMS.find((team) => profile.name.toLowerCase().includes(team.searchKey.toLowerCase()));

  const teamColor = getTeamColor(curated?.displayName ?? profile.name);
  const drivers = profile.current_drivers || "CURRENT DRIVER LINE-UP";

  return (
    <div
      className="relative min-h-[22rem] md:min-h-[25rem] overflow-hidden rounded-[20px] select-none"
      style={{
        backgroundColor: teamColor,
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 18px 45px -10px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Stepped pixel / halftone background texture */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="team-halftone-dots"
            x="0"
            y="0"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="rgba(255, 255, 255, 0.22)" />
          </pattern>
        </defs>

        <rect
          x="15%"
          y="10%"
          width="70%"
          height="80%"
          fill="url(#team-halftone-dots)"
          opacity="0.65"
        />

        <g stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1.5" fill="none">
          <path d="M 20% 15% L 80% 15% L 80% 85% L 20% 85% Z" />
          <path d="M 25% 20% L 75% 20% L 75% 80% L 25% 80% Z" />
          <path d="M 30% 25% L 70% 25% L 70% 75% L 30% 75% Z" />
        </g>
      </svg>

      {/* Team info content */}
      <div
        className="relative z-10 flex w-full flex-col items-center justify-center px-6 pt-6 pb-2 text-center md:px-14"
        style={{ filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.35))" }}
      >
        <div className="w-full max-w-[50rem]">
          <div className="mb-3 flex items-center gap-4 px-[5%]">
            <span className="h-1.5 flex-1 bg-white/70" />
            <span className="h-4 w-4 rotate-45 border-2 border-white/80" />
            <span className="h-1.5 flex-1 bg-white/70" />
          </div>

          <h1
            style={{
              fontFamily: "var(--font-technical, sans-serif)",
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
              lineHeight: 0.95,
              letterSpacing: "0.02em",
              color: "#ffffff",
              textTransform: "uppercase",
            }}
          >
            {curated?.displayName ?? profile.name}
          </h1>

          <p
            className="mt-2 text-xs md:text-sm font-semibold tracking-wide text-white"
            style={{ fontFamily: "var(--font-body, sans-serif)" }}
          >
            {drivers}
          </p>

          <div
            className="mt-2 flex items-center justify-center gap-4 text-xs tracking-[0.16em] font-semibold text-white/90"
            style={{ fontFamily: "var(--font-technical, sans-serif)" }}
          >
            <span>{profile.nationality?.toUpperCase()}</span>
            <i className="h-3 w-px bg-white/50" />
            <span>EST. {profile.first_entry_year ?? "—"}</span>
          </div>

          <div className="mt-3 flex items-center gap-4 px-[5%]">
            <span className="h-1.5 flex-1 bg-white/70" />
            <span className="h-4 w-4 -rotate-45 border-2 border-white/80" />
            <span className="h-1.5 flex-1 bg-white/70" />
          </div>
        </div>
      </div>

      {/* Car render */}
      <div className="relative z-10 mx-auto h-[10.5rem] md:h-[13rem] w-[86%] max-w-[48rem]">
        <TeamImage
          filename={curated?.filename ?? resolveTeamImage(profile.name)}
          alt={`${profile.name} Formula One car`}
          className="h-full w-full object-contain object-center filter drop-shadow-[0_14px_28px_rgba(0,0,0,0.55)]"
        />
      </div>
    </div>
  );
}