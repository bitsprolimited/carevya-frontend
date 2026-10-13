"use client";

import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

const inputWrapper =
  "flex items-center gap-2 rounded-full border border-border bg-white px-4 focus-within:ring-2 focus-within:ring-ring";
const inputClass =
  "h-11 min-w-0 flex-1 bg-transparent text-sm text-navy placeholder:text-navy/40 focus:outline-none";

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!identifier.trim() || !password) {
      setError("Enter your email address or phone number and password.");
      return;
    }

    setSubmitting(true);
    try {
    
      await new Promise((resolve) => setTimeout(resolve, 600));
    } catch {
      setError("We couldn't sign you in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-lg sm:p-8">
      <header className="mb-6 space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-navy">
          Welcome Back
        </h1>
        <p className="text-sm text-navy/70">
          Sign in to continue finding care you can trust.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="login-identifier"
            className="text-xs font-medium text-navy"
          >
            Email Address or Phone Number
          </label>
          <div className={inputWrapper}>
            <Mail className="size-4 shrink-0 text-navy/50" aria-hidden />
            <input
              id="login-identifier"
              type="text"
              autoComplete="username"
              inputMode="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. +234 803 123 4567 or adebayo@family.ng"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="login-password"
            className="text-xs font-medium text-navy"
          >
            Password
          </label>
          <div className={inputWrapper}>
            <Lock className="size-4 shrink-0 text-navy/50" aria-hidden />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="rounded-sm text-navy/50 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <label className="inline-flex items-center gap-2 text-navy/70">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-3.5 rounded border-border accent-brand-blue"
            />
            Remember this device for 30 days
          </label>
          <Link
            href="/forgot-password"
            className="shrink-0 rounded-sm font-medium text-brand-blue hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="h-11 w-full rounded-full"
        >
          {submitting ? "Signing in..." : "Login to Family Portal"}
          {!submitting && <ArrowRight className="size-4" aria-hidden />}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-[0.6875rem] uppercase tracking-wide text-navy/50">
        <span className="h-px flex-1 bg-border" aria-hidden />
        Or continue with
        <span className="h-px flex-1 bg-border" aria-hidden />
      </div>

      <button
        type="button"
    
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-white text-sm font-medium text-navy transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <GoogleIcon className="size-4" />
        Sign in with Google
      </button>

      <p className="mt-6 text-center text-xs text-navy/70">
        New to CareVYA?{" "}
        <Link
          href="/sign-up/careseeker"
          className="rounded-sm font-semibold text-brand-blue hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Create a Careseeker Account
        </Link>
      </p>
    </div>
  );
}