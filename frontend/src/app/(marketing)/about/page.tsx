import { SiteFooter } from "@/components/shared/site-footer";
import { Reveal } from "@/components/shared/reveal";
import { AboutCoreValuesSection } from "@/features/marketing/components/about-core-values-section";
import { AboutHeroSection } from "@/features/marketing/components/about-hero-section";
import { AboutMembersSection } from "@/features/marketing/components/about-members-section";
import { AboutMissionSection } from "@/features/marketing/components/about-mission-section";
import { WaitlistCtaSection } from "@/features/waitlist/components/waitlist-cta-section";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AboutHeroSection />
      <Reveal>
        <AboutMissionSection />
      </Reveal>
      <Reveal>
        <AboutCoreValuesSection />
      </Reveal>
      <Reveal>
        <AboutMembersSection />
      </Reveal>
      <Reveal>
        <WaitlistCtaSection ctaLabel="Get Started Now" />
      </Reveal>
      <SiteFooter />
    </div>
  );
}
