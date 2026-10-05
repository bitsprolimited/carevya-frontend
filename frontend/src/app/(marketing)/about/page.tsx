import { SiteFooter } from "@/components/shared/site-footer";
import { AboutCoreValuesSection } from "@/features/marketing/components/about-core-values-section";
import { AboutHeroSection } from "@/features/marketing/components/about-hero-section";
import { AboutMembersSection } from "@/features/marketing/components/about-members-section";
import { AboutMissionSection } from "@/features/marketing/components/about-mission-section";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AboutHeroSection />
      <AboutMissionSection />
      <AboutCoreValuesSection />
      <AboutMembersSection />
      <SiteFooter />
    </div>
  );
}
