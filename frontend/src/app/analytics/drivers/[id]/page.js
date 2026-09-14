"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getDriverProfile } from "@/lib/api";
import { driverTheme } from "@/components/analytics/theme";

export default function DriverDetailPage({ params }) {
  const { id } = use(params);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDriverProfile(id)
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-8"
      style={{ background: `linear-gradient(160deg, ${driverTheme.bgDeep} 0%, ${driverTheme.bgMid} 100%)` }}
    >
      <Link
        href="/analytics/drivers"
        className="mb-10 text-xs tracking-[0.2em]"
        style={{ fontFamily: "var(--font-technical)", color: driverTheme.skyLight }}
      >
        ← BACK TO DRIVERS
      </Link>

      {loading ? (
        <p style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Loading…</p>
      ) : (
        <>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: driverTheme.paleBlue }}>
            {profile?.full_name ?? "Driver"}
          </h1>
          <p className="mt-4 text-xs tracking-[0.2em]" style={{ fontFamily: "var(--font-technical)", color: driverTheme.red }}>
            FULL PERFORMANCE DASHBOARD — COMING SOON
          </p>
        </>
      )}
    </main>
  );
}