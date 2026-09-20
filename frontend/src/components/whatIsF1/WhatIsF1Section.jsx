"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { label: "RACES PER YEAR", value: "24" },
  { label: "TEAMS ON THE GRID", value: "10" },
  { label: "DRIVERS COMPETING", value: "20" },
  { label: "TOP SPEED", value: "350+ KM/H" },
];

const REVEAL_STEPS = [
  { start: 0.0, end: 0.24, label: "01", title: "ENGINEERING", desc: "Every curve of the car is shaped by data — aerodynamics tuned to the millimetre." },
  { start: 0.24, end: 0.48, label: "02", title: "STRATEGY", desc: "Split-second pit calls decide championships. Every lap is a live decision tree." },
  { start: 0.48, end: 0.74, label: "03", title: "HUMAN LIMIT", desc: "Drivers withstand 5G+ cornering forces at 350 km/h under extreme physical load." },
  { start: 0.74, end: 1.0, label: "04", title: "GLOBAL STAGE", desc: "24 races, 5 continents, hundreds of millions watching every season." },
];

export default function WhatIsF1Section() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const revealRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Left content fades in once, on entry - not tied to the scrub.
    const introCtx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(contentRef.current, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(contentRef.current, { opacity: 0, y: 24 });
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 90%", once: true },
      });
    }, section);

    if (reduceMotion) return () => introCtx.revert();

    // Scroll-scrub loop: captures scroll input immediately, smooths it via
    // a lerp so the video and reveal text move fluidly without jarring jumps.
    let targetProgress = 0;
    let currentProgress = 0;
    let rafId;
    let videoReady = video.readyState >= 1;

    function onMeta() {
      videoReady = true;
    }
    video.addEventListener("loadedmetadata", onMeta);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        targetProgress = self.progress;
      },
    });

    function loop() {
      currentProgress += (targetProgress - currentProgress) * 0.18;

      if (videoReady && video.duration) {
        video.currentTime = currentProgress * video.duration;
      }

      revealRefs.current.forEach((el, i) => {
        if (!el) return;
        const { start, end } = REVEAL_STEPS[i];
        const local = Math.max(0, Math.min(1, (currentProgress - start) / (end - start)));
        el.style.opacity = local;
        el.style.transform = `translateY(${(1 - local) * 18}px)`;
      });

      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", onMeta);
      trigger.kill();
      introCtx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full" style={{ minHeight: "240vh", background: "var(--color-graphite)" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/video4section2-scrub.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 1 }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(2,16,36,0.6) 0%, rgba(2,16,36,0.85) 70%, rgba(2,16,36,0.95) 100%)" }}
        />

        <div className="relative z-10 flex h-full items-center px-8 md:px-14">
          <div ref={contentRef} className="max-w-2xl">
            <p className="text-xs tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: "#7da0ca" }}>
              THE PINNACLE OF MOTORSPORT
            </p>
            <h2
              className="mt-4"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                lineHeight: 0.95,
                color: "#ffffff",
              }}
            >
              WHAT IS<br />
              <span style={{ color: "#c1e8ff" }}>FORMULA 1?</span>
            </h2>
            <div className="mt-5 h-1 w-16" style={{ background: "var(--color-red)" }} />
            <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.85)" }}>
              Formula 1 is the highest class of international open-wheel racing, where the world&apos;s best drivers push machines engineered at the edge of physics around some of the most demanding circuits on the planet.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="rounded-lg p-4" style={{ background: "rgba(1,8,23,0.4)", border: "1px solid rgba(193,232,255,0.16)" }}>
                  <strong className="block text-2xl" style={{ fontFamily: "var(--font-display)", color: "#c1e8ff" }}>{stat.value}</strong>
                  <span className="mt-1 block text-[10px] tracking-[0.15em]" style={{ fontFamily: "var(--font-technical)", color: "#7da0ca" }}>{stat.label}</span>
                </div>
              ))}
            </div>

            <a
              href="https://en.wikipedia.org/wiki/Formula_One"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex w-fit items-center gap-3 rounded-full px-6 py-3 text-xs tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "rgba(193,232,255,0.08)", border: "1px solid rgba(193,232,255,0.3)", color: "#c1e8ff", fontFamily: "var(--font-technical)" }}
            >
              NEW TO F1? LEARN THE BASICS
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <div className="flex max-w-xs flex-col gap-10 pr-4">
              {REVEAL_STEPS.map((step, i) => (
                <div key={step.label} ref={(el) => (revealRefs.current[i] = el)} style={{ opacity: 0, transform: "translateY(18px)" }}>
                  <span className="text-[10px] tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: "#e10600" }}>{step.label}</span>
                  <h3 className="mt-2 text-lg tracking-[0.1em]" style={{ fontFamily: "var(--font-technical)", color: "#ffffff" }}>{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "#7da0ca" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}