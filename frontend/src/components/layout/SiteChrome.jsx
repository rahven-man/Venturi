"use client";

import { useEffect, useState } from "react";
import HeroNavigation from "@/components/hero/HeroNavigation";
import HeroScrollCue from "@/components/hero/HeroScrollCue";

export default function SiteChrome({ activeIndex = 0, total = 5 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 hidden pointer-events-none md:block">
      <div
        className="absolute top-0 inset-x-0 pointer-events-none"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        <HeroNavigation />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s",
        }}
      >
        <HeroScrollCue activeIndex={activeIndex} total={total} />
      </div>
    </div>
  );
}