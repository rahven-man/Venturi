"use client";

import Image from "next/image";
import Link from "next/link";
import useCardTilt from "@/hooks/useCardTilt";

export default function ExploreCard({
  index,
  label,
  descriptor,
  description,
  tags,
  ctaLabel,
  href,
  image,
  imageAlt,
}) {
  const { cardRef, imageRef, handleMouseMove, handleMouseLeave } = useCardTilt();

  return (
    <div data-anim="explore-card" style={{ perspective: "1400px" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex flex-col transition-transform duration-200 ease-out will-change-transform"
        style={{
          width: "100%",
          background: "var(--color-card-surface)",
          border: "1px solid var(--color-card-border)",
          borderRadius: "6px",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex items-center justify-between px-7 pt-6 pb-4">
          <span
            className="text-xs tracking-[0.3em]"
            style={{ fontFamily: "var(--font-technical)", color: "var(--color-card-label)" }}
          >
            0{index} / {label.toUpperCase()}
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--color-red)" }}
          />
        </div>

        <div className="mx-7" style={{ perspective: "800px" }}>
          <div
            ref={imageRef}
            className="relative aspect-[16/8] overflow-hidden rounded-sm transition-transform duration-200 ease-out will-change-transform"
            style={{ border: "1px solid var(--color-card-border)", transformStyle: "preserve-3d" }}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 360px, (max-width: 1024px) 30vw, 520px"
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, transparent 60%, rgba(10,17,32,0.4) 100%)",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 px-7 py-6 flex-1">
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1.75rem",
              color: "var(--color-card-heading)",
            }}
          >
            {label}
          </h3>
          <span
            className="text-xs tracking-[0.2em]"
            style={{ fontFamily: "var(--font-technical)", color: "var(--color-card-heading)" }}
          >
            {descriptor}
          </span>
          <p
            className="text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-card-text)" }}
          >
            {description}
          </p>

          <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            {tags.map((tag) => (
              <li
                key={tag}
                className="text-[11px] tracking-[0.15em]"
                style={{ fontFamily: "var(--font-technical)", color: "var(--color-card-label)" }}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={href}
          className="group/cta relative flex items-center justify-between px-7 py-4 text-sm tracking-[0.1em] overflow-hidden"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            color: "var(--color-card-heading)",
            borderTop: "1px solid var(--color-card-border)",
          }}
        >
          <span
            className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover/cta:scale-x-100"
            style={{ background: "var(--color-red)" }}
          />
          <span className="relative z-10 transition-colors duration-300 group-hover/cta:text-white">
            {ctaLabel}
          </span>
          <span
            className="relative z-10 transition-all duration-300 group-hover/cta:translate-x-1 group-hover/cta:text-white"
            style={{ color: "var(--color-red)" }}
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}