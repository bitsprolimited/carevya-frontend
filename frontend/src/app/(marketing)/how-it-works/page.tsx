import { SiteFooter } from "@/components/shared/site-footer";
import { HowItWorksHeroSection } from "@/features/marketing/components/how-it-works-hero-section";

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      <HowItWorksHeroSection />
      <SiteFooter />
    </div>
  );
}
