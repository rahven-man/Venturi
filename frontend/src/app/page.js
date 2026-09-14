import HeroSection from "@/components/hero/HeroSection";
import ExploreSection from "@/components/explore/ExploreSection";
import IntelligenceSection from "@/components/intelligence/IntelligenceSection";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";
import AboutSection from "@/components/about/AboutSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ExploreSection />
      <IntelligenceSection />
      <AnalyticsSection />
      <AboutSection />
    </main>
  );
}