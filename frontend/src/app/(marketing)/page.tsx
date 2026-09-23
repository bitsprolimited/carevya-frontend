import { FaqAccordion } from "@/features/faqs/components/faq-accordion";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { VerificationGrid } from "@/features/verification/components/verification-grid";

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />

      <section
        id="verify"
        className="bg-surface-soft px-4 py-14 md:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-bold text-navy md:text-3xl">
              We don&apos;t just connect you. We verify.
            </h2>
            <p className="text-muted">
              Multi-layer vetting before any caregiver reaches your family.
            </p>
          </div>
          <VerificationGrid />
        </div>
      </section>

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
