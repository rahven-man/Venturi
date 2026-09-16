"use client";

import Link from "next/link";
import TeamImage from "./TeamImage";
import { driverTheme } from "./theme";
import { resolveTeamImage } from "./teamPhotos";

const VARIANTS = [
  { background: `linear-gradient(135deg, ${driverTheme.bgMid}, ${driverTheme.bgDeep})`, accent: driverTheme.paleBlue },
  { background: `linear-gradient(135deg, ${driverTheme.steel}, ${driverTheme.bgMid})`, accent: "#ffffff" },
];

export default function TeamCard({ team, curated, index }) {
  const variant = VARIANTS[index % VARIANTS.length];
  const image = curated?.filename ?? resolveTeamImage(team.name);
  const displayName = curated?.displayName ?? team.name;
  const slogan = curated?.slogan ?? "ENGINEERING THE NEXT LAP";

  return (
    <Link
      href={`/analytics/teams/${team.team_id}`}
      className="group relative flex min-h-[22rem] overflow-hidden"
      style={{ background: variant.background, borderRadius: "18px", border: "1px solid rgba(193,232,255,0.16)" }}
    >
      <div className="relative z-10 flex w-[48%] flex-col items-center p-7 text-center">
        <p className="self-start text-xs tracking-[0.25em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>0{index + 1} / TEAM</p>
        <div className="my-auto flex flex-col items-center">
          <h2 className="transition-transform duration-300 group-hover:-translate-y-1" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1, color: variant.accent }}>{displayName}</h2>
          <p className="mt-4" style={{ fontFamily: "var(--font-script)", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 0.9, color: variant.accent }}>{slogan}</p>
          <p className="mt-5 text-xs tracking-[0.15em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}>{team.nationality?.toUpperCase()}</p>
        </div>
      </div>

      <div className="absolute right-0 top-0 h-full w-[60%]">
        <TeamImage filename={image} alt={`${displayName} Formula One car`} className="h-full w-full -translate-x-[3%] scale-[0.8] object-contain object-right transition-transform duration-700 ease-out group-hover:translate-x-[-5%] group-hover:scale-[0.84]" />
      </div>
      <span className="absolute bottom-6 right-7 text-xl transition-transform duration-300 group-hover:translate-x-2" style={{ color: variant.accent }}>→</span>
    </Link>
  );
}
