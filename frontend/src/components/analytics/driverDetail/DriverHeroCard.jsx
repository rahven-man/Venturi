"use client";

import DriverImage from "@/components/analytics/DriverImage";
import { resolveDriverImage } from "@/components/analytics/driverPhotos";
import { driverTheme } from "@/components/analytics/theme";

export default function DriverHeroCard({ profile, variant }) {
  const gradient =
    variant === "A"
      ? `linear-gradient(120deg, ${driverTheme.bgMid} 0%, ${driverTheme.bgDeep} 100%)`
      : `linear-gradient(120deg, ${driverTheme.steel} 0%, ${driverTheme.bgMid} 100%)`;

  return (
    <div
      className="relative flex overflow-hidden"
      style={{
        background: gradient,
        borderRadius: "18px",
        minHeight: "35rem",
        border: "1px solid rgba(193,232,255,0.1)",
      }}
    >
      <div className="relative z-10 flex flex-col justify-center px-20" style={{ width: "50%" }}>
        <h1
          style={{
            fontFamily: "var(--font-script)",
            fontSize: "clamp(4.5rem, 8vw, 7.75rem)",
            color: driverTheme.paleBlue,
          }}
        >
          {profile.full_name}
        </h1>
        <p
          className="mt-4 text-sm tracking-[0.15em] "
          style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}
        >
          {[profile.nationality, profile.current_team, profile.permanent_car_number && `#${profile.permanent_car_number}`]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
      </div>

      <div className="absolute top-0 right-0 h-full" style={{ width: "40%" }}>
          <DriverImage
          filename={resolveDriverImage(profile.full_name)}
          alt={profile.full_name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            maskImage: "radial-gradient(ellipse 78% 92% at 50% 42%, black 58%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 78% 92% at 50% 42%, black 58%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(90deg, ${gradient.includes(driverTheme.bgMid) ? driverTheme.bgMid : driverTheme.steel} 0%, transparent 22%)` }}
        />
      </div>
    </div>
  );
}