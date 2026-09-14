"use client";

import { useMemo } from "react";
import AnalyticsNav from "@/components/analytics/AnalyticsNav";
import DriverSearch from "@/components/analytics/DriverSearch";
import DriverDirectory from "@/components/analytics/DriverDirectory";
import useDrivers from "@/hooks/useDrivers";
import { CURATED_DRIVERS } from "@/components/analytics/driverPhotos";
import { driverTheme } from "@/components/analytics/theme";

export default function DriversPage() {
  // Full roster (not just active_only) - used both for search
  // and to resolve the curated cards' real driver_id/team.
  const { drivers, loading, error } = useDrivers(false);

  const curated = useMemo(() => {
    if (!drivers.length) return [];

    return CURATED_DRIVERS.map((entry) => {
      const match = drivers.find((d) =>
        d.full_name.toLowerCase().includes(entry.searchKey.toLowerCase())
      );

      return {
        ...entry,
        driver_id: match?.driver_id ?? null,
        current_team: match?.current_team ?? null,
      };
    }).filter((d) => d.driver_id !== null);
  }, [drivers]);

  return (
    <main
      style={{
        background: `linear-gradient(
          160deg,
          ${driverTheme.bgDeep} 0%,
          ${driverTheme.bgMid} 55%,
          ${driverTheme.bgDeep} 100%
        )`,
        minHeight: "100vh",
      }}
    >
      <AnalyticsNav active="drivers" />

      <div className="px-8 md:px-14 pt-16 pb-14">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="text-xs tracking-[0.3em]"
            style={{
              fontFamily: "var(--font-technical)",
              color: driverTheme.red,
            }}
          >
            ANALYTICS
          </span>

          <span
            className="h-px w-8"
            style={{ background: driverTheme.steel }}
          />

          <span
            className="text-xs tracking-[0.3em]"
            style={{
              fontFamily: "var(--font-technical)",
              color: driverTheme.skyLight,
            }}
          >
            DRIVER DIRECTORY
          </span>
        </div>

        {/* Heading + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12">
          <h1
            className="max-w-2xl mb-0"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
              lineHeight: 1.1,
              color: driverTheme.paleBlue,
            }}
          >
            EVERY DRIVER.
            <br />
            EVERY DATA POINT.
          </h1>

          {/* Driver Search */}
          <div className="w-full md:max-w-sm md:shrink-0">
            <DriverSearch drivers={drivers} />
          </div>
        </div>
      </div>

      <DriverDirectory
        drivers={curated}
        loading={loading}
        error={error}
      />
    </main>
  );
}