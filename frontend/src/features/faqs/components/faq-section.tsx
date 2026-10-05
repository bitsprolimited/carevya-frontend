import { FaqAccordion } from "@/features/faqs/components/faq-accordion";

type FaqSectionProps = {
  eyebrow?: string | null;
  title?: string;
  subtitle?: string;
};

export function FaqSection({
  eyebrow = "Common Inquiries",
  title = "Frequently Asked Questions",
  subtitle = "Clear answers about our vetting, billing security, and local care continuity.",
}: FaqSectionProps) {
  return (
    <section
      id="faq"
      className="scroll-mt-24 bg-background px-4 py-14 md:px-6 md:py-16 lg:px-8 lg:py-20"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="text-xs font-bold tracking-[0.14em] text-emerald uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={
              eyebrow
                ? "mt-3 text-2xl font-bold tracking-tight text-navy sm:text-3xl lg:text-[2.15rem]"
                : "text-2xl font-bold tracking-tight text-navy sm:text-3xl lg:text-[2.15rem]"
            }
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="mt-8 md:mt-10">
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
