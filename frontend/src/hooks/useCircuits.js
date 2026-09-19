"use client";

import { useEffect, useState } from "react";
import { getCircuits } from "@/lib/api";

export default function useCircuits() {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCircuits(true)
      .then((data) => { setCircuits(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  return { circuits, loading, error };
}