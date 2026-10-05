import { FaqAccordion } from "@/features/faqs/components/faq-accordion";

export function FaqSection() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 bg-background px-4 py-14 md:px-6 md:py-16 lg:px-8 lg:py-20"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.14em] text-emerald uppercase">
            Common Inquiries
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy sm:text-3xl lg:text-[2.15rem]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Clear answers about our vetting, billing security, and local care
            continuity.
          </p>
        </div>
        <div className="mt-8 md:mt-10">
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
