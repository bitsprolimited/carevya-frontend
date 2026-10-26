"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { CareseekerTopbar } from "@/features/dashboard/components/careseeker-topbar";
import { DeleteAccountModal } from "@/features/dashboard/components/delete-account-modal";
import { useBookingsStore } from "@/features/dashboard/hooks/use-bookings-store";
import { cn } from "@/lib/utils";

type Channel = "inApp" | "email" | "sms";

type NotificationRow = {
  id: string;
  label: string;
  channels: Record<Channel, boolean>;
};

const INITIAL_ROWS: NotificationRow[] = [
  {
    id: "booking",
    label: "Booking updates",
    channels: { inApp: true, email: true, sms: true },
  },
  {
    id: "messages",
    label: "New messages",
    channels: { inApp: true, email: false, sms: true },
  },
  {
    id: "reminders",
    label: "Care / Visit reminders",
    channels: { inApp: true, email: true, sms: false },
  },
  {
    id: "payments",
    label: "Payments & Receipts",
    channels: { inApp: true, email: true, sms: false },
  },
  {
    id: "tips",
    label: "Tips & product news",
    channels: { inApp: false, email: false, sms: false },
  },
  {
    id: "missed",
    label: "Missed Call Alerts",
    channels: { inApp: false, email: false, sms: false },
  },
];

export function SettingsView() {
  const bookings = useBookingsStore((state) => state.bookings);
  const activeBookings = useMemo(
    () =>
      bookings.filter(
        (item) =>
          item.status === "accepted" ||
          item.status === "confirmed" ||
          item.status === "pending",
      ).length,
    [bookings],
  );

  const [rows, setRows] = useState(INITIAL_ROWS);
  const [shareHealth, setShareHealth] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function setChannel(rowId: string, channel: Channel, value: boolean) {
    setRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? { ...row, channels: { ...row.channels, [channel]: value } }
          : row,
      ),
    );
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  return (
    <CareseekerShell>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
        <CareseekerTopbar
          title="Settings"
          subtitle="Manage notifications, appearance, privacy and your account."
          showSearch={false}
        />

        <section className="mt-6 rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-navy">Notification settings</h2>
          <p className="mt-1 text-sm text-navy/55">
            Choose how CareVYA keeps you updated about bookings and messages.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#E8EEF5] text-[0.6875rem] font-semibold tracking-wide text-navy/45 uppercase">
                  <th className="pb-3 pr-4 font-semibold">Notify me about</th>
                  <th className="px-3 pb-3 text-center font-semibold">In-app</th>
                  <th className="px-3 pb-3 text-center font-semibold">Email</th>
                  <th className="px-3 pb-3 text-center font-semibold">
                    SMS / WhatsApp
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#E8EEF5] last:border-b-0"
                  >
                    <td className="py-3.5 pr-4 font-medium text-navy">
                      {row.label}
                    </td>
                    {(["inApp", "email", "sms"] as const).map((channel) => (
                      <td key={channel} className="px-3 py-3.5">
                        <div className="flex justify-center">
                          <Toggle
                            checked={row.channels[channel]}
                            onChange={(next) =>
                              setChannel(row.id, channel, next)
                            }
                            aria-label={`${row.label} ${channel}`}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-navy">Appearance</h2>
          <p className="mt-1 text-sm text-navy/55">
            Choose how CareVYA looks on this device.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E8EEF5] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#EAF2FF] text-brand-blue">
                  <Sun className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">Light mode</p>
                  <p className="text-xs text-navy/50">Default look</p>
                </div>
              </div>
              <Toggle
                checked={!darkMode}
                onChange={(next) => {
                  if (next) setDarkMode(false);
                }}
                aria-label="Light mode"
              />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E8EEF5] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#EEF1F6] text-navy">
                  <Moon className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">Dark mode</p>
                  <p className="text-xs text-navy/50">Coming soon</p>
                </div>
              </div>
              <Toggle
                checked={darkMode}
                onChange={setDarkMode}
                aria-label="Dark mode"
              />
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-navy">Privacy &amp; data</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-[#E8EEF5] px-4 py-3">
              <Toggle
                checked={shareHealth}
                onChange={setShareHealth}
                label="Share health details only after I send a request"
                description="Caregivers won’t see health notes until you message or book them."
              />
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-[#E8EEF5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-navy">
                  Download my data
                </p>
                <p className="mt-0.5 text-xs text-navy/55">
                  Get a copy of your account, care profiles and bookings.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="h-9 rounded-full px-4 text-xs"
                onClick={() => showToast("Download requested")}
              >
                Request download
              </Button>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-[#E8EEF5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-navy">
                  Terms &amp; Privacy Policy
                </p>
                <p className="mt-0.5 text-xs text-navy/55">
                  Accepted on 10 Oct 2026.
                </p>
              </div>
              <Link
                href="/terms"
                className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
              >
                → View
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-[#C8EBD9] bg-[#E9F9F1] p-5">
            <p className="text-sm font-semibold text-navy">
              Need help or want to report a problem?
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-navy shadow-sm hover:bg-surface-soft"
            >
              Contact support
            </Link>
          </section>

          <section className="rounded-2xl border border-[#F5C2C2] bg-[#FEECEC] p-5">
            <p className="text-sm font-bold text-danger">Delete account</p>
            <p className="mt-1 text-xs leading-relaxed text-navy/65">
              Permanently delete your account, and all care records. Active
              bookings must be completed or cancelled first.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteOpen(true)}
              className="mt-4 h-11 w-full rounded-full border-danger/20 text-danger hover:bg-white"
            >
              Delete account
            </Button>
          </section>
        </div>
      </div>

      <DeleteAccountModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        activeBookings={activeBookings}
        onDeleted={() => showToast("Account deletion requested")}
      />

      {toast ? (
        <div
          role="status"
          className={cn(
            "fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-navy px-4 py-2 text-sm font-medium text-white shadow-lg",
          )}
        >
          {toast}
        </div>
      ) : null}
    </CareseekerShell>
  );
}
