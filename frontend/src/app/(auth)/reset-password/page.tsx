"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { resetPasswordWithToken } from "@/features/auth/services/auth-service";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(
    () => searchParams.get("token") ?? "",
    [searchParams],
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Missing reset token. Open the link from your recovery email.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await resetPasswordWithToken({
        token,
        newPassword: password,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError("We couldn't reset your password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-12">
      <div className="w-full rounded-[1.5rem] border border-border bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-center text-2xl font-bold tracking-tight text-navy">
          Set a new password
        </h1>
        <p className="mt-2 text-center text-sm text-navy/60">
          Choose a strong password you haven&apos;t used before on CareVYA.
        </p>

        {success ? (
          <div className="mt-6 space-y-4 text-center">
            <p className="text-sm text-emerald-700">
              Password reset successful. You can now log in.
            </p>
            <Button
              type="button"
              className="h-12 w-full rounded-full"
              onClick={() => router.push("/get-started?auth=login")}
            >
              Back to Log in
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="reset-password" className="text-sm font-medium text-navy">
                New password
              </label>
              <div className="flex h-12 items-center gap-3 rounded-full border border-[#D7DEE8] px-4">
                <LockKeyhole className="size-4 text-navy/40" aria-hidden />
                <input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-navy/40"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="reset-password-confirm"
                className="text-sm font-medium text-navy"
              >
                Confirm new password
              </label>
              <div className="flex h-12 items-center gap-3 rounded-full border border-[#D7DEE8] px-4">
                <LockKeyhole className="size-4 text-navy/40" aria-hidden />
                <input
                  id="reset-password-confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error ? (
              <p role="alert" className="text-xs text-red-600">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-full"
            >
              {submitting ? "Updating..." : "Reset Password"}
              {!submitting ? <ArrowRight className="size-4" aria-hidden /> : null}
            </Button>
          </form>
        )}

        <p className="mt-5 text-center text-xs text-navy/55">
          <Link href="/get-started?auth=login" className="text-brand-blue">
            Back to login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
