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

const THOUGHTS = [
  "Maybe it's the feeling of understanding something that once looked impossible to understand.",
  "Maybe it's the obsession with asking one more question after everyone else has accepted the answer.",
  "Maybe it's simply the joy of building something that didn't exist before.",
];

// Progress bands across the pinned scroll (0 -> 1)
const DIALOGUE = { inStart: 0.02, inEnd: 0.12, outStart: 0.66, outEnd: 0.78 };
const THOUGHT_BANDS = [
  { inStart: 0.1, inEnd: 0.18, outStart: 0.26, outEnd: 0.3 },
  { inStart: 0.28, inEnd: 0.36, outStart: 0.44, outEnd: 0.48 },
  { inStart: 0.46, inEnd: 0.54, outStart: 0.62, outEnd: 0.66 },
];
const FINAL = { inStart: 0.74, inEnd: 0.88 };

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function Words({ text, refsArray }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          ref={(el) => (refsArray.current[i] = el)}
          style={{ display: "inline-block", opacity: 0, filter: "blur(6px)", transform: "translateY(10px)" }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

export default function AboutSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const dialogueRef = useRef(null);
  const thoughtWrapRefs = useRef([]);
  const thoughtWordRefs = useRef(THOUGHTS.map(() => ({ current: [] })));
  const finalRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(dialogueRef.current, { opacity: 1, y: 0 });
      gsap.set(finalRef.current, { opacity: 1, y: 0 });
      thoughtWrapRefs.current.forEach((el, i) => gsap.set(el, { opacity: i === 2 ? 1 : 0 }));
      thoughtWordRefs.current.forEach((wordsRef) => {
        wordsRef.current.forEach((el) => el && gsap.set(el, { opacity: 1, filter: "blur(0px)", y: 0 }));
      });
      return;
    }

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

    function apply() {
      const p = currentProgress;

      if (videoReady && video.duration) {
        video.currentTime = p * video.duration;
      }

      // Dialogue + RAHVEN block: enter, hold, exit upward
      const dEnter = clamp01((p - DIALOGUE.inStart) / (DIALOGUE.inEnd - DIALOGUE.inStart));
      const dExit = clamp01((p - DIALOGUE.outStart) / (DIALOGUE.outEnd - DIALOGUE.outStart));
      const dOpacity = dEnter * (1 - dExit);
      const dY = (1 - dEnter) * 24 - dExit * 48;
      if (dialogueRef.current) {
        dialogueRef.current.style.opacity = dOpacity;
        dialogueRef.current.style.transform = `translateY(${dY}px)`;
        dialogueRef.current.style.pointerEvents = dOpacity > 0.05 ? "auto" : "none";
      }

      // Three thoughts: word-by-word build in the same slot
      THOUGHT_BANDS.forEach((band, i) => {
        const wrapEl = thoughtWrapRefs.current[i];
        const words = thoughtWordRefs.current[i].current;
        if (!wrapEl || !words) return;

        const enter = clamp01((p - band.inStart) / (band.inEnd - band.inStart));
        const exit = clamp01((p - band.outStart) / (band.outEnd - band.outStart));
        wrapEl.style.opacity = 1 - exit;

        const n = words.length;
        words.forEach((el, wi) => {
          if (!el) return;
          const wordEnter = clamp01(enter * n - wi);
          el.style.opacity = wordEnter;
          el.style.filter = `blur(${(1 - wordEnter) * 6}px)`;
          el.style.transform = `translateY(${(1 - wordEnter) * 10}px)`;
        });
      });

      // Final block: Let's Talk + VENTURI signature + note
      const fEnter = clamp01((p - FINAL.inStart) / (FINAL.inEnd - FINAL.inStart));
      if (finalRef.current) {
        finalRef.current.style.opacity = fEnter;
        finalRef.current.style.transform = `translateY(${(1 - fEnter) * 32}px)`;
        finalRef.current.style.pointerEvents = fEnter > 0.05 ? "auto" : "none";
      }

      currentProgress += (targetProgress - currentProgress) * 0.18;
      rafId = requestAnimationFrame(apply);
    }
    rafId = requestAnimationFrame(apply);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", onMeta);
      trigger.kill();
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative w-full" style={{ minHeight: "550vh", background: "var(--color-about-surface)" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/AboutVideo-scrub.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.8 }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(160deg, rgba(2,16,36,0.75) 0%, rgba(5,38,89,0.55) 55%, rgba(2,16,36,0.85) 100%)" }}
        />

        <div className="absolute left-0 top-8 z-10 flex items-center gap-3 px-8 md:px-14">
          <span className="text-xs tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: "var(--color-red)" }}>05 / 05</span>
          <span className="h-px w-8" style={{ background: "var(--color-border)" }} />
          <span className="text-xs tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: "var(--color-palette-sky)" }}>ABOUT VENTURI</span>
        </div>

        {/* Dialogue + RAHVEN, locked in place, thoughts crossfade below it */}
        <div ref={dialogueRef} className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-8 md:px-16" style={{ opacity: 0 }}>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-y-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <p className="mb-4 text-xs tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: "var(--color-red)" }}>THE QUESTION</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.7rem, 3vw, 2.8rem)", lineHeight: 1.15, color: "var(--color-palette-ice)" }}>
                IT&apos;S NOT ABOUT THE MONEY.
              </h2>
              <h2 className="mt-2" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.7rem, 3vw, 2.8rem)", lineHeight: 1.15, color: "var(--color-red)" }}>
                SO WHAT IS IT ABOUT?
              </h2>
            </div>

            <div className="relative lg:col-span-5 lg:col-start-8 lg:text-right">
              <span
                className="pointer-events-none absolute -top-10 right-0 select-none"
                style={{ fontFamily: "var(--font-serif)", fontSize: "8rem", color: "rgba(193,232,255,0.08)", lineHeight: 1 }}
              >
                &rdquo;
              </span>
              <TextScramble
                text="RAHVEN"
                trigger="in-view"
                charset="symbols"
                speed={75}
                spread={38}
                style={{
                  fontFamily: "var(--font-ranade)",
                  fontWeight: 700,
                  fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: "var(--color-palette-ice)",
                }}
              />
              <div className="relative mt-4">
                <p className="text-xs tracking-[0.2em]" style={{ fontFamily: "var(--font-technical)", color: "var(--color-palette-sky)" }}>INDEPENDENT BUILDER</p>
                <p className="mt-1 text-xs tracking-[0.2em]" style={{ fontFamily: "var(--font-technical)", color: "var(--color-palette-sky)" }}>DATA • ENGINEERING • EXPERIMENTATION</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-16 max-w-4xl" style={{ height: "8rem" }}>
            <span
              className="pointer-events-none absolute -left-6 -top-8 select-none"
              style={{ fontFamily: "var(--font-serif)", fontSize: "7rem", color: "rgba(225,6,0,0.1)", lineHeight: 1 }}
            >
              &ldquo;
            </span>
            {THOUGHTS.map((thought, i) => (
              <p
                key={i}
                ref={(el) => (thoughtWrapRefs.current[i] = el)}
                className="relative absolute inset-x-0 top-0"
                style={{
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "clamp(1.15rem, 2.1vw, 1.7rem)",
                  lineHeight: 1.55,
                  color: "var(--color-palette-ice)",
                  opacity: 0,
                }}
              >
                <Words text={thought} refsArray={thoughtWordRefs.current[i]} />
              </p>
            ))}
          </div>
        </div>

        {/* Let's Talk + VENTURI signature + note, fades in as dialogue unlocks away */}
        <div ref={finalRef} className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-8 md:px-14" style={{ opacity: 0 }}>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(2.4rem, 4.4vw, 3.8rem)", color: "var(--color-palette-ice)" }}>
                  LET&apos;S TALK.
                </h3>
                <p className="mt-4 max-w-sm text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--color-palette-sky)" }}>
                  If you found something interesting, I&apos;d love to hear what you think.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-8">
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
                      style={{ fontFamily: "var(--font-technical)", color: "var(--color-palette-ice)" }}
                    >
                      {link.label} →
                      <span className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ background: "var(--color-red)" }} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 lg:col-start-8 lg:text-right">
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(3.2rem, 6.5vw, 5.5rem)", letterSpacing: "-0.01em", color: "var(--color-palette-ice)" }}>
                  VENTURI
                </p>
                <p className="mt-3 text-xs tracking-[0.25em]" style={{ fontFamily: "var(--font-technical)", color: "var(--color-palette-sky)" }}>
                  ENGINEERING INTELLIGENCE — FORMULA ONE
                </p>
                <p className="mt-2 text-xs tracking-[0.15em]" style={{ fontFamily: "var(--font-technical)", color: "var(--color-palette-sky)" }}>
                  BUILT BY RAHVEN · 2026
                </p>
              </div>
            </div>

            <div className="mt-16 border-t pt-8" style={{ borderColor: "var(--color-paletted-sky)" }}>
              <p className="mb-8 text-xs tracking-[0.4em]" style={{ fontFamily: "var(--font-technical)", color: "var(--color-steel)" }}>A NOTE FROM THE BUILDER</p>
              <p className="max-w-3xl text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--color-palette-sky)" }}>
                VENTURI is an independent undergraduate project. The models, datasets and analytical outputs are
                experimental and may contain errors, anomalies or limitations. They are intended for exploration
                and engineering learning — not as authoritative race information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}