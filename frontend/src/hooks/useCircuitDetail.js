"use client";

import { useEffect, useState } from "react";
import { getCircuitProfile, getCircuitLapRecord, getCircuitWinners, getCircuitAllTimeStats } from "@/lib/api";

export default function useCircuitDetail(circuitId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [lapRecord, setLapRecord] = useState(null);
  const [winners, setWinners] = useState([]);
  const [allTimeStats, setAllTimeStats] = useState(null);

  useEffect(() => {
    Promise.all([
      getCircuitProfile(circuitId),
      getCircuitLapRecord(circuitId).catch(() => null),
      getCircuitWinners(circuitId, 15).catch(() => []),
      getCircuitAllTimeStats(circuitId).catch(() => null),
    ])
      .then(([p, lr, w, ats]) => {
        setProfile(p); setLapRecord(lr); setWinners(w); setAllTimeStats(ats); setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [circuitId]);

  return { loading, error, profile, lapRecord, winners, allTimeStats };
}