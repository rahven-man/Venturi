"use client";

import { useEffect, useRef, useState } from "react";
import SiteChrome from "@/components/layout/SiteChrome";
import SectionTransition from "@/components/layout/SectionTransition";
import HeroSection from "@/components/hero/HeroSection";
import WhatIsF1Section from "@/components/whatIsF1/WhatIsF1Section";
import IntelligenceSection from "@/components/intelligence/IntelligenceSection";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";
import AboutSection from "@/components/about/AboutSection";

const SECTIONS = [HeroSection, WhatIsF1Section, IntelligenceSection, AnalyticsSection, AboutSection];

const BOUNDARY_CONFIG = [
  { topColor: "#0b0c0e", bottomColor: "#021024", sectorCode: "SYS.TEL // 01 · MOTORSPORT" },
  { topColor: "#021024", bottomColor: "#021024", sectorCode: "SYS.TEL // 02 · INTELLIGENCE" },
  { topColor: "#021024", bottomColor: "#021024", sectorCode: "SYS.TEL // 03 · ANALYTICS" },
  { topColor: "#052659", bottomColor: "#021024", sectorCode: "SYS.TEL // 04 · ARCHIVE" },
];

export default function Home() {
  const sectionRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return (
    <main>
      <SiteChrome activeIndex={activeIndex} total={SECTIONS.length} />
      {SECTIONS.map((Section, i) => (
        <div key={i} ref={(el) => (sectionRefs.current[i] = el)} className="relative">
          <Section />
          {i < SECTIONS.length - 1 && (
            <SectionTransition
              topColor={BOUNDARY_CONFIG[i].topColor}
              bottomColor={BOUNDARY_CONFIG[i].bottomColor}
              sectorCode={BOUNDARY_CONFIG[i].sectorCode}
              position="bottom"
            />
          )}
        </div>
      ))}
    </main>
  );
}