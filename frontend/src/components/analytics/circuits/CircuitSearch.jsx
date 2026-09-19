"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { driverTheme } from "../theme";

export default function CircuitSearch({ circuits }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef(null);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return circuits.filter((c) => c.name.toLowerCase().includes(q) || c.locality?.toLowerCase().includes(q) || c.country?.toLowerCase().includes(q)).slice(0, 6);
  }, [query, circuits]);

  useEffect(() => {
    function handleClickOutside(e) { if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToCircuit(circuit) {
    router.push(`/analytics/circuits/${circuit.circuit_id}`);
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" && matches.length > 0) goToCircuit(matches[0]);
  }

  const showNoResults = open && query.trim().length > 0 && matches.length === 0;

  return (
    <div ref={containerRef} className="relative">
      <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={handleKeyDown} placeholder="Search circuit…" aria-label="Search circuit" className="w-full bg-transparent outline-none text-base py-3 px-4" style={{ fontFamily: "var(--font-body)", color: driverTheme.paleBlue, border: "1px solid rgba(193,232,255,0.25)", borderRadius: "6px" }} />
      {open && matches.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 overflow-hidden z-30" style={{ background: driverTheme.bgMid, border: "1px solid rgba(193,232,255,0.15)", borderRadius: "6px" }}>
          {matches.map((c) => (
            <li key={c.circuit_id}>
              <button onClick={() => goToCircuit(c)} className="w-full text-left px-4 py-3 text-sm transition-colors duration-200 hover:bg-white/[0.06]" style={{ fontFamily: "var(--font-body)", color: driverTheme.paleBlue }}>
                {c.name}<span className="ml-2 text-xs" style={{ color: driverTheme.skyLight }}>{c.locality}, {c.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {showNoResults && <div className="absolute left-0 right-0 mt-2 px-4 py-3 text-sm z-30" style={{ background: driverTheme.bgMid, border: "1px solid rgba(193,232,255,0.15)", borderRadius: "6px", fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>No circuit found matching &quot;{query}&quot;.</div>}
    </div>
  );
}