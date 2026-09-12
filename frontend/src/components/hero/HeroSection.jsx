"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import HeroScene from "./HeroScene";
import HeroNavigation from "./HeroNavigation";
import HeroWordmark from "./HeroWordmark";
import HeroCTA from "./HeroCTA";
import HeroScrollCue from "./HeroScrollCue";
import HeroSpeedTrails from "./HeroSpeedTrails";

export default function HeroSection() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set("[data-anim='veil']", { opacity: 0 });
        gsap.set("[data-anim='scene-image']", { scale: 1 });
        gsap.set("[data-anim='wordmark']", { opacity: 1, scale: 1, y: 0 });
        gsap.set(
          "[data-anim='nav-item'], [data-anim='brand'], [data-anim='cta'], [data-anim='scroll-cue']",
          { opacity: 1, y: 0 }
        );
        return;
      }

      gsap.set("[data-anim='scene-image']", { scale: 1.05 });
      gsap.set("[data-anim='wordmark']", { opacity: 0, scale: 0.985, y: 8 });
      gsap.set("[data-anim='brand']", { opacity: 0, y: -10 });
      gsap.set("[data-anim='nav'] [data-anim='nav-item']", { opacity: 0, y: -10 });
      gsap.set("[data-anim='cta']", { opacity: 0, y: 10 });
      gsap.set("[data-anim='scroll-cue']", { opacity: 0, y: 10 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to("[data-anim='veil']", { opacity: 0, duration: 1.3 })
        .to(
          "[data-anim='scene-image']",
          { scale: 1.015, duration: 2.8, ease: "power2.out" },
          0
        )
        .to(
          "[data-anim='wordmark']",
          { opacity: 1, scale: 1, y: 0, duration: 2.2, ease: "power2.out" },
          0.65
        )
        .to(
          "[data-anim='wordmark-sweep']",
          { backgroundPosition: "120% 0", duration: 1.8, ease: "power2.inOut" },
          1.55
        )
        .to("[data-anim='brand']", { opacity: 1, y: 0, duration: 0.7 }, 0.9)
        .to(
          "[data-anim='nav'] [data-anim='nav-item']",
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          1.0
        )
        .to("[data-anim='cta']", { opacity: 1, y: 0, duration: 0.6 }, 1.7)
        .to("[data-anim='scroll-cue']", { opacity: 1, y: 0, duration: 0.6 }, 1.8);

      gsap.to("[data-anim='scene-image']", {
        scale: 1.03,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 3.5,
      });

      // Removed cursor/mousemove parallax effect for cleaner UX
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "var(--color-graphite)" }}
    >
      <div className="hidden md:block absolute inset-0">
        <HeroScene />
        <HeroNavigation />
        <div className="absolute inset-x-0 top-[16%] z-10 flex justify-center">
          <HeroWordmark />
        </div>
        <HeroCTA />
        <HeroScrollCue />
        <HeroSpeedTrails />
      </div>

      <div className="md:hidden absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <span
          className="text-3xl tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-slate)" }}
        >
          VENTURI
        </span>
        <p
          className="text-sm"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-grey)" }}
        >
          VENTURI is designed for a larger display. Open this experience on a
          laptop or tablet.
        </p>
      </div>
    </section>
  );
}