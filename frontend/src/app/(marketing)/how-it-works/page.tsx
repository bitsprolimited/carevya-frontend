import { SiteFooter } from "@/components/shared/site-footer";
import { HowItWorksHeroSection } from "@/features/marketing/components/how-it-works-hero-section";
import { HowItWorksStepsSection } from "@/features/marketing/components/how-it-works-steps-section";

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      <HowItWorksHeroSection />
      <HowItWorksStepsSection />
      <SiteFooter />
    </div>
  );
}
