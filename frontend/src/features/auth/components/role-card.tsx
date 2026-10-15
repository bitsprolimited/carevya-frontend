import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

type RoleCardProps = {
  title: string;
  description: string;
  ctaLabel: string;
  Icon: LucideIcon;
  href?: string;
  onClick?: () => void;
};

export function RoleCard({
  title,
  description,
  ctaLabel,
  href,
  onClick,
  Icon,
}: RoleCardProps) {
  const ctaClassName =
    "mt-auto inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-brand-blue transition-colors hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <article className="flex flex-1 flex-col items-center gap-4 rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md sm:p-8">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-surface-lavender text-brand-blue">
        <Icon className="size-6" aria-hidden />
      </span>
      <h2 className="text-lg font-semibold text-navy">{title}</h2>
      <p className="max-w-xs text-sm leading-relaxed text-navy/70">
        {description}
      </p>
      {onClick ? (
        <button type="button" onClick={onClick} className={ctaClassName}>
          {ctaLabel}
          <ArrowRight className="size-4" aria-hidden />
        </button>
      ) : href ? (
        <Link href={href} className={ctaClassName}>
          {ctaLabel}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      ) : null}
    </article>
  );
}
