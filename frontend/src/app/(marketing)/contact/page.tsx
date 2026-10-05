import { SiteFooter } from "@/components/shared/site-footer";
import { ContactHeroSection } from "@/features/marketing/components/contact-hero-section";

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <ContactHeroSection />
      <SiteFooter />
    </div>
  );
}
