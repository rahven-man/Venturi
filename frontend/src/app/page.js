"use client";

import { useEffect, useRef, useState } from "react";
import SiteChrome from "@/components/layout/SiteChrome";
import HeroSection from "@/components/hero/HeroSection";
import WhatIsF1Section from "@/components/whatIsF1/WhatIsF1Section";
import IntelligenceSection from "@/components/intelligence/IntelligenceSection";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";
import AboutSection from "@/components/about/AboutSection";

const SECTIONS = [HeroSection, WhatIsF1Section, IntelligenceSection, AnalyticsSection, AboutSection];

export default function Home() {
  const sectionRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observers = sectionRefs.current.map((el, i) => {
      if (!el) return null;
      const io = new IntersectionObserver(
        (entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActiveIndex(i); }),
        { threshold: 0.5 }
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach((io) => io && io.disconnect());
  }, []);

  return (
    <main>
      <SiteChrome activeIndex={activeIndex} total={SECTIONS.length} />
      {SECTIONS.map((Section, i) => (
        <div key={i} ref={(el) => (sectionRefs.current[i] = el)}>
          <Section />
        </div>
      ))}
    </main>
  );
}