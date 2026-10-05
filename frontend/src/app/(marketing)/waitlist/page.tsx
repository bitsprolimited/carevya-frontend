import { FaqSection } from "@/features/faqs/components/faq-section";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { OneStandardSection } from "@/features/marketing/components/one-standard-section";
import { ProtocolSection } from "@/features/marketing/components/protocol-section";
import { VerificationSection } from "@/features/verification/components/verification-section";
import { WaitlistCtaSection } from "@/features/waitlist/components/waitlist-cta-section";

export default function WaitlistPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProtocolSection />
      <OneStandardSection />
      <VerificationSection />
      <FaqSection />
      <WaitlistCtaSection />
    </div>
  );
}
