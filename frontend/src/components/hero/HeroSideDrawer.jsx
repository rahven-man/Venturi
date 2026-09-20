"use client";

import { useState } from "react";
import Link from "next/link";

const ITEMS = [
  { label: "METHODOLOGY", desc: "How the models were built", href: "/methodology" },
  { label: "LEGAL & ATTRIBUTION", desc: "Fair use, disclaimer, credits", href: "/legal" },
];

export default function HeroSideDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group fixed right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2 rounded-l-lg px-2 py-5 transition-all duration-300 hover:pr-3"
        style={{ background: "rgba(2,16,36,0.6)", border: "1px solid rgba(193,232,255,0.2)", borderRight: "none", backdropFilter: "blur(6px)" }}
        aria-label="Open info panel"
      >
        <span
          className="text-[10px] tracking-[0.25em] [writing-mode:vertical-rl]"
          style={{ fontFamily: "var(--font-technical)", color: "rgba(255,255,255,0.75)" }}
        >
          INFO
        </span>
        <span className="h-1.5 w-1.5 rounded-full transition-shadow duration-300 group-hover:shadow-[0_0_8px_rgba(225,6,0,0.8)]" style={{ background: "var(--color-red)" }} />
      </button>

      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{ pointerEvents: open ? "auto" : "none", opacity: open ? 1 : 0 }}
        onClick={() => setOpen(false)}
      >
        <div className="absolute inset-0" style={{ background: "rgba(2,6,14,0.6)" }} />

        <div
          className="absolute right-0 top-0 h-full w-full max-w-sm p-8 transition-transform duration-400 ease-out"
          style={{
            background: "linear-gradient(160deg, #052659 0%, #021024 100%)",
            borderLeft: "1px solid rgba(193,232,255,0.2)",
            transform: open ? "translateX(0)" : "translateX(100%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setOpen(false)}
            className="mb-10 text-xs tracking-[0.25em] transition-colors duration-200 hover:text-white"
            style={{ fontFamily: "var(--font-technical)", color: "#7da0ca" }}
          >
            ✕ CLOSE
          </button>

          <p className="text-[10px] tracking-[0.3em]" style={{ fontFamily: "var(--font-technical)", color: "#e10600" }}>
            PROJECT INFORMATION
          </p>

          <div className="mt-6 flex flex-col gap-1">
            {ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group rounded-lg px-4 py-5 transition-colors duration-200 hover:bg-white/[0.05]"
              >
                <span className="block text-lg tracking-[0.05em]" style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "#ffffff" }}>
                  {item.label}
                </span>
                <span className="mt-1 block text-xs" style={{ fontFamily: "var(--font-body)", color: "#7da0ca" }}>
                  {item.desc}
                </span>
                <span className="mt-2 block h-px w-8 origin-left scale-x-100 transition-all duration-300 group-hover:w-16" style={{ background: "var(--color-red)" }} />
              </Link>
            ))}
          </div>

          <p className="mt-16 text-[10px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "rgba(125,160,202,0.6)" }}>
            VENTURI is a non-commercial student project. See Legal & Attribution for full disclosure.
          </p>
        </div>
      </div>
    </>
  );
}