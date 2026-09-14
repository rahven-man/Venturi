"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Reusable flexGrow-based image accordion (GodUI mechanics, adapted to
// plain JSX + VENTURI's design tokens). Only one panel is "active"
// (expanded) at a time - hover/focus changes which one, and leaving the
// whole accordion resets to defaultIndex.

export default function ImageAccordion({
  panels,
  defaultIndex = 0,
  activeGrow = 3.5,
  height = "62vh",
}) {
  const [active, setActive] = useState(defaultIndex);

  return (
    <div
      className="flex flex-col gap-2 overflow-hidden sm:flex-row"
      style={{ height }}
      onPointerLeave={() => setActive(defaultIndex)}
    >
      {panels.map((panel, i) => {
        const isActive = i === active;

        return (
          <div
            key={panel.title}
            role="button"
            tabIndex={0}
            data-active={isActive}
            aria-expanded={isActive}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setActive(i);
            }}
            className="group relative block min-h-[3rem] min-w-0 cursor-pointer overflow-hidden [transition:flex-grow_550ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none motion-reduce:transition-none sm:min-h-0 sm:min-w-[3rem]"
            style={{
              flexGrow: isActive ? activeGrow : 1,
              flexBasis: 0,
              borderRadius: "10px",
              border: "1px solid var(--color-border)",
            }}
          >
            <Image
              src={panel.image}
              alt={panel.title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover scale-105 brightness-90 saturate-[0.55] [transition:transform_700ms_ease,filter_550ms_ease] group-data-[active=true]:scale-100 group-data-[active=true]:brightness-100 group-data-[active=true]:saturate-100"
            />

            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(0deg, rgba(11,12,14,0.85) 0%, rgba(11,12,14,0.15) 55%, transparent 80%)",
              }}
            />

            {/* Collapsed vertical label */}
            <span
              className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap [writing-mode:vertical-rl] rotate-180 [transition:opacity_300ms_ease] group-data-[active=true]:opacity-0"
              style={{
                fontFamily: "var(--font-technical)",
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                color: "var(--color-offwhite)",
                opacity: 0.75,
              }}
            >
              {panel.title}
            </span>

            {/* Expanded content - only visible when this panel is active */}
            <div className="absolute inset-x-0 bottom-0 p-8 [transform:translateY(14px)] opacity-0 [transition:opacity_400ms_ease,transform_500ms_ease] group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100">
              <span
                aria-hidden
                className="block h-px w-10 origin-left scale-x-0 [transition:transform_500ms_ease_120ms] group-data-[active=true]:scale-x-100"
                style={{ background: "var(--color-red)" }}
              />

              <h3
                className="mt-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1.6rem",
                  color: "var(--color-offwhite)",
                }}
              >
                {panel.title}
              </h3>

              {panel.description && (
                <p
                  className="mt-2 max-w-sm text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-grey)" }}
                >
                  {panel.description}
                </p>
              )}

              {panel.tags && (
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                  {panel.tags.map((tag) => (
                    <li
                      key={tag}
                      className="text-[11px] tracking-[0.15em]"
                      style={{ fontFamily: "var(--font-technical)", color: "var(--color-steel)" }}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

               {panel.href && (
                <Link
                  href={panel.href}
                  onClick={(e) => e.stopPropagation()}
                  className="group/cta relative mt-6 inline-flex items-center gap-2 overflow-hidden px-4 py-2 text-sm tracking-[0.1em]"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    color: "var(--color-offwhite)",
                    border: "1px solid rgba(242,242,239,0.25)",
                  }}
                >
                  <span
                    className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover/cta:scale-x-100"
                    style={{ background: "var(--color-red)" }}
                  />
                  <span className="relative z-10 transition-colors duration-300 group-hover/cta:text-white">
                    {panel.ctaLabel}
                  </span>
                  <span
                    className="relative z-10 transition-all duration-300 group-hover/cta:translate-x-1 group-hover/cta:text-white"
                    style={{ color: "var(--color-red)" }}
                  >
                    →
                  </span>
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}