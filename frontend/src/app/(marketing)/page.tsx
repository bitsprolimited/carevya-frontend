import { FaqAccordion } from "@/features/faqs/components/faq-accordion";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { OneStandardSection } from "@/features/marketing/components/one-standard-section";
import { ProtocolSection } from "@/features/marketing/components/protocol-section";
import { VerificationSection } from "@/features/verification/components/verification-section";

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProtocolSection />
      <OneStandardSection />
      <VerificationSection />

      <section
        id="faq"
        className="mx-auto w-full max-w-3xl px-4 py-14 md:px-6 lg:px-8"
      >
        <h2 className="mb-6 text-2xl font-bold text-navy md:text-3xl">
          Frequently Asked Questions
        </h2>
        <FaqAccordion />
      </section>
    </div>
  );
}
