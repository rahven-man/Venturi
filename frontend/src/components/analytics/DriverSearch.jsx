"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DriverSearch({ drivers }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef(null);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return drivers.filter((d) => d.full_name.toLowerCase().includes(q)).slice(0, 6);
  }, [query, drivers]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToDriver(driver) {
    router.push(`/analytics/drivers/${driver.driver_id}`);
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" && matches.length > 0) goToDriver(matches[0]);
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search driver…"
        aria-label="Search driver"
        className="w-full bg-transparent outline-none text-base py-3 px-4"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--color-offwhite)",
          border: "1px solid var(--color-border)",
          borderRadius: "6px",
        }}
      />

      {open && matches.length > 0 && (
        <ul
          className="absolute left-0 right-0 mt-2 overflow-hidden z-30"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "6px",
          }}
        >
          {matches.map((d) => (
            <li key={d.driver_id}>
              <button
                onClick={() => goToDriver(d)}
                className="w-full text-left px-4 py-3 text-sm transition-colors duration-200 hover:bg-white/[0.04]"
                style={{ fontFamily: "var(--font-body)", color: "var(--color-offwhite)" }}
              >
                {d.full_name}
                {d.current_team && (
                  <span className="ml-2 text-xs" style={{ color: "var(--color-grey)" }}>
                    {d.current_team}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}