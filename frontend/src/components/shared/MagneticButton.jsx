"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

// A circular icon button that pulls toward the cursor while hovered
// ("magnetic" effect), and reveals a small request-style label above it.
// The pull strength is much stronger now - activates from ~2cm (75px) away

const PULL_STRENGTH = 0.75; // Increased from 0.45 for stronger magnetism
const MAX_PULL = 32; // Increased from 18 for more dramatic movement
const HOVER_RADIUS = 75; // Activates pull from 75px away (~2cm)

export default function MagneticButton({ href, icon, label }) {
  const btnRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    function handleGlobalMouseMove(e) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const { left, top, width, height } = btn.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const relX = e.clientX - centerX;
      const relY = e.clientY - centerY;

      // Calculate distance from button center
      const distance = Math.sqrt(relX * relX + relY * relY);

      // Apply magnetic effect if within hover radius
      if (distance < HOVER_RADIUS) {
        const pullX = Math.max(
          -MAX_PULL,
          Math.min(MAX_PULL, relX * PULL_STRENGTH)
        );
        const pullY = Math.max(
          -MAX_PULL,
          Math.min(MAX_PULL, relY * PULL_STRENGTH)
        );

        gsap.to(btn, { x: pullX, y: pullY, duration: 0.3, ease: "power2.out" });
      }
    }

    function handleMouseLeave() {
      gsap.to(btnRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
      });
    }

    document.addEventListener("mousemove", handleGlobalMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  function handleMouseLeave() {
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  }

  return (
    <div className="relative flex flex-col items-center">
      <span
        ref={labelRef}
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0"
        style={{
          fontFamily: "var(--font-technical)",
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          color: "var(--color-grey)",
        }}
      >
        {label}
      </span>

      <a
        ref={btnRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseLeave={handleMouseLeave}
        className="group flex items-center justify-center rounded-full transition-colors duration-300 hover:border-[var(--color-red)]"
        style={{
          width: "77px",
          height: "77px",
          border: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          color: "var(--color-offwhite)",
        }}
      >
        {icon}
      </a>
    </div>
  );
}