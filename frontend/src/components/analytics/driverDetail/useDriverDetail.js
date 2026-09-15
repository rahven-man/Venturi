"use client";

import { useEffect, useState } from "react";
import {
  getDriverProfile,
  getDriverSeasonTrend,
  getDriverCareerStats,
  getDriverDnaRadar,
  getDriverCareerMatrix,
} from "@/lib/api";

// Loads everything the detail page needs once, up front. Season-specific
// stats (which change when the dropdown changes) are fetched separately
// inside SeasonPerformanceCard, since only that card needs to refetch.
export default function useDriverDetail(driverId) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    profile: null,
    seasonTrend: [],
    careerStats: null,
    radar: null,
    careerMatrix: [],
  });

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getDriverProfile(driverId),
      getDriverSeasonTrend(driverId),
      getDriverCareerStats(driverId),
      getDriverDnaRadar(driverId),
      getDriverCareerMatrix(driverId),
    ])
      .then(([profile, seasonTrend, careerStats, radar, careerMatrix]) => {
        if (cancelled) return;
        setState({
          loading: false,
          error: null,
          profile,
          seasonTrend,
          careerStats,
          radar,
          careerMatrix,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setState((s) => ({ ...s, loading: false, error: err.message }));
      });

    return () => {
      cancelled = true;
    };
  }, [driverId]);

  return state;
}