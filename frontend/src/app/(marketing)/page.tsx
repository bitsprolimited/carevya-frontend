import { FaqSection } from "@/features/faqs/components/faq-section";
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
      <FaqSection />
    </div>
  );
}
