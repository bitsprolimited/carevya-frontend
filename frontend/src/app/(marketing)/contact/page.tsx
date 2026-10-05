import { SiteFooter } from "@/components/shared/site-footer";
import { ContactFormSection } from "@/features/marketing/components/contact-form-section";
import { ContactHeroSection } from "@/features/marketing/components/contact-hero-section";
import { ContactInfoSection } from "@/features/marketing/components/contact-info-section";
import { WaitlistCtaSection } from "@/features/waitlist/components/waitlist-cta-section";

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <ContactHeroSection />
      <ContactInfoSection />
      <ContactFormSection />
      <WaitlistCtaSection ctaLabel="Get Started Now" />
      <SiteFooter />
    </div>
  );
}
