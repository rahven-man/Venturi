"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextScramble from "@/components/shared/TextScramble";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GITHUB_URL = "https://github.com/rahven-man/Venturi";
const LINKEDIN_URL = "https://www.linkedin.com/in/abdur-rahman-ab506829a";
const EMAIL = "rahman3730h@gmail.com";

function revealOnScroll(selector, opts = {}) {
  gsap.set(selector, { opacity: 0, y: opts.y ?? 24 });
  ScrollTrigger.create({
    trigger: selector,
    start: opts.start ?? "top 80%",
    toggleActions: "restart none none reverse",
    animation: gsap.to(selector, {
      opacity: 1,
      y: 0,
      duration: opts.duration ?? 0.8,
      ease: "power3.out",
      delay: opts.delay ?? 0,
    }),
  });
}

export default function AboutSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          "[data-anim='about-eyebrow'], [data-anim='about-line1'], [data-anim='about-line2'], [data-anim='about-descriptor'], [data-anim='thought'], [data-anim='about-final'], [data-anim='about-note'], [data-anim='about-contact'], [data-anim='about-signature']",
          { opacity: 1, y: 0 }
        );
        return;
      }

      revealOnScroll("[data-anim='about-eyebrow']", { y: -8, duration: 0.6, start: "top 85%" });
      revealOnScroll("[data-anim='about-line1']", { start: "top 85%", delay: 0.1 });
      revealOnScroll("[data-anim='about-line2']", { start: "top 85%", delay: 0.3 });
      revealOnScroll("[data-anim='about-descriptor']", { start: "top 80%", delay: 1.6, duration: 0.6 });

      gsap.utils.toArray("[data-anim='thought']").forEach((el) => {
        gsap.set(el, { opacity: 0, y: 30 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 78%",
          toggleActions: "restart none none reverse",
          animation: gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }),
        });
      });

      revealOnScroll("[data-anim='about-final']", { start: "top 78%", duration: 0.9 });
      revealOnScroll("[data-anim='about-contact']", { start: "top 80%", duration: 0.8 });
      revealOnScroll("[data-anim='about-signature']", { start: "top 80%", duration: 0.8, delay: 0.15 });
      revealOnScroll("[data-anim='about-note']", { start: "top 85%", duration: 0.7 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-32 px-8 md:px-14"
      style={{ background: "var(--color-graphite)" }}
    >
      {/* ---------- 05/05 marker ---------- */}
      <div data-anim="about-eyebrow" className="mb-16 flex items-center gap-3">
        <span
          className="text-xs tracking-[0.3em]"
          style={{ fontFamily: "var(--font-technical)", color: "var(--color-red)" }}
        >
          05 / 05
        </span>
        <span className="h-px w-8" style={{ background: "var(--color-border)" }} />
        <span
          className="text-xs tracking-[0.3em]"
          style={{ fontFamily: "var(--font-technical)", color: "var(--color-grey)" }}
        >
          ABOUT VENTURI
        </span>
      </div>

      {/* ---------- FIRST VIEWPORT: dialogue (left) + RAHVEN (right) ---------- */}
      <div className="grid lg:grid-cols-2 gap-y-16 gap-x-10 items-center mb-40">
        <div>
          <h2
            data-anim="about-line1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.25rem, 4vw, 4rem)",
              lineHeight: 1.15,
              color: "var(--color-offwhite)",
            }}
          >
            IT&apos;S NOT ABOUT THE MONEY.
          </h2>
          <h2
            data-anim="about-line2"
            className="mt-3"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.25rem, 4vw, 4rem)",
              lineHeight: 1.15,
              color: "var(--color-red)",
            }}
          >
            SO WHAT IS IT ABOUT?
          </h2>
        </div>

        <div className="lg:pl-6">
          <TextScramble
            text="RAHVEN"
            trigger="in-view"
            charset="symbols"
            speed={32}
            spread={16}
            style={{
              fontFamily: "var(--font-ranade)",
              fontWeight: 700,
              fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              color: "var(--color-offwhite)",
            }}
          />

          <div data-anim="about-descriptor" className="mt-5">
            <p
              className="text-xs tracking-[0.2em]"
              style={{ fontFamily: "var(--font-technical)", color: "var(--color-grey)" }}
            >
              INDEPENDENT BUILDER
            </p>
            <p
              className="text-xs tracking-[0.2em] mt-1"
              style={{ fontFamily: "var(--font-technical)", color: "var(--color-grey)" }}
            >
              DATA • ENGINEERING • EXPERIMENTATION
            </p>
          </div>
        </div>
      </div>

      {/* ---------- THREE THOUGHTS ---------- */}
      {/* Full width, same left edge as the dialogue above (section's own
          px-8 md:px-14 padding) - wraps naturally instead of being forced
          into a narrow centered column. */}
      <div className="flex flex-col gap-16 mb-32">
        <p
          data-anim="thought"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)",
            lineHeight: 1.5,
            color: "var(--color-offwhite)",
          }}
        >
          Maybe it&apos;s the feeling of understanding something that once
          looked impossible to understand.
        </p>

        <p
          data-anim="thought"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)",
            lineHeight: 1.5,
            color: "var(--color-offwhite)",
          }}
        >
          Maybe it&apos;s the obsession with asking one more question after
          everyone else has accepted the answer.
        </p>

        <p
          data-anim="thought"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)",
            lineHeight: 1.5,
            color: "var(--color-offwhite)",
          }}
        >
          Maybe it&apos;s simply the joy of building something that
          didn&apos;t exist before.
        </p>
      </div>

      {/* ---------- FINAL EMOTIONAL STATEMENT ---------- */}
      <div data-anim="about-final" className="mb-40">
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(1.8rem, 3.2vw, 2.75rem)",
            lineHeight: 1.3,
            color: "var(--color-grey)",
          }}
        >
          THAT&apos;S WHAT{" "}
          <span style={{ color: "var(--color-red)" }}>VENTURI</span> BECAME.
        </p>
      </div>

      {/* ---------- LET'S TALK (left) + VENTURI SIGNATURE (right) ---------- */}
      <div className="grid lg:grid-cols-2 gap-y-16 gap-x-10 items-center mb-25 pt-20" style={{ borderTop: "10px solid var(--color-border)" }}>
        <div data-anim="about-contact">
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              color: "var(--color-offwhite)",
            }}
          >
            LET&apos;S TALK.
          </h3>
          <p
            className="mt-3 text-sm max-w-sm"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-grey)" }}
          >
            If you found something interesting, I&apos;d love to hear what
            you think.
          </p>

          <div className="mt-8 flex items-center gap-8 flex-wrap">
            {[
              { label: "EMAIL", href: `mailto:${EMAIL}` },
              { label: "GITHUB", href: GITHUB_URL },
              { label: "LINKEDIN", href: LINKEDIN_URL },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== "EMAIL" ? "_blank" : undefined}
                rel={link.label !== "EMAIL" ? "noopener noreferrer" : undefined}
                className="group relative text-sm tracking-[0.15em] transition-colors duration-300"
                style={{ fontFamily: "var(--font-technical)", color: "var(--color-offwhite)" }}
              >
                {link.label} →
                <span
                  className="absolute left-0 right-0 -bottom-1 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{ background: "var(--color-red)" }}
                />
              </a>
            ))}
          </div>
        </div>

        <div data-anim="about-signature" className="lg:text-right">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              letterSpacing: "-0.01em",
              color: "var(--color-slate)",
            }}
          >
            VENTURI
          </p>
          <p
            className="mt-3 text-xs tracking-[0.25em]"
            style={{ fontFamily: "var(--font-technical)", color: "var(--color-grey)" }}
          >
            ENGINEERING INTELLIGENCE — FORMULA ONE
          </p>
          <p
            className="mt-2 text-xs tracking-[0.15em]"
            style={{ fontFamily: "var(--font-technical)", color: "var(--color-border)" }}
          >
            BUILT BY RAHVEN · 2026
          </p>
        </div>
      </div>

      {/* ---------- NOTE FROM THE BUILDER (very last, full width) ---------- */}
      <div
        data-anim="about-note"
        className="pt-10"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <p
          className="text-xs tracking-[0.2em] mb-4"
          style={{ fontFamily: "var(--font-technical)", color: "var(--color-steel)" }}
        >
          A NOTE FROM THE BUILDER
        </p>
        <p
          className="text-sm leading-relaxed max-w-3xl"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-grey)" }}
        >
          VENTURI is an independent undergraduate project. The models,
          datasets and analytical outputs are experimental and may contain
          errors, anomalies or limitations. They are intended for
          exploration and engineering learning — not as authoritative race
          information.
        </p>
      </div>
    </section>
  );
}