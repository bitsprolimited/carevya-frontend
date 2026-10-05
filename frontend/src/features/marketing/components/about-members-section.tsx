import Image from "next/image";
import { assets } from "@/lib/assets";

const members = [
  {
    name: "Des. D",
    role: "Chief Design Officer",
    photo: assets.aboutMemberDesD,
    alt: "Des. D at a desk with dual monitors",
  },
  {
    name: "Dev. G",
    role: "Chief Technical Officer",
    photo: assets.aboutMemberDevG,
    alt: "Dev. G at a desk with a laptop and monitor",
  },
  {
    name: "Dev. E",
    role: "Chief Product Officer",
    photo: assets.aboutMemberDevE,
    alt: "Dev. E at a desk with a laptop",
  },
  {
    name: "Dev. O",
    role: "Chief Marketing Officer",
    photo: assets.aboutMemberDevO,
    alt: "Dev. O at a desk with a laptop",
  },
] as const;

export function AboutMembersSection() {
  return (
    <section className="bg-surface-lavender">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-[0.14em] text-emerald uppercase">
            Members
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
            The people behind every caring moment.
          </h2>
        </div>

        <ul className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-7 lg:mt-14 lg:grid-cols-4 lg:gap-6 xl:gap-8">
          {members.map(({ name, role, photo, alt }) => (
            <li key={name} className="flex flex-col">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
                <Image
                  src={photo}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center"
                />
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy sm:text-xl">
                {name}
              </h3>
              <p className="mt-1 text-sm text-muted sm:text-base">{role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
