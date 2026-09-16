"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ExploreBackground from "./ExploreBackground";
import ExploreIntro from "./ExploreIntro";
import ExploreCard from "./ExploreCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ExploreSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          "[data-anim='explore-eyebrow'], [data-anim='explore-heading'], [data-anim='explore-paragraph'], [data-anim='explore-card']",
          { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }
        );
        gsap.set(sectionRef.current, { opacity: 1, scale: 1, y: 0 });
        return;
      }

      // Section-level cinematic entrance animation
      gsap.set(sectionRef.current, {
        opacity: 0,
        scale: 0.92,
        y: 80,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 100%",
        end: "top 40%",
        onUpdate: (self) => {
          gsap.to(sectionRef.current, {
            opacity: self.getVelocity() > 0 ? gsap.utils.interpolate(0, 1, self.progress) : 1,
            scale: gsap.utils.interpolate(0.92, 1, self.progress),
            y: gsap.utils.interpolate(80, 0, self.progress),
            duration: 0,
            overwrite: "auto",
          });
        },
      });

      // Inner element animations (triggered when section is in view)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "restart none none reverse",
        animation: gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            "[data-anim='explore-eyebrow']",
            { opacity: 0, y: -8 },
            { opacity: 1, y: 0, duration: 0.6 }
          )
          .fromTo(
            "[data-anim='explore-heading']",
            { clipPath: "inset(0 0 100% 0)", y: 20 },
            { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.0 },
            0.15
          )
          .fromTo(
            "[data-anim='explore-paragraph']",
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.7 },
            0.5
          )
          .fromTo(
            "[data-anim='explore-card']",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
            0.7
          ),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="explore"
      ref={sectionRef}
      className="relative w-full py-32 px-8 md:px-14"
    >
      <ExploreBackground />
      <ExploreIntro />

      <div className="mx-auto mt-20 grid w-full grid-cols-1 gap-8 md:w-[90%] md:grid-cols-2 lg:gap-12">
        <ExploreCard
          index={1}
          label="Intelligence"
          descriptor="PREDICTIVE ENGINEERING"
          description="Machine learning models trained on Formula One data to estimate performance before the outcome is known."
          tags={["LAP TIME", "PIT STOP", "TYRE DEGRADATION"]}
          ctaLabel="EXPLORE MODELS"
          href='#intelligence'
          image="/images/Intelligence.jpg"
          imageAlt="Formula One engineering visualization representing predictive intelligence"
        />
        <ExploreCard
          index={2}
          label="Analytics"
          descriptor="RACE & ENGINEERING DATA"
          description="Explore drivers, teams, circuits and championship history through structured Formula One data."
          tags={["DRIVERS", "TEAMS", "CIRCUITS", "STANDINGS"]}
          ctaLabel="EXPLORE ANALYTICS"
          href="#analytics"
          image="/images/Analytics.jpg"
          imageAlt="Formula One data analytics visualization"
        />
      </div>
    </section>
  );
}