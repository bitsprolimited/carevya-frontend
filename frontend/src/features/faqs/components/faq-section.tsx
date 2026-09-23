import { FaqAccordion } from "@/features/faqs/components/faq-accordion";

export function FaqSection() {
  return (
    <section
      id="faq"
      className="bg-background px-4 py-14 md:px-6 md:py-16 lg:px-8 lg:py-20"
    >
      <div className="mx-auto w-full max-w-3xl">
        <h2 className="text-center text-2xl font-bold tracking-tight text-navy sm:text-3xl lg:text-[2.15rem]">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 md:mt-10">
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
