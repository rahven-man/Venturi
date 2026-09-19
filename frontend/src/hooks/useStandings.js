"use client";

import { useEffect, useState } from "react";
import { getStandingsSeasons, getDriverStandings, getConstructorStandings } from "@/lib/api";

function normalize(type, raw) {
  if (type === "drivers") {
    return raw.map((r) => ({ position: r.position, name: r.driver_name, team: r.team_name, points: r.points, wins: r.wins }));
  }
  return raw.map((r) => ({ position: r.position, name: r.team_name, team: r.team_name, points: r.points, wins: r.wins }));
}

export default function useStandings() {
  const [seasons, setSeasons] = useState([]);
  const [seasonsLoading, setSeasonsLoading] = useState(true);
  const [year, setYear] = useState(null);
  const [type, setType] = useState("drivers");
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStandingsSeasons()
      .then((data) => { setSeasons(data); setYear(data[0]); setSeasonsLoading(false); })
      .catch((e) => { setError(e.message); setSeasonsLoading(false); });
  }, []);

  useEffect(() => {
    if (!year) return;
    setLoading(true);
    const fetcher = type === "drivers" ? getDriverStandings : getConstructorStandings;
    fetcher(year)
      .then((data) => { setStandings(normalize(type, data)); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [year, type]);

  return { seasons, seasonsLoading, year, setYear, type, setType, standings, loading, error };
}