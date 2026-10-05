import { SiteFooter } from "@/components/shared/site-footer";
import { AboutHeroSection } from "@/features/marketing/components/about-hero-section";
import { AboutMissionSection } from "@/features/marketing/components/about-mission-section";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AboutHeroSection />
      <AboutMissionSection />
      <SiteFooter />
    </div>
  );
}
