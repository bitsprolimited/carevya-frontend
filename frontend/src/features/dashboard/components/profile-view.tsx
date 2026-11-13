"use client";

import { Camera, Eye, EyeOff, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddCareRecipientModal } from "@/features/dashboard/components/add-care-recipient-modal";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { CareseekerTopbar } from "@/features/dashboard/components/careseeker-topbar";
import { ProfileContentSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { useCareRecipientsStore } from "@/features/care-recipients/hooks/use-care-recipients-store";
import {
  changePassword,
  confirmEmailChange,
  getPasswordChecks,
  requestEmailChange,
  sendPhoneOtp,
  updateUserProfile,
  verifyPhoneOtp,
} from "@/features/auth/services/auth-service";
import { uploadFile } from "@/features/uploads/services/upload-service";
import { useHydrated } from "@/hooks/use-hydrated";
import { assets } from "@/lib/assets";
import { authClient, useSession } from "@/lib/auth-client";

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
  const hydrated = useHydrated();
  const { data: session, refetch: refetchSession } = useSession();
  const loadRecipients = useCareRecipientsStore((state) => state.load);
  const recipients = useCareRecipientsStore((state) => state.items);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [draft, setDraft] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [sessionEmail, setSessionEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const avatarUrl =
    avatarPreview || session?.user?.image || assets.defaultAvatar;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [emailChangePending, setEmailChangePending] = useState<string | null>(
    null,
  );
  const [emailChangeOtp, setEmailChangeOtp] = useState("");
  const [pendingNewEmail, setPendingNewEmail] = useState("");
  const [confirmingEmail, setConfirmingEmail] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneBusy, setPhoneBusy] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [addRecipientOpen, setAddRecipientOpen] = useState(false);

  useEffect(() => {
    if (!hydrated || !session?.user) return;
    const name = session.user.name?.trim() || "";
    const parts = name.split(/\s+/).filter(Boolean);
    const nextFirst = parts[0] || "";
    const nextLast = parts.slice(1).join(" ");
    const nextEmail = session.user.email || "";
    const nextPhone =
      (session.user as { phoneNumber?: string; phone?: string }).phoneNumber ||
      (session.user as { phone?: string }).phone ||
      "";
    setFirstName(nextFirst);
    setLastName(nextLast);
    setEmail(nextEmail);
    setPhone(nextPhone);
    setSessionEmail(nextEmail);
    setDraft({
      firstName: nextFirst,
      lastName: nextLast,
      email: nextEmail,
      phone: nextPhone,
    });
  }, [hydrated, session]);

  useEffect(() => {
    if (!hydrated) return;
    void loadRecipients();
  }, [hydrated, loadRecipients]);

  const fullName = `${firstName} ${lastName}`.trim();
  const passwordChecks = getPasswordChecks(newPassword);
  const passwordValid = passwordChecks.every((check) => check.valid);

  function startEdit() {
    setDraft({ firstName, lastName, email, phone });
    setAvatarError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setFirstName(draft.firstName);
    setLastName(draft.lastName);
    setEmail(draft.email);
    setPhone(draft.phone);
    setAvatarError(null);
    setEditing(false);
  }

  async function handleAvatarSelected(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      setAvatarError("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be under 5 MB.");
      return;
    }

    setAvatarError(null);
    setAvatarUploading(true);
    try {
      const uploaded = await uploadFile("photo", file);
      const result = await updateUserProfile({ image: uploaded.url });
      if (!result.success) {
        setAvatarError(result.message);
        return;
      }
      setAvatarPreview(uploaded.url);
      await authClient.getSession();
      await refetchSession?.();
      setProfileSaved(true);
      window.setTimeout(() => setProfileSaved(false), 2500);
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : "Photo upload failed.",
      );
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  }

  async function saveProfile() {
    setProfileError(null);
    setEmailChangePending(null);
    setSavingProfile(true);
    const name = `${firstName} ${lastName}`.trim();
    const emailChanged =
      email.trim().toLowerCase() !== sessionEmail.trim().toLowerCase();

    if (emailChanged) {
      const emailResult = await requestEmailChange({ newEmail: email.trim() });
      if (!emailResult.success) {
        setSavingProfile(false);
        setProfileError(emailResult.message);
        return;
      }
      setPendingNewEmail(email.trim());
      setEmailChangeOtp("");
      setEmailChangePending(
        `We sent a verification code to ${email.trim()}. Enter it below to finish changing your address.`,
      );
    }

    // Better Auth rejects phoneNumber on /update-user
    // (PHONE_NUMBER_CANNOT_BE_UPDATED). Phone changes use the OTP flow below.
    const profileResult = await updateUserProfile({ name });
    setSavingProfile(false);

    if (!profileResult.success) {
      setProfileError(profileResult.message);
      return;
    }

    setEditing(false);
    setProfileSaved(true);
    if (!emailChanged) {
      setSessionEmail(email);
    }
    window.setTimeout(() => setProfileSaved(false), 2500);
  }

  async function handleConfirmEmailChange() {
    if (!pendingNewEmail || emailChangeOtp.trim().length < 4) return;
    setConfirmingEmail(true);
    setProfileError(null);
    const result = await confirmEmailChange({
      newEmail: pendingNewEmail,
      otp: emailChangeOtp.trim(),
    });
    setConfirmingEmail(false);
    if (!result.success) {
      setProfileError(result.message);
      return;
    }
    setSessionEmail(pendingNewEmail);
    setEmail(pendingNewEmail);
    setEmailChangePending(null);
    setPendingNewEmail("");
    setEmailChangeOtp("");
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 2500);
  }

  async function handlePasswordSave() {
    if (!passwordValid || newPassword !== confirmPassword || !currentPassword) {
      return;
    }
    setPasswordError(null);
    setSavingPassword(true);
    const result = await changePassword({
      currentPassword,
      newPassword,
    });
    setSavingPassword(false);
    if (!result.success) {
      setPasswordError(result.message);
      return;
    }
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    window.setTimeout(() => setPasswordSaved(false), 2500);
  }

  if (!hydrated) {
    return (
      <CareseekerShell>
        <ProfileContentSkeleton />
      </CareseekerShell>
    );
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
                <div className="relative shrink-0">
                  <span className="relative block size-16 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm">
                    <Image
                      src={avatarUrl}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </span>
                  <button
                    type="button"
                    aria-label="Change profile photo"
                    disabled={avatarUploading}
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -right-0.5 -bottom-0.5 inline-flex size-7 items-center justify-center rounded-full border-2 border-white bg-brand-blue text-white shadow-sm transition-colors hover:bg-brand-blue-hover disabled:opacity-60"
                  >
                    <Camera className="size-3.5" aria-hidden />
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(event) => {
                      void handleAvatarSelected(event.target.files?.[0]);
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-navy">{fullName}</p>
                  <p className="text-sm text-navy/55">Careseeker</p>
                  {avatarUploading ? (
                    <p className="mt-1 text-xs text-navy/55">Uploading photo…</p>
                  ) : (
                    <button
                      type="button"
                      disabled={avatarUploading}
                      onClick={() => avatarInputRef.current?.click()}
                      className="mt-1 text-xs font-semibold text-brand-blue hover:text-brand-blue-hover"
                    >
                      Change photo
                    </button>
                  )}
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
            {avatarError ? (
              <p role="alert" className="mt-2 text-xs text-red-600">
                {avatarError}
              </p>
            ) : null}

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
              <div className="mt-4 rounded-xl border border-[#E8EEF5] bg-[#F8FAFC] p-3">
                <p className="text-xs font-medium text-navy/60">
                  Verify phone with OTP
                </p>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={phoneBusy || !phone.trim()}
                    onClick={() => {
                      void (async () => {
                        setPhoneBusy(true);
                        setPhoneMessage(null);
                        const result = await sendPhoneOtp({ phone });
                        setPhoneBusy(false);
                        if (!result.success) {
                          setPhoneMessage(result.message);
                          return;
                        }
                        setPhoneOtpSent(true);
                        setPhoneMessage("Code sent. Enter it below.");
                      })();
                    }}
                    className="h-10 rounded-full px-4 text-xs"
                  >
                    {phoneBusy ? "Sending…" : "Send OTP"}
                  </Button>
                  {phoneOtpSent ? (
                    <>
                      <Input
                        value={phoneOtp}
                        onChange={(event) => setPhoneOtp(event.target.value)}
                        placeholder="OTP code"
                        className="h-10 rounded-xl border-[#D7E0EA]"
                        inputMode="numeric"
                      />
                      <Button
                        type="button"
                        disabled={phoneBusy || phoneOtp.trim().length < 4}
                        onClick={() => {
                          void (async () => {
                            setPhoneBusy(true);
                            setPhoneMessage(null);
                            const result = await verifyPhoneOtp({
                              phone,
                              code: phoneOtp.trim(),
                              updatePhoneNumber: true,
                            });
                            setPhoneBusy(false);
                            if (!result.success) {
                              setPhoneMessage(result.message);
                              return;
                            }
                            setPhoneMessage("Phone verified.");
                            setPhoneOtpSent(false);
                            setPhoneOtp("");
                          })();
                        }}
                        className="h-10 rounded-full px-4 text-xs"
                      >
                        Verify
                      </Button>
                    </>
                  ) : null}
                </div>
                {phoneMessage ? (
                  <p className="mt-2 text-xs text-navy/60">{phoneMessage}</p>
                ) : null}
              </div>
            ) : null}

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
                  onClick={() => void saveProfile()}
                  disabled={savingProfile}
                  className="h-10 rounded-full px-5"
                >
                  {savingProfile ? "Saving…" : "Save changes"}
                </Button>
              </div>
            ) : null}
            {profileError ? (
              <p className="mt-3 text-center text-xs text-red-600" role="alert">
                {profileError}
              </p>
            ) : null}
            {emailChangePending ? (
              <div className="mt-3 space-y-2" role="status">
                <p className="text-center text-xs text-navy/70">
                  {emailChangePending}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={emailChangeOtp}
                    onChange={(event) => setEmailChangeOtp(event.target.value)}
                    placeholder="Enter verification code"
                    className="h-10 rounded-xl border-[#D7E0EA]"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                  <Button
                    type="button"
                    onClick={() => void handleConfirmEmailChange()}
                    disabled={
                      confirmingEmail || emailChangeOtp.trim().length < 4
                    }
                    className="h-10 shrink-0 rounded-full px-5"
                  >
                    {confirmingEmail ? "Confirming…" : "Confirm email"}
                  </Button>
                </div>
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
                  Current password
                </span>
                <span className="relative block">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className="h-11 rounded-xl border-[#D7E0EA] pr-11"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    aria-label={
                      showCurrent ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowCurrent((value) => !value)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-navy/40 hover:text-navy"
                  >
                    {showCurrent ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </span>
              </label>

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
                onClick={() => void handlePasswordSave()}
                disabled={
                  savingPassword ||
                  !currentPassword ||
                  !passwordValid ||
                  newPassword !== confirmPassword
                }
                className="h-11 w-full rounded-full"
              >
                {savingPassword ? "Updating…" : "Update password"}
              </Button>
              {passwordError ? (
                <p className="text-center text-xs text-red-600" role="alert">
                  {passwordError}
                </p>
              ) : null}
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
            <button
              type="button"
              onClick={() => setAddRecipientOpen(true)}
              className="text-sm font-semibold text-brand-blue hover:text-brand-blue-hover"
            >
              + Add another person
            </button>
          </div>

          <ul className="mt-4 space-y-3">
            {recipients.map((recipient) => {
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

      <AddCareRecipientModal
        open={addRecipientOpen}
        onClose={() => setAddRecipientOpen(false)}
      />
    </CareseekerShell>
  );
}
