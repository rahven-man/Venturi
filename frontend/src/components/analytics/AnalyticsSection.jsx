"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ImageAccordion from "@/components/intelligence/ImageAccordion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Reuses the exact ImageAccordion component built for Section 03 -
// only the content and image set change here. 4 panels instead of 3, so
// activeGrow is tuned slightly lower to keep the collapsed strips readable.

const PANELS = [
  {
    image: "/images/DriverImage.png",
    title: "DRIVER ANALYTICS",
    description:
      "Measure performance beyond finishing position — pace, consistency, race results and career progression.",
    tags: ["PERFORMANCE", "CONSISTENCY", "CAREER", "RESULTS"],
    ctaLabel: "EXPLORE DRIVERS",
    href: "/analytics/drivers",
  },
  {
    image: "/images/TeamImage.png",
    title: "TEAM ANALYTICS",
    description:
      "Track constructor performance, season progression and the evolution of Formula One teams.",
    tags: ["SEASON", "PERFORMANCE", "EVOLUTION", "COMPARISON"],
    ctaLabel: "EXPLORE TEAMS",
    href: "/analytics/teams",
  },
  {
    image: "/images/CircuitImage.png",
    title: "CIRCUIT ANALYTICS",
    description:
      "Explore the characteristics that shape every lap — layout, performance, records and race history.",
    tags: ["LAYOUT", "LAP RECORDS", "WINNERS", "HISTORY"],
    ctaLabel: "EXPLORE CIRCUITS",
    href: "/analytics/circuits",
  },
  {
    image: "/images/ChampionshipImage.png",
    title: "CHAMPIONSHIP",
    description:
      "Follow the competitive structure of Formula One — drivers, constructors and championship progression.",
    tags: ["DRIVERS", "CONSTRUCTORS", "SEASONS", "RANKINGS"],
    ctaLabel: "EXPLORE STANDINGS",
    href: "/analytics/standings",
  },
];

export default function AnalyticsSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          "[data-anim='analytics-eyebrow'], [data-anim='analytics-heading'], [data-anim='analytics-paragraph'], [data-anim='analytics-accordion']",
          { opacity: 1, y: 0 }
        );
        return;
      }

      gsap.set("[data-anim='analytics-eyebrow']", { opacity: 0, y: -8 });
      gsap.set("[data-anim='analytics-heading']", { opacity: 0, y: 24 });
      gsap.set("[data-anim='analytics-paragraph']", { opacity: 0, y: 14 });
      gsap.set("[data-anim='analytics-accordion']", { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "restart none none reverse",
        animation: gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to("[data-anim='analytics-eyebrow']", { opacity: 1, y: 0, duration: 0.6 })
          .to("[data-anim='analytics-heading']", { opacity: 1, y: 0, duration: 0.9 }, 0.15)
          .to("[data-anim='analytics-paragraph']", { opacity: 1, y: 0, duration: 0.7 }, 0.45)
          .to("[data-anim='analytics-accordion']", { opacity: 1, y: 0, duration: 0.9 }, 0.7),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="analytics"
      ref={sectionRef}
      className="relative w-full py-32 px-8 md:px-14"
      style={{ background: "var(--color-graphite)" }}
    >
      <div data-anim="analytics-eyebrow" className="mb-6 flex items-center gap-3">
        <span
          className="text-xs tracking-[0.3em]"
          style={{ fontFamily: "var(--font-technical)", color: "var(--color-red)" }}
        >
          04 / 05
        </span>
        <span className="h-px w-8" style={{ background: "var(--color-border)" }} />
        <span
          className="text-xs tracking-[0.3em]"
          style={{ fontFamily: "var(--font-technical)", color: "var(--color-grey)" }}
        >
          ANALYTICS
        </span>
      </div>

      <h2
        data-anim="analytics-heading"
        className="mb-6 max-w-3xl"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
          color: "var(--color-offwhite)",
        }}
      >
        SEE THE RACE
        <br />
        BEHIND THE RESULT.
      </h2>

      <p
        data-anim="analytics-paragraph"
        className="mb-16 max-w-xl text-base leading-relaxed"
        style={{ fontFamily: "var(--font-body)", color: "var(--color-grey)" }}
      >
        Explore the engineering patterns behind Formula One through driver
        performance, team evolution, circuit characteristics and
        championship history.
      </p>

      <div data-anim="analytics-accordion">
        <ImageAccordion panels={PANELS} defaultIndex={0} activeGrow={6} height="62vh" />
      </div>
    </section>
  );
}