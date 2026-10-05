import { SiteFooter } from "@/components/shared/site-footer";
import { NotFoundHeroSection } from "@/features/marketing/components/not-found-hero-section";
import { WaitlistModal } from "@/features/waitlist/components/waitlist-modal";

export default function NotFound() {
  return (
    <>
      <main className="flex-1">
        <div className="flex flex-col">
          <NotFoundHeroSection />
          <SiteFooter />
        </div>
      </main>
      <WaitlistModal />
    </>
  );
}
