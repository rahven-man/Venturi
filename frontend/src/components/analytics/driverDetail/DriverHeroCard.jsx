"use client";

import DriverImage from "@/components/analytics/DriverImage";
import { resolveDriverImage } from "@/components/analytics/driverPhotos";
import { driverTheme } from "@/components/analytics/theme";

export default function DriverHeroCard({ profile, variant }) {
  const nameParts = profile.full_name.trim().split(/\s+/);
  const firstName = nameParts.shift() ?? profile.full_name;
  const lastName = nameParts.join(" ");

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
      <div className="relative z-10 flex w-[60%] flex-col items-center justify-center px-8 text-center md:px-14">
        <div className="w-full max-w-[35rem]">
          <div className="mb-7 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${driverTheme.paleBlue}, transparent)` }} />
          <h1 className="flex flex-col items-center leading-none">
            <span
              style={{
                fontFamily: "var(--font-script)",
                fontSize: "clamp(3.8rem, 7vw, 6.8rem)",
                lineHeight: 0.7,
                color: driverTheme.paleBlue,
                transform: "translateY(0.15em)",
              }}
            >
              {firstName}
            </span>
            <span
              style={{
                fontFamily: "var(--font-technical)",
                fontWeight: 600,
                fontSize: "clamp(3.2rem, 6vw, 6rem)",
                letterSpacing: "0.015em",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              {lastName || firstName}
            </span>
          </h1>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-lg" style={{ fontFamily: "var(--font-technical)", fontWeight: 600, color: driverTheme.paleBlue }}>
            {[
              profile.nationality,
              profile.current_team,
              profile.permanent_car_number && `#${profile.permanent_car_number}`,
            ].filter(Boolean).map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-5">
                {index > 0 && <i className="h-5 w-px" style={{ background: driverTheme.skyLight }} />}
                {item}
              </span>
            ))}
          </div>
          <div className="mt-7 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${driverTheme.paleBlue}, transparent)` }} />
        </div>
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