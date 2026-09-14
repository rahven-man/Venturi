"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DriverCard from "./DriverCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// The stacking effect itself is CSS: every row is `position: sticky` at
// the SAME top offset, so as the user scrolls, each new row (later in the
// DOM, higher z-index) naturally comes to rest on top of the one before
// it - no JS needed for the overlap itself. GSAP only adds a subtle
// scale-down + dim on the row that's being covered, scrubbed to scroll
// position, for the "cards receding into the stack" feel.
export default function DriverDirectory({ drivers, loading, error }) {
  const rowRefs = useRef([]);
  const rows = chunk(drivers, 2);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || rows.length === 0) return;

    const ctx = gsap.context(() => {
      rowRefs.current.forEach((row, i) => {
        if (!row || i === rows.length - 1) return;
        gsap.to(row, {
          scale: 0.93,
          opacity: 0.45,
          ease: "none",
          transformOrigin: "center top",
          scrollTrigger: {
            trigger: row,
            start: "top 96px",
            end: "bottom 96px",
            scrub: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, [rows.length]);

  if (loading) {
    return (
      <p
        className="px-8 md:px-14 py-24 text-sm"
        style={{ fontFamily: "var(--font-body)", color: "var(--color-grey)" }}
      >
        Loading drivers…
      </p>
    );
  }

  if (error) {
    return (
      <p
        className="px-8 md:px-14 py-24 text-sm"
        style={{ fontFamily: "var(--font-body)", color: "var(--color-grey)" }}
      >
        Could not load drivers: {error}
      </p>
    );
  }

  return (
    <div className="px-8 md:px-14 pb-40">
      {rows.map((row, i) => (
        <div
          key={i}
          ref={(el) => (rowRefs.current[i] = el)}
          className="sticky grid grid-cols-1 sm:grid-cols-2 gap-6 pb-16 will-change-transform"
          style={{ top: "96px", zIndex: i + 1 }}
        >
          {row.map((driver) => (
            <DriverCard
              key={driver.driver_id}
              driver={driver}
              colorVariant={i % 2 === 0 ? "A" : "B"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}