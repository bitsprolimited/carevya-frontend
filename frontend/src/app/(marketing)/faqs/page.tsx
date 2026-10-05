import { SiteFooter } from "@/components/shared/site-footer";
import { FaqSection } from "@/features/faqs/components/faq-section";
import { FaqsHeroSection } from "@/features/marketing/components/faqs-hero-section";

export default function FaqsPage() {
  return (
    <div className="flex flex-col">
      <FaqsHeroSection />
      <FaqSection
        eyebrow={null}
        title="Questions Asked Frequently"
      />
      <SiteFooter />
    </div>
  );
}
