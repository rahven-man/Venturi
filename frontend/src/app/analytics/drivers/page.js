"use client";

import AnalyticsNav from "@/components/analytics/AnalyticsNav";
import DriverSearch from "@/components/analytics/DriverSearch";
import DriverDirectory from "@/components/analytics/DriverDirectory";
import useDrivers from "@/hooks/useDrivers";

export default function DriversPage() {
  const { drivers, loading, error } = useDrivers(true);

  return (
    <main style={{ background: "var(--color-graphite)", minHeight: "100vh" }}>
      <AnalyticsNav active="drivers" />

      <div className="px-8 md:px-14 pt-16 pb-14">
        <div className="flex items-center gap-3 mb-6">
          <span
            className="text-xs tracking-[0.3em]"
            style={{ fontFamily: "var(--font-technical)", color: "var(--color-red)" }}
          >
            ANALYTICS
          </span>
          <span className="h-px w-8" style={{ background: "var(--color-border)" }} />
          <span
            className="text-xs tracking-[0.3em]"
            style={{ fontFamily: "var(--font-technical)", color: "var(--color-grey)" }}
          >
            DRIVER DIRECTORY
          </span>
        </div>

        <h1
          className="max-w-2xl mb-10"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
            lineHeight: 1.1,
            color: "var(--color-offwhite)",
          }}
        >
          EVERY DRIVER.
          <br />
          EVERY DATA POINT.
        </h1>

        <div className="max-w-sm">
          <DriverSearch drivers={drivers} />
        </div>
      </div>

      <DriverDirectory drivers={drivers} loading={loading} error={error} />
    </main>
  );
}