import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { assets } from "@/lib/assets";

type IconProps = SVGProps<SVGSVGElement>;

function FacebookIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
      {...props}
    >
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.41-3.68 3.56-3.68 1.03 0 2.11.18 2.11.18v2.32h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.91h-2.2V22c4.78-.75 8.44-4.91 8.44-9.93z" />
    </svg>
  );
}

function XIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.99 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function InstagramIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const socialLinks: {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://x.com", label: "X", Icon: XIcon },
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
];

const details = [
  { label: "Location", value: "Lagos, Nigeria" },
  {
    label: "Email support",
    value: "carevya@gmail.com",
    href: "mailto:carevya@gmail.com",
  },
  {
    label: "Phone number",
    value: "+234 908 1237 218",
    href: "tel:+2349081237218",
  },
] as const;

export function ContactInfoSection() {
  return (
    <section className="bg-surface-soft">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="relative aspect-[761/391] w-full overflow-hidden rounded-2xl border border-brand-blue/30 bg-background shadow-sm">
            <Image
              src={assets.contactMap}
              alt="Map of Lagos, Nigeria highlighting CareVYA’s location"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
              Our Contact Information
            </h2>

            <dl className="mt-8 space-y-6 sm:mt-10 sm:space-y-7">
              {details.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm text-muted">{item.label}</dt>
                  <dd className="mt-1.5 text-base font-medium text-navy sm:text-lg">
                    {"href" in item && item.href ? (
                      <a
                        href={item.href}
                        className="transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}

              <div>
                <dt className="text-sm text-muted">Social media links</dt>
                <dd className="mt-3">
                  <ul className="flex items-center gap-2.5">
                    {socialLinks.map(({ href, label, Icon }) => (
                      <li key={label}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="inline-flex size-10 items-center justify-center rounded-full bg-brand-blue text-on-media transition-colors hover:bg-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <Icon className="size-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
