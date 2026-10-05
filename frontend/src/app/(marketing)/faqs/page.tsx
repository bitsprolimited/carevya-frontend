import { SiteFooter } from "@/components/shared/site-footer";
import { Reveal } from "@/components/shared/reveal";
import { FaqSection } from "@/features/faqs/components/faq-section";
import { FaqsHeroSection } from "@/features/marketing/components/faqs-hero-section";
import { WaitlistCtaSection } from "@/features/waitlist/components/waitlist-cta-section";

export default function FaqsPage() {
  return (
    <div className="flex flex-col">
      <FaqsHeroSection />
      <Reveal>
        <FaqSection
          eyebrow={null}
          title="Questions Asked Frequently"
        />
      </Reveal>
      <Reveal>
        <WaitlistCtaSection ctaLabel="Get Started Now" />
      </Reveal>
      <SiteFooter />
    </div>
  );
}
