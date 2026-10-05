import Image from "next/image";
import { assets } from "@/lib/assets";

const stats = [
  { value: "100%", label: "Trust Rate" },
  { value: "99%", label: "Care Rate" },
  { value: "98%", label: "Satisfaction Rate" },
] as const;

export function HomeCommitmentSection() {
  return (
    <section id="about" className="scroll-mt-24 bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-10 xl:gap-x-16">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-teal uppercase">
              Our Commitment
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative aspect-square overflow-hidden rounded-3xl">
                <Image
                  src={assets.homeCommitmentPortraitA}
                  alt="Caregiver in blue scrubs smiling with an elderly woman at home"
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-3xl">
                <Image
                  src={assets.homeCommitmentPortraitB}
                  alt="Caregiver sitting bedside and holding an elderly patient's hand"
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start lg:pt-8">
            <p className="max-w-xl text-lg leading-relaxed sm:text-xl sm:leading-relaxed lg:text-[1.35rem] lg:leading-[1.55]">
              <span className="font-bold text-navy">
                Most families spend weeks agonizing over who to trust with an
                aging parent. We built CareVYA
              </span>{" "}
              <span className="font-normal text-muted">
                so you can see every credential, interview note, and background
                check before anyone ever steps through the door.
              </span>
            </p>
          </div>

          <div className="flex items-end">
            <dl className="grid w-full grid-cols-3 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-left">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <p className="text-3xl font-bold tracking-tight text-teal sm:text-4xl lg:text-5xl">
                      {stat.value}
                    </p>
                    <p className="mt-1.5 text-sm font-medium text-navy sm:text-base">
                      {stat.label}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl sm:aspect-[2/1]">
            <Image
              src={assets.homeCommitmentWide}
              alt="Caregivers in blue scrubs laughing together at a table"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
