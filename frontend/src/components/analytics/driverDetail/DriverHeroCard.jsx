"use client";

import DriverImage from "@/components/analytics/DriverImage";
import { resolveDriverImage } from "@/components/analytics/driverPhotos";
import { getTeamColor } from "@/lib/teamColors";

export default function DriverHeroCard({ profile }) {
  const nameParts = profile.full_name.trim().split(/\s+/);
  const firstName = nameParts.shift() ?? profile.full_name;
  const lastName = nameParts.join(" ");

  const teamColor = getTeamColor(profile.current_team);
  const carNumber = profile.permanent_car_number || "";
  const imageFilename = resolveDriverImage(profile.full_name);
  const isAvif = imageFilename.toLowerCase().endsWith(".avif");

  return (
    <div
      className="relative overflow-hidden w-full min-h-[22rem] md:min-h-[25rem] rounded-[20px] select-none"
      style={{
        backgroundColor: teamColor,
        boxShadow: "0 18px 45px -10px rgba(0, 0, 0, 0.5)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      {/* 1. Stepped pixel / halftone contour background texture (matching official F1 graphics) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="f1-halftone-dots"
            x="0"
            y="0"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="rgba(255, 255, 255, 0.22)" />
          </pattern>
        </defs>

        {/* Stepped pixel grid aura centered behind driver */}
        <rect
          x="42%"
          y="6%"
          width="54%"
          height="88%"
          fill="url(#f1-halftone-dots)"
          opacity="0.65"
        />

        {/* Stepped concentric contour borders */}
        <g stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1.5" fill="none">
          <path d="M 48% 12% L 94% 12% L 94% 88% L 48% 88% Z" />
          <path d="M 52% 18% L 90% 18% L 90% 82% L 52% 82% Z" />
          <path d="M 56% 24% L 86% 24% L 86% 76% L 56% 76% Z" />
          <path d="M 60% 30% L 82% 30% L 82% 70% L 60% 70% Z" />
        </g>
      </svg>

      {/* 2. Giant driver number watermark outlined behind the driver */}
      {carNumber && (
        <div
          className="absolute right-[8%] md:right-[15%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
          style={{
            fontFamily: "var(--font-technical, sans-serif)",
            fontWeight: 900,
            fontSize: "clamp(12rem, 24vw, 21rem)",
            lineHeight: 0.8,
            color: "transparent",
            WebkitTextStroke: "3px rgba(255, 255, 255, 0.25)",
            letterSpacing: "-0.04em",
          }}
        >
          {carNumber}
        </div>
      )}

      {/* 3. Official F1 angled track stripe accents on the left */}
      <div className="absolute left-[6%] md:left-[8%] top-0 h-9 w-6 flex gap-1 pointer-events-none z-10">
        <div className="w-1.5 h-full bg-white skew-y-[35deg] shadow-sm" />
        <div className="w-1 h-3/4 bg-white/50 skew-y-[35deg]" />
      </div>
      <div className="absolute left-[6%] md:left-[8%] bottom-0 h-9 w-6 flex gap-1 pointer-events-none z-10">
        <div className="w-1.5 h-full bg-white -skew-y-[35deg] shadow-sm" />
        <div className="w-1 h-3/4 bg-white/50 -skew-y-[35deg]" />
      </div>

      {/* 4. Driver Information Block (Left-aligned, crisp white, with subtle shadow) */}
      <div
        className="relative z-20 flex h-full min-h-[22rem] md:min-h-[25rem] flex-col justify-center px-8 md:px-16 w-[58%] md:w-[55%]"
        style={{ filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.35))" }}
      >
        <div className="flex flex-col items-start leading-none">
          <span
            style={{
              fontFamily: "var(--font-script, cursive)",
              fontSize: "clamp(2.6rem, 5.2vw, 4.6rem)",
              lineHeight: 0.85,
              color: "#ffffff",
              transform: "translateY(0.08em)",
              fontWeight: 400,
            }}
          >
            {firstName}
          </span>
          <span
            style={{
              fontFamily: "var(--font-technical, sans-serif)",
              fontWeight: 800,
              fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
              letterSpacing: "-0.01em",
              color: "#ffffff",
              textTransform: "uppercase",
              lineHeight: 0.95,
              marginTop: "0.1em",
            }}
          >
            {lastName || firstName}
          </span>
        </div>

        {/* Details row: Nationality | Team | Number */}
        <div
          className="mt-5 flex flex-wrap items-center gap-3 text-xs md:text-sm font-semibold tracking-wide text-white"
          style={{ fontFamily: "var(--font-technical, sans-serif)" }}
        >
          {profile.nationality && (
            <span className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-white" />
              {profile.nationality}
            </span>
          )}
          {profile.current_team && (
            <span className="flex items-center gap-3">
              <span className="opacity-60">|</span>
              {profile.current_team}
            </span>
          )}
          {carNumber && (
            <span className="flex items-center gap-3">
              <span className="opacity-60">|</span>
              #{carNumber}
            </span>
          )}
        </div>
      </div>

      {/* 5. Driver Photo: Cropped at waist-up for .avif, or fully visible for .png / GeneralDriver */}
      <div className="absolute right-[4%] md:right-[10%] bottom-0 top-0 h-full w-[44%] md:w-[38%] max-w-[420px] pointer-events-none z-10 overflow-hidden flex items-end justify-center">
        {isAvif ? (
          <div className="relative h-full w-full">
            <DriverImage
              filename={imageFilename}
              alt={profile.full_name}
              style={{
                position: "absolute",
                top: "0",
                left: "50%",
                transform: "translateX(-50%)",
                width: "auto",
                minWidth: "100%",
                height: "192%",
                objectFit: "cover",
                objectPosition: "top center",
                filter: "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4))",
              }}
            />
          </div>
        ) : (
          <div className="relative h-full w-full flex items-end justify-center pb-3">
            <DriverImage
              filename={imageFilename}
              alt={profile.full_name}
              style={{
                width: "auto",
                maxWidth: "100%",
                height: "88%",
                maxHeight: "88%",
                objectFit: "contain",
                objectPosition: "bottom center",
                filter: "drop-shadow(0 14px 28px rgba(0, 0, 0, 0.45))",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}