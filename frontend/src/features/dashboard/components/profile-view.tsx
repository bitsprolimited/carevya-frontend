"use client";

import { Eye, EyeOff, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { CareseekerTopbar } from "@/features/dashboard/components/careseeker-topbar";
import { mockRecipients, mockUser } from "@/features/dashboard/data/mock";
import { useSession } from "@/lib/auth-client";

function Field({
  label,
  value,
  type = "text",
  readOnly,
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-navy/55">
        {label}
      </span>
      <Input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={
          onChange ? (event) => onChange(event.target.value) : undefined
        }
        className={
          readOnly
            ? "h-11 rounded-xl border-[#D7E0EA] bg-[#F8FAFC] text-navy"
            : "h-11 rounded-xl border-[#D7E0EA] bg-white text-navy"
        }
      />
    </label>
  );
}

export function ProfileView() {
  const { data: session } = useSession();
  const sessionName = session?.user?.name?.trim() || mockUser.fullName;
  const sessionParts = sessionName.split(/\s+/);
  const sessionEmail = session?.user?.email || "gracebill@gmail.com";
  const sessionPhone =
    (session?.user as { phone?: string } | undefined)?.phone ||
    "+234 809 221 3340";

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(sessionParts[0] || "Grace");
  const [lastName, setLastName] = useState(
    sessionParts.slice(1).join(" ") || "Bills",
  );
  const [email, setEmail] = useState(sessionEmail);
  const [phone, setPhone] = useState(sessionPhone);
  const [draft, setDraft] = useState({
    firstName,
    lastName,
    email,
    phone,
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const fullName = `${firstName} ${lastName}`.trim();

  function startEdit() {
    setDraft({ firstName, lastName, email, phone });
    setEditing(true);
  }

  function cancelEdit() {
    setFirstName(draft.firstName);
    setLastName(draft.lastName);
    setEmail(draft.email);
    setPhone(draft.phone);
    setEditing(false);
  }

  function saveProfile() {
    setEditing(false);
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 2500);
  }

  function handlePasswordSave() {
    if (newPassword.length < 8 || newPassword !== confirmPassword) return;
    setPasswordSaved(true);
    setNewPassword("");
    setConfirmPassword("");
    window.setTimeout(() => setPasswordSaved(false), 2500);
  }

  return (
    <CareseekerShell>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
        <CareseekerTopbar
          title="My Profile"
          subtitle="Manage your account details and care recipients."
          showSearch={false}
        />

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-navy">Basic Information</h2>

            <div className="relative mt-4 overflow-hidden rounded-2xl bg-[#EAF2FF] px-4 py-5">
              <div className="flex items-center gap-3">
                <span className="relative size-16 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm">
                  <Image
                    src={mockUser.avatarUrl}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
                <div>
                  <p className="text-lg font-bold text-navy">{fullName}</p>
                  <p className="text-sm text-navy/55">{mockUser.roleLabel}</p>
                </div>
              </div>
              {!editing ? (
                <button
                  type="button"
                  onClick={startEdit}
                  className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
                >
                  <Pencil className="size-3.5" aria-hidden />
                  Edit profile
                </button>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="First name"
                value={firstName}
                readOnly={!editing}
                onChange={setFirstName}
              />
              <Field
                label="Last name"
                value={lastName}
                readOnly={!editing}
                onChange={setLastName}
              />
              <Field
                label="Email address"
                value={email}
                type="email"
                readOnly={!editing}
                onChange={setEmail}
              />
              <Field
                label="Phone number"
                value={phone}
                type="tel"
                readOnly={!editing}
                onChange={setPhone}
              />
            </div>

            {editing ? (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={cancelEdit}
                  className="h-10 rounded-full px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={saveProfile}
                  className="h-10 rounded-full px-5"
                >
                  Save changes
                </Button>
              </div>
            ) : null}
            {profileSaved ? (
              <p
                className="mt-3 text-center text-xs font-medium text-emerald"
                role="status"
              >
                Profile updated
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-navy">Change password</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-navy/55">
                  New Password
                </span>
                <span className="relative block">
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="h-11 rounded-xl border-[#D7E0EA] pr-11"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    aria-label={showNew ? "Hide password" : "Show password"}
                    onClick={() => setShowNew((value) => !value)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-navy/40 hover:text-navy"
                  >
                    {showNew ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </span>
                <span className="mt-1 block text-xs text-navy/45">
                  At least 8 Characters
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-navy/55">
                  Confirm New Password
                </span>
                <span className="relative block">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    className="h-11 rounded-xl border-[#D7E0EA] pr-11"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirm ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowConfirm((value) => !value)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-navy/40 hover:text-navy"
                  >
                    {showConfirm ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </span>
                <span className="mt-1 block text-xs text-navy/45">
                  At least 8 Characters
                </span>
              </label>

              <Button
                type="button"
                onClick={handlePasswordSave}
                disabled={
                  newPassword.length < 8 || newPassword !== confirmPassword
                }
                className="h-11 w-full rounded-full"
              >
                Update password
              </Button>
              {passwordSaved ? (
                <p
                  className="text-center text-xs font-medium text-emerald"
                  role="status"
                >
                  Password updated
                </p>
              ) : null}
            </div>
          </section>
        </div>

        <section className="mt-5 rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-navy">Care Recipients</h2>
            <Link
              href="/careseeker/care-profile"
              className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
            >
              + Add another person
            </Link>
          </div>

          <ul className="mt-4 space-y-3">
            {mockRecipients.map((recipient) => {
              const initials = recipient.fullName
                .split(/\s+/)
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              return (
                <li
                  key={recipient.id}
                  className="flex flex-col gap-3 rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-sm font-bold text-brand-blue">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-navy">
                          {recipient.fullName}
                        </p>
                        <span className="rounded-full bg-[#E9F9F1] px-2 py-0.5 text-[0.6875rem] font-semibold text-emerald-dark">
                          Profile complete
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-navy/55">
                        {recipient.relationship} · {recipient.age} years ·{" "}
                        {recipient.area}, {recipient.city} · 1 active bookings
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/careseeker/recipients/${recipient.id}`}
                    className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-[#D7E0EA] bg-white px-4 text-xs font-semibold text-navy hover:bg-surface-soft"
                  >
                    View care profile
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 rounded-xl bg-[#EAF2FF] px-4 py-3 text-sm text-navy/70">
            You can only search and book caregivers for a person once their care
            profile is complete.
          </p>
        </section>
      </div>
    </CareseekerShell>
  );
}
