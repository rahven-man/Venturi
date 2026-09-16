"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ImageAccordion from "./ImageAccordion";
import MagneticButton from "@/components/shared/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PANELS = [
  {
    image: "/images/LapTimeImage.png",
    title: "LAP TIME MODEL",
    description:
      "Predictive modelling of lap performance using race and driver variables.",
    tags: ["LAP PACE", "DRIVER INPUT", "TYRE STATE", "CIRCUIT VARIABLES"],
    ctaLabel: "EXPLORE LAP TIME",
    href: "/intelligence/lap-time",
  },
  {
    image: "/images/PitStopImage.png",
    title: "PIT STOP MODEL",
    description:
      "Estimating pit stop likelihood from stint length, tyre condition and race context.",
    tags: ["STINT LENGTH", "TYRE LIFE", "TRACK POSITION", "RACE CONTEXT"],
    ctaLabel: "EXPLORE PIT STOP",
    href: "/intelligence/pit-stop",
  },
  {
    image: "/images/TyreDegImage.png",
    title: "TYRE DEGRADATION MODEL",
    description:
      "Modelling how tyre performance falls away over a stint under real conditions.",
    tags: ["COMPOUND", "STINT LAP", "TRACK TEMP", "DEGRADATION CURVE"],
    ctaLabel: "EXPLORE TYRE DEGRADATION",
    href: "/intelligence/tyre-degradation",
  },
];

export default function IntelligenceSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          "[data-anim='intel-eyebrow'], [data-anim='intel-heading'], [data-anim='intel-paragraph'], [data-anim='intel-accordion']",
          { opacity: 1, y: 0 }
        );
        return;
      }

      gsap.set("[data-anim='intel-eyebrow']", { opacity: 0, y: -8 });
      gsap.set("[data-anim='intel-heading']", { opacity: 0, y: 24 });
      gsap.set("[data-anim='intel-paragraph']", { opacity: 0, y: 14 });
      gsap.set("[data-anim='intel-accordion']", { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "restart none none reverse",
        animation: gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to("[data-anim='intel-eyebrow']", { opacity: 1, y: 0, duration: 0.6 })
          .to("[data-anim='intel-heading']", { opacity: 1, y: 0, duration: 0.9 }, 0.15)
          .to("[data-anim='intel-paragraph']", { opacity: 1, y: 0, duration: 0.7 }, 0.45)
          .to("[data-anim='intel-accordion']", { opacity: 1, y: 0, duration: 0.9 }, 0.7),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="intelligence"
      ref={sectionRef}
      className="relative w-full py-32 px-8 md:px-14"
      style={{ background: "var(--color-intelligence-surface)" }}
    >
      <div data-anim="intel-eyebrow" className="mb-6 flex items-center gap-3">
        <span
          className="text-xs tracking-[0.3em]"
          style={{ fontFamily: "var(--font-technical)", color: "var(--color-red)" }}
        >
          03 / 05
        </span>
        <span className="h-px w-8" style={{ background: "var(--color-border)" }} />
        <span
          className="text-xs tracking-[0.3em]"
          style={{ fontFamily: "var(--font-technical)", color: "var(--color-grey)" }}
        >
          INTELLIGENCE
        </span>
      </div>

      <div className="mb-6 flex gap-12 lg:gap-20 items-start justify-between">
        <h2
          data-anim="intel-heading"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            color: "var(--color-palette-ice)",
          }}
        >
          PREDICT THE RACE.
          <br />
          UNDERSTAND THE VARIABLES.
        </h2>

        {/* Buttons on right - horizontal */}
        <div className="flex items-center gap-8 lg:gap-10 flex-shrink-0">
          <MagneticButton
            href="https://github.com/rahven-man/Venturi"
            label="GIVE STARS ON MY REPOSITORY"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.41-2.7 5.38-5.27 5.67.42.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z" />
              </svg>
            }
          />
          <MagneticButton
            href="https://www.linkedin.com/in/abdur-rahman-ab506829a"
            label="CONNECT ON LINKEDIN"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            }
          />
          <MagneticButton
            href="https://leetcode.com/u/RahmanWork/"
            label="VISIT MY LEETCODE PROFILE"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.48 22.5c-1.1 0-2.14-.42-2.93-1.18l-4.5-4.32a4.1 4.1 0 0 1-1.25-2.96c0-1.12.45-2.18 1.25-2.96l4.5-4.32a4.24 4.24 0 0 1 5.86 0 4.1 4.1 0 0 1 0 5.92 1.1 1.1 0 0 1-1.53 0 1.05 1.05 0 0 1 0-1.5 1.99 1.99 0 0 0 0-2.92 2.07 2.07 0 0 0-2.8 0l-4.5 4.32a1.99 1.99 0 0 0 0 2.92l4.5 4.32c.77.74 2.02.74 2.8 0a1.99 1.99 0 0 0 0-2.92 1.05 1.05 0 0 1 0-1.5 1.1 1.1 0 0 1 1.53 0 4.1 4.1 0 0 1 0 5.92c-.79.76-1.83 1.18-2.93 1.18z" />
              </svg>
            }
          />
        </div>
      </div>

      <div data-anim="intel-paragraph" className="mb-16 max-w-xl">
        <p
          className="text-base leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-palette-sky)" }}
        >
          VENTURI turns race data into predictive engineering models for lap
          time, pit stops and tyre performance.
        </p>
      </div>

      <div data-anim="intel-accordion">
        <ImageAccordion panels={PANELS} defaultIndex={0} activeGrow={3.5} height="62vh" />
      </div>
    </section>
  );
}