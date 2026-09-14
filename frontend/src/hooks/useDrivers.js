"use client";

import { useEffect, useState } from "react";
import { getDrivers } from "@/lib/api";

// Single source of driver data - shared by the search bar and the
// directory grid, so the two never fall out of sync (see spec section 16).
export default function useDrivers(activeOnly = true) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDrivers(activeOnly)
      .then((data) => {
        setDrivers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [activeOnly]);

  return { drivers, loading, error };
}