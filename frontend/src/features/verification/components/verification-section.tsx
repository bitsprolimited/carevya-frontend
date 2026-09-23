import { VerificationGrid } from "@/features/verification/components/verification-grid";

export function VerificationSection() {
  return (
    <section id="verify" className="bg-background px-4 py-14 md:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl lg:text-[2.15rem]">
            We don&apos;t just connect you.{" "}
            <span className="text-emerald">We verify.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Every caregiver is verified through identity, qualifications,
            experience, and references.
          </p>
        </div>

        <div className="mt-12 md:mt-14">
          <VerificationGrid />
        </div>
      </div>
    </section>
  );
}
