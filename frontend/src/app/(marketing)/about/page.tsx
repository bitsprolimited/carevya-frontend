import { SiteFooter } from "@/components/shared/site-footer";
import { AboutHeroSection } from "@/features/marketing/components/about-hero-section";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AboutHeroSection />
      <SiteFooter />
    </div>
  );
}
