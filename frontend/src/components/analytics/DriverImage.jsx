"use client";

import { useState } from "react";

// Now takes an EXPLICIT filename (with extension) instead of guessing
// one from the driver's name - the curated registry already knows the
// exact file. Still falls back gracefully if that exact file 404s.

export default function DriverImage({ filename, alt, className, style }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.3rem",
            color: "rgba(193,232,255,0.35)",
            padding: "1.5rem",
          }}
        >
          {alt}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/DriversImage/${filename}`}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      style={style}
    />
  );
}