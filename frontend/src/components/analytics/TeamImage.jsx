"use client";

import { useState } from "react";

export default function TeamImage({ filename, alt, className, style }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className={className} style={{ ...style, background: "rgba(2,16,36,0.35)" }} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/TeamsImage/${filename}`}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      style={style}
    />
  );
}
