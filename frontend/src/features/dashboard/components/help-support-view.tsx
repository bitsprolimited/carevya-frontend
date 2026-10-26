"use client";

import {
  ChevronDown,
  Headphones,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { CareseekerTopbar } from "@/features/dashboard/components/careseeker-topbar";
import { ReportIssueModal } from "@/features/dashboard/components/report-issue-modal";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    id: "pay",
    question: "How do I pay my caregiver?",
    answer:
      "CareVYA doesn’t handle payments. You and your caregiver agree a price in chat, it’s saved on the booking, and you pay them directly — in cash or by transfer — the way you both agreed.",
  },
  {
    id: "cancel",
    question: "Can I cancel or change a booking?",
    answer:
      "Yes. Open the booking from Bookings, then choose Cancel or Message to agree a new time. If care has already started, contact support so we can help you update safely.",
  },
  {
    id: "verified",
    question: 'What does "ID verified" mean?',
    answer:
      "ID verified means the caregiver completed CareVYA identity checks. You’ll still see ratings, reviews and care types so you can choose who fits your family.",
  },
  {
    id: "add-person",
    question: "How do I add another person I care for?",
    answer:
      "Go to Profile → Care Recipients and tap “+ Add another person”, or start a care profile from the dashboard. You’ll need a complete care profile before you can search and book for them.",
  },
  {
    id: "no-show",
    question: "What if a caregiver doesn't show up?",
    answer:
      "Message them first from Messages. If you can’t reach them or feel unsafe, report the issue here and mark it as a safety concern — our team prioritises those reports.",
  },
] as const;

const CONTACT_CARDS = [
  {
    id: "chat",
    title: "Chat with us",
    detail: "Replies in about 5 minutes",
    href: "/careseeker/messages",
    icon: MessageCircle,
    wrap: "bg-[#EAF2FF] text-brand-blue",
    card: "bg-[#F3F7FF] border-[#DCE8FF]",
  },
  {
    id: "call",
    title: "Call us",
    detail: "+234 806 081 4178",
    href: "tel:+2348060814178",
    icon: Phone,
    wrap: "bg-[#E9F9F1] text-emerald",
    card: "bg-[#F1FBF5] border-[#CDEDD8]",
  },
  {
    id: "email",
    title: "Email us",
    detail: "hello@carevya.com.ng",
    href: "mailto:hello@carevya.com.ng",
    icon: Mail,
    wrap: "bg-[#FFF6E5] text-amber-700",
    card: "bg-[#FFF9F0] border-[#F5E4C8]",
  },
] as const;

function SupportIllustration() {
  return (
    <div
      className="relative mx-auto flex h-36 w-full max-w-[14rem] items-end justify-center"
      aria-hidden
    >
      <div className="absolute bottom-2 left-1/2 h-3 w-28 -translate-x-1/2 rounded-full bg-[#E8EEF5]" />
      <div className="relative flex flex-col items-center">
        <span className="mb-1 inline-flex size-8 items-center justify-center rounded-full bg-[#EAF2FF] text-brand-blue shadow-sm">
          <MessageCircle className="size-3.5" />
        </span>
        <div className="relative flex h-24 w-20 flex-col items-center rounded-t-[2.5rem] bg-[#F3F7FF]">
          <span className="mt-3 size-10 rounded-full bg-[#F5C6A8]" />
          <span className="mt-1 h-2 w-10 rounded-full bg-navy/15" />
          <span className="absolute -right-6 top-6 inline-flex size-9 items-center justify-center rounded-full bg-[#FEECEC] text-danger shadow-sm">
            <Headphones className="size-4" />
          </span>
          <span className="absolute -left-5 top-10 size-7 rounded-full bg-white shadow-sm ring-1 ring-[#E8EEF5]" />
        </div>
        <div className="relative -mt-1 h-10 w-28 rounded-xl border border-[#E8EEF5] bg-white shadow-sm">
          <span className="absolute top-2 left-2 h-1.5 w-8 rounded-full bg-[#EAF2FF]" />
          <span className="absolute top-5 left-2 h-1.5 w-12 rounded-full bg-[#EEF1F6]" />
          <span className="absolute right-2 bottom-2 size-4 rounded bg-brand-blue/15" />
        </div>
      </div>
    </div>
  );
}

export function HelpSupportView() {
  const [openFaq, setOpenFaq] = useState<string | null>("pay");
  const [reportOpen, setReportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  }

  return (
    <CareseekerShell>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
        <CareseekerTopbar
          title="Help & Support"
          subtitle="We’re here 8 AM – 8 PM, everyday."
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {CONTACT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.href}
                className={cn(
                  "flex flex-col rounded-2xl border p-5 transition-colors hover:brightness-[0.98]",
                  card.card,
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-full",
                    card.wrap,
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="mt-4 text-base font-bold text-navy">{card.title}</p>
                <p className="mt-1 text-sm text-navy/55">{card.detail}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
          <section className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-bold text-navy">
              Frequently asked questions
            </h2>
            <ul className="mt-4 divide-y divide-[#E8EEF5]">
              {FAQS.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <li key={faq.id}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenFaq((current) =>
                          current === faq.id ? null : faq.id,
                        )
                      }
                      className="flex w-full items-center justify-between gap-3 py-4 text-left"
                    >
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isOpen ? "text-brand-blue" : "text-navy",
                        )}
                      >
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 transition-transform",
                          isOpen
                            ? "rotate-180 text-brand-blue"
                            : "text-navy/40",
                        )}
                        aria-hidden
                      />
                    </button>
                    {isOpen ? (
                      <p className="pb-4 text-sm leading-relaxed text-navy/60">
                        {faq.answer}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="flex flex-col rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm sm:p-6">
            <SupportIllustration />
            <h2 className="mt-3 text-base font-bold text-navy">
              Report an issue
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-navy/55">
              Something wrong with a booking or caregiver? Tell us and our team
              will help.
            </p>
            <Button
              type="button"
              onClick={() => setReportOpen(true)}
              className="mt-5 h-11 w-full rounded-full"
            >
              Report an issue
            </Button>
          </section>
        </div>
      </div>

      <ReportIssueModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmitted={() => showToast("Report submitted — we’ll follow up soon")}
      />

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-navy px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </CareseekerShell>
  );
}
