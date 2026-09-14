"use client";

import { Syne } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  weight: "800",
});

export default function HeroWordmark() {
  return (
    <div className="relative w-full flex items-center justify-center px-6 md:px-10 select-none pointer-events-none">
      <div className="relative w-full max-w-[1500px] grid grid-cols-2 items-center">

        {/* =========================================================
            LEFT — RAHVEN'S
            ========================================================= */}
        <div className="relative flex justify-end pr-5 md:pr-25">
          <div className="relative max-w-full overflow-visible">
            <span
              data-anim="wordmark"
              className={`${syne.className} block whitespace-nowrap uppercase`}
              style={{
                fontSize: "clamp(2.4rem, 4.2vw, 5rem)",
                fontWeight: 800,
                fontStyle: "italic",
                letterSpacing: "-0.06em",
                lineHeight: 0.9,
                color: "#071522",
                transform: "skewX(-5deg)",
                transformOrigin: "right center",
              }}
            >
              RAHVEN'S
            </span>
          </div>
        </div>

        {/* =========================================================
            RIGHT — VENTURI
            ========================================================= */}
        <div className="relative flex justify-start pl-5 md:pl-7 min-w-0">
          <div className="relative max-w-full min-w-0">

            <span
              data-anim="wordmark"
              className={`${syne.className} block whitespace-nowrap uppercase`}
              style={{
                fontSize: "clamp(3.2rem, 6.2vw, 8rem)",
                fontWeight: 800,
                fontStyle: "italic",
                letterSpacing: "-0.085em",
                lineHeight: 0.82,
                color: "#EAF4FA",
                transform: "skewX(-5deg)",
                transformOrigin: "left center",
                textShadow: "0 2px 10px rgba(0,0,0,0.22)",
              }}
            >
              VENTURI
            </span>

            {/* Very subtle animation layer.
                This exists for HeroSection's GSAP wordmark-sweep
                animation, but does NOT create a horizontal line. */}
            <span
              data-anim="wordmark-sweep"
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.04) 46%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.04) 54%, transparent 62%)",
                backgroundSize: "240% 100%",
                backgroundPosition: "-120% 0",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                mixBlendMode: "screen",
              }}
            >
              VENTURI
            </span>

            {/* Red identity accent */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "4%",
                bottom: "-14px",
                width: "48px",
                height: "4px",
                background: "#E10600",
                transform: "skewX(-18deg)",
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}