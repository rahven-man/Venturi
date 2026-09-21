"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SectionTransition({
  topColor = "#0b0c0e",
  bottomColor = "#021024",
  sectorCode = "SEC // TELEMETRY",
  position = "bottom",
}) {
  const lineRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { backgroundPosition: "-100% 0" },
          {
            backgroundPosition: "200% 0",
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 95%",
              end: "bottom 5%",
              toggleActions: "play none none reverse",
            },
            duration: 1.6,
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const isBottom = position === "bottom";

  return (
    <div
      ref={containerRef}
      className={`absolute inset-x-0 pointer-events-none z-20 ${
        isBottom ? "bottom-0" : "top-0"
      } h-36 md:h-48 flex flex-col justify-${isBottom ? "end" : "start"}`}
      style={{
        background: isBottom
          ? `linear-gradient(to bottom, transparent 0%, ${bottomColor} 100%)`
          : `linear-gradient(to top, transparent 0%, ${topColor} 100%)`,
      }}
    >
      {/* 1px F1 Telemetry Demarcation Line */}
      <div className={`relative w-full ${isBottom ? "pb-0" : "pt-0"}`}>
        <div
          ref={lineRef}
          className="h-[1px] w-full opacity-60"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(225,6,0,0.35) 15%, rgba(193,232,255,0.75) 50%, rgba(225,6,0,0.35) 85%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
        />
        {/* Technical Sector Tag */}
        <div className="absolute right-8 md:right-14 -top-3 flex items-center gap-2">
          <span
            className="text-[9px] tracking-[0.28em] font-medium"
            style={{
              fontFamily: "var(--font-technical)",
              color: "rgba(193,232,255,0.65)",
              textShadow: "0 0 8px rgba(2,16,36,0.9)",
            }}
          >
            {sectorCode}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-red)] shadow-[0_0_6px_rgba(225,6,0,0.8)]" />
        </div>
      </div>
    </div>
  );
}
