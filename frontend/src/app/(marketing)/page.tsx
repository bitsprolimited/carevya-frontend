import { FaqAccordion } from "@/features/faqs/components/faq-accordion";
import { VerificationGrid } from "@/features/verification/components/verification-grid";
import { WaitlistForm } from "@/features/waitlist/components/waitlist-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            CareVYA
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-navy md:text-5xl">
            Find trusted care, closer to home.
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Connect with verified caregivers and agencies in Nigeria. Architecture
            foundation is live — full landing sections come next.
          </p>
        </div>

        <Card className="border-white/40 bg-white/80 shadow-lg backdrop-blur-md lg:-mt-2">
          <CardHeader>
            <CardTitle>Join the waitlist</CardTitle>
            <CardDescription>
              Be first to find trusted care when we open in your city.
            </CardDescription>
          </CardHeader>
          <WaitlistForm />
        </Card>
      </section>

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

      <section id="faq" className="mx-auto w-full max-w-3xl px-4 py-14 md:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-navy md:text-3xl">
          Frequently Asked Questions
        </h2>
        <FaqAccordion />
      </section>
    </div>
  );
}
