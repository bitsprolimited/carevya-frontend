import { SiteFooter } from "@/components/shared/site-footer";
import { Reveal } from "@/components/shared/reveal";
import { FaqSection } from "@/features/faqs/components/faq-section";
import { WaitlistCtaSection } from "@/features/waitlist/components/waitlist-cta-section";
import { HomeCommitmentSection } from "@/features/marketing/components/home-commitment-section";
import { HomeHeroSection } from "@/features/marketing/components/home-hero-section";
import { HomeHowItWorksSection } from "@/features/marketing/components/home-how-it-works-section";
import { HomeTestimonialsSection } from "@/features/marketing/components/home-testimonials-section";
import { HomeVerificationSection } from "@/features/marketing/components/home-verification-section";
import { HomeWhySection } from "@/features/marketing/components/home-why-section";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HomeHeroSection />
      <Reveal>
        <HomeHowItWorksSection />
      </Reveal>
      <Reveal>
        <HomeCommitmentSection />
      </Reveal>
      <Reveal>
        <HomeVerificationSection />
      </Reveal>
      <Reveal>
        <HomeWhySection />
      </Reveal>
      <Reveal>
        <HomeTestimonialsSection />
      </Reveal>
      <Reveal>
        <FaqSection />
      </Reveal>
      <Reveal>
        <WaitlistCtaSection ctaLabel="Get Started Now" />
      </Reveal>
      <SiteFooter />
    </div>
  );
}
