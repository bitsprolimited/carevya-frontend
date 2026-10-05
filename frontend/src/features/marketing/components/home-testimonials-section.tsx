import { Star } from "lucide-react";
import Image from "next/image";
import { assets } from "@/lib/assets";

const featured = {
  quote:
    "When Mom was discharged from Riverside Methodist, we were terrified. CareVYA gave us direct access to Sarah’s complete background checks, within 30 minutes.",
  family: "The Henderson Family",
  avatar: assets.homeTestimonialAvatarHenderson,
  photo: assets.homeTestimonialFeatured,
} as const;

const testimonials = [
  {
    quote:
      "CareVYA made finding the right caregiver for my mum feel simple, reassuring, and stress-free.",
    family: "The Adekunle Family",
    meta: "Ikeja, Nigeria • 11 months care",
    avatar: assets.homeTestimonialAvatarA,
  },
  {
    quote:
      "Even from far away, CareVYA helps us stay connected to my grandmother's care every day.",
    family: "The Shina Family",
    meta: "Ikoyi, Nigeria • 8 months care",
    avatar: assets.homeTestimonialAvatarB,
  },
  {
    quote:
      "We found a caregiver who truly understood my dad’s needs, routine, and personality.",
    family: "The Henderson Family",
    meta: "Mushin, Nigeria • 6 months care",
    avatar: assets.homeTestimonialAvatarC,
  },
  {
    quote:
      "Everything felt clear, transparent, and genuinely human from the very beginning.",
    family: "The Babajide Family",
    meta: "Surulere, Nigeria • 5 months care",
    avatar: assets.homeTestimonialAvatarD,
  },
] as const;

function StarRating() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden
          className="size-4 fill-brand-blue text-brand-blue"
        />
      ))}
    </div>
  );
}

export function HomeTestimonialsSection() {
  return (
    <section id="testimonials" className="scroll-mt-24 bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold tracking-[0.14em] text-teal uppercase">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
            What families say about our carers.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            Real stories from adult daughters, sons, and spouses navigating
            senior care across Nigeria.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-2 lg:gap-6">
          <article className="relative isolate min-h-[28rem] overflow-hidden rounded-3xl sm:min-h-[32rem] lg:min-h-full">
            <Image
              src={featured.photo}
              alt="Caregiver in blue scrubs standing with an elderly man seated in a wheelchair"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-scrim/90 via-scrim/45 to-scrim/15"
            />
            <div className="relative z-10 flex h-full min-h-[28rem] flex-col justify-end p-6 sm:min-h-[32rem] sm:p-8 lg:min-h-[36rem]">
              <p className="max-w-md text-base leading-relaxed text-on-media sm:text-lg">
                {featured.quote}
              </p>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-on-media/40">
                    <Image
                      src={featured.avatar}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </span>
                  <p className="text-sm font-bold text-on-media sm:text-base">
                    {featured.family}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="select-none text-6xl leading-none font-serif text-on-media/35 sm:text-7xl"
                >
                  ”
                </span>
              </div>
            </div>
          </article>

          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {testimonials.map((item) => (
              <li
                key={`${item.family}-${item.meta}`}
                className="flex flex-col rounded-3xl bg-surface-soft p-5 sm:p-6"
              >
                <StarRating />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted italic sm:text-[0.95rem]">
                  “{item.quote}”
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="relative size-10 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={item.avatar}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy">{item.family}</p>
                    <p className="mt-0.5 text-xs text-muted">{item.meta}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
