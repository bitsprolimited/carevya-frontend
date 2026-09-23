import {
  BadgeCheck,
  IdCard,
  QrCode,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

type ProtocolTheme = "blue" | "gold" | "green";

type ProtocolStep = {
  id: string;
  index: string;
  label: string;
  title: string;
  body: string;
  callout: string;
  theme: ProtocolTheme;
  Icon?: LucideIcon;
  iconSrc?: string;
  CalloutIcon?: LucideIcon;
  calloutIconSrc?: string;
  seal?: boolean;
};

const protocolSteps: readonly ProtocolStep[] = [
  {
    id: "find",
    index: "01",
    label: "FIND THE RIGHT CARE",
    title: "Care that fits your family",
    body: "Connect with caregivers matched to your loved one's care needs, from mobility support and companionship to specialised and live-in care.",
    callout: "Filter by neighborhood and medical competencies",
    theme: "blue",
    Icon: QrCode,
    CalloutIcon: SlidersHorizontal,
  },
  {
    id: "trust",
    index: "02",
    label: "KNOW WHO TO TRUST",
    title: "Triple-Layer Vetting",
    body: "We verify every caregivers, so families can feel more confident about who they welcome into their loved one's life.",
    callout: "Verification conducted",
    theme: "gold",
    Icon: BadgeCheck,
    CalloutIcon: IdCard,
    seal: true,
  },
  {
    id: "connect",
    index: "03",
    label: "CONNECT WITH PEACE",
    title: "Talk before you commit",
    body: "Schedule discovery calls and stay updated through daily care logs. No surprises.",
    callout: "Funds released only after family approval",
    theme: "green",
    iconSrc: assets.protocolConnectIcon,
    calloutIconSrc: assets.protocolConnectCalloutIcon,
  },
] as const;

const themeStyles: Record<
  ProtocolTheme,
  {
    label: string;
    iconWrap: string;
    icon: string;
    callout: string;
    calloutIcon: string;
    calloutText: string;
  }
> = {
  blue: {
    label: "text-brand-blue",
    iconWrap: "bg-brand-blue/10 text-brand-blue",
    icon: "text-brand-blue",
    callout: "bg-surface-lavender",
    calloutIcon: "bg-brand-blue/10 text-brand-blue",
    calloutText: "text-navy",
  },
  gold: {
    label: "text-gold-deep",
    iconWrap: "bg-surface-gold text-gold-deep",
    icon: "text-gold-deep",
    callout: "bg-surface-gold",
    calloutIcon: "bg-gold/20 text-gold-deep",
    calloutText: "text-gold-deep",
  },
  green: {
    label: "text-emerald-dark",
    iconWrap: "bg-emerald/10 text-emerald-dark",
    icon: "text-emerald-dark",
    callout: "bg-surface-lavender",
    calloutIcon: "bg-emerald/15 text-emerald-dark",
    calloutText: "text-navy",
  },
};

function ProtocolCard({ step }: { step: ProtocolStep }) {
  const styles = themeStyles[step.theme];
  const { Icon, CalloutIcon, iconSrc, calloutIconSrc } = step;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background p-5 shadow-sm md:p-6",
      )}
    >
      {step.theme === "gold" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-6 size-28 rounded-full bg-surface-gold/90 blur-2xl"
        />
      ) : null}

      <div className="relative flex items-start justify-between gap-3">
        <p
          className={cn(
            "text-[0.7rem] font-bold tracking-[0.08em] uppercase sm:text-xs",
            styles.label,
          )}
        >
          {step.index} • {step.label}
        </p>

        {step.seal && Icon ? (
          <span
            className={cn(
              "relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-seal px-3 py-1.5 text-xs font-semibold text-gold-deep shadow-sm sm:px-3.5 sm:py-2 sm:text-sm",
            )}
          >
            <Icon aria-hidden className="size-4 shrink-0 sm:size-[1.125rem]" />
            Verified Seal
          </span>
        ) : (
          <span
            className={cn(
              "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg",
              styles.iconWrap,
            )}
          >
            {iconSrc ? (
              <Image
                src={iconSrc}
                alt=""
                width={16}
                height={16}
                className="size-4 object-contain"
              />
            ) : Icon ? (
              <Icon aria-hidden className="size-4" />
            ) : null}
          </span>
        )}
      </div>

      <h3 className="relative mt-5 text-xl font-bold tracking-tight text-navy md:text-[1.35rem]">
        {step.title}
      </h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted md:text-[0.95rem]">
        {step.body}
      </p>

      <div
        className={cn(
          "relative mt-6 flex items-center gap-3 rounded-xl px-3.5 py-3",
          styles.callout,
        )}
      >
        <span
          className={cn(
            "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg",
            styles.calloutIcon,
          )}
        >
          {calloutIconSrc ? (
            <Image
              src={calloutIconSrc}
              alt=""
              width={14}
              height={14}
              className="size-3.5 object-contain"
            />
          ) : CalloutIcon ? (
            <CalloutIcon aria-hidden className="size-3.5" />
          ) : null}
        </span>
        <p className={cn("text-sm font-medium leading-snug", styles.calloutText)}>
          {step.callout}
        </p>
      </div>
    </article>
  );
}

export function ProtocolSection() {
  return (
    <section
      id="protocol"
      className="bg-background px-4 pb-14 pt-10 md:px-6 md:pb-20 md:pt-16 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto max-w-2xl text-center lg:max-w-none">
          <p className="text-xs font-bold tracking-[0.16em] text-brand-blue uppercase">
            The CareVYA Protocol
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy md:text-3xl lg:whitespace-nowrap lg:text-[2.15rem]">
            Find, verify and connect with care you can trust.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {protocolSteps.map((step) => (
            <ProtocolCard key={step.id} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
