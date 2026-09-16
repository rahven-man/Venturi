"use client";

import { useEffect, useState } from "react";
import { getTeams } from "@/lib/api";

export default function useTeams(activeOnly = true) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getTeams(activeOnly)
      .then((data) => {
        if (cancelled) return;
        setTeams(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeOnly]);

  return { teams, loading, error };
}