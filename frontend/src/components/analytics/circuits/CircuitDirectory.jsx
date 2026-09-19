"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CircuitCard from "./CircuitCard";
import { driverTheme } from "../theme";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function CircuitDirectory({ circuits, loading, error }) {
  const rowRefs = useRef([]);
  const rows = chunk(circuits, 2);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || rows.length === 0) return;
    const ctx = gsap.context(() => {
      rowRefs.current.forEach((row, i) => {
        if (!row || i === rows.length - 1) return;
        gsap.to(row, { scale: 0.93, opacity: 0.45, ease: "none", transformOrigin: "center top", scrollTrigger: { trigger: row, start: "top 96px", end: "bottom 96px", scrub: true } });
      });
    });
    return () => ctx.revert();
  }, [rows.length]);

  if (loading) return <p className="px-8 md:px-14 py-24 text-sm" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Loading circuits…</p>;
  if (error) return <p className="px-8 md:px-14 py-24 text-sm" style={{ fontFamily: "var(--font-body)", color: driverTheme.skyLight }}>Could not load circuits: {error}</p>;

  return (
    <div className="px-8 md:px-14 pb-40">
      {rows.map((row, i) => (
        <div key={i} ref={(el) => (rowRefs.current[i] = el)} className="sticky grid grid-cols-1 sm:grid-cols-2 gap-6 pb-16 will-change-transform" style={{ top: "96px", zIndex: i + 1 }}>
          {row.map((circuit) => <CircuitCard key={circuit.circuit_id} circuit={circuit} colorVariant={i % 2 === 0 ? "A" : "B"} />)}
        </div>
      ))}
    </div>
  );
}