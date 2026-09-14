"use client";

import { useState } from "react";

// Local driver photos live in /public/images/DriversImages/ as
// "First-Last.ext" (avif or png), with mixed backgrounds. This tries each
// extension in turn via onError, and falls back to a typographic
// placeholder if neither exists - so a missing photo never shows a
// broken-image icon.

const EXTENSIONS = ["avif", "png"];

function slugify(fullName) {
  return fullName.trim().split(/\s+/).join("-");
}

export default function DriverImage({ fullName, className }) {
  const slug = slugify(fullName);
  const [attempt, setAttempt] = useState(0);

  if (attempt >= EXTENSIONS.length) {
    return (
      <div
        className={`flex items-end justify-end ${className ?? ""}`}
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <span
          className="pr-6 pb-6 text-right"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.4rem",
            color: "rgba(242,242,239,0.3)",
          }}
        >
          {fullName}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/DriversImages/${slug}.${EXTENSIONS[attempt]}`}
      alt={fullName}
      loading="lazy"
      onError={() => setAttempt((a) => a + 1)}
      className={className}
    />
  );
}