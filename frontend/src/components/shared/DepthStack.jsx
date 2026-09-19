"use client";

import { useEffect, useRef } from "react";

export default function DepthStack({ children }) {
  const cardRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let rafId;

    function update() {
      const cards = cardRefs.current.filter(Boolean);
      for (let i = 0; i < cards.length - 1; i++) {
        const current = cards[i];
        const next = cards[i + 1];
        const currentRect = current.getBoundingClientRect();
        const nextRect = next.getBoundingClientRect();
        const overlap = currentRect.bottom - nextRect.top;
        const progress = Math.max(0, Math.min(1, overlap / currentRect.height));
        current.style.transform = `scale(${1 - progress * 0.05})`;
        current.style.filter = `brightness(${1 - progress * 0.4})`;
      }
      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [children]);

  return (
    <div>
      {children.map((child, i) => {
        const isLast = i === children.length - 1;
        return (
          <div key={i} style={{ position: "relative", marginBottom: isLast ? 0 : "10vh" }}>
            <div
              ref={(el) => (cardRefs.current[i] = el)}
              className="sticky will-change-transform overflow-hidden"
              style={{
                top: `${16 + i * 16}px`,
                zIndex: i + 1,
                borderRadius: "12px",
                border: "1px solid rgba(193,232,255,0.12)",
                transformOrigin: "center top",
                background: "rgba(10,17,32,0.4)",
              }}
            >
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );
}