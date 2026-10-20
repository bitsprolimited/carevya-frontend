import Link from "next/link";
import type { LegalBlock, LegalSection } from "@/features/legal/content/terms";

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "ul") {
    return (
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy/75 sm:text-[0.9375rem]">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <p className="mt-3 text-sm leading-relaxed text-navy/75 first:mt-0 sm:text-[0.9375rem]">
      {block.text}
    </p>
  );
}

export function LegalDocument({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="border-b border-[#E2E8F0] pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-navy/55">Last updated: {lastUpdated}</p>
        {intro ? (
          <p className="mt-5 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm leading-relaxed text-navy/80">
            {intro}
          </p>
        ) : null}
      </header>

      <nav aria-label="Table of contents" className="mt-8">
        <p className="text-sm font-semibold text-navy">Contents</p>
        <ol className="mt-3 columns-1 gap-x-8 space-y-1.5 text-sm text-brand-blue sm:columns-2">
          {sections.map((section) => (
            <li key={section.id} className="break-inside-avoid">
              <a
                href={`#${section.id}`}
                className="hover:text-brand-blue-hover hover:underline"
              >
                {section.number}. {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 border-b border-[#EEF2F7] pb-10 last:border-b-0"
          >
            <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
              {section.number}. {section.title}
            </h2>
            <div className="mt-4">
              {section.blocks.map((block, index) => (
                <Block
                  key={`${section.id}-${index}`}
                  block={block}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-navy/55">
        Questions about these terms?{" "}
        <Link
          href="/contact"
          className="font-medium text-brand-blue hover:text-brand-blue-hover"
        >
          Contact CareVYA support
        </Link>
        .
      </p>
    </article>
  );
}
