"use client";

import { useEffect, useState } from "react";
import { getTeamCareerStats, getTeamProfile, getTeamSeasonTrend } from "@/lib/api";

export default function useTeamDetail(teamId) {
  const [state, setState] = useState({ loading: true, error: null, profile: null, seasonTrend: [], careerStats: null });

  useEffect(() => {
    let cancelled = false;
    Promise.all([getTeamProfile(teamId), getTeamSeasonTrend(teamId), getTeamCareerStats(teamId)])
      .then(([profile, seasonTrend, careerStats]) => {
        if (cancelled) return;
        setState({ loading: false, error: null, profile, seasonTrend, careerStats });
      })
      .catch((error) => {
        if (!cancelled) setState((current) => ({ ...current, loading: false, error: error.message }));
      });

    return () => { cancelled = true; };
  }, [teamId]);

  return state;
}