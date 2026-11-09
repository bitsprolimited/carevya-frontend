import { apiFetch } from "@/lib/api";

/**
 * Thin wrappers for Better Auth routes that aren't exposed as first-class
 * helpers on the React client, or are rarely used from UI.
 * All go through the same-origin `/api/auth/*` proxy.
 */

export function getAccountInfo() {
  return apiFetch<unknown>("/api/auth/account-info");
}

export function getAccessToken(body?: Record<string, unknown>) {
  return apiFetch<unknown>("/api/auth/get-access-token", {
    method: "POST",
    body: body ?? {},
  });
}

export function refreshToken(body?: Record<string, unknown>) {
  return apiFetch<unknown>("/api/auth/refresh-token", {
    method: "POST",
    body: body ?? {},
  });
}

export function verifyPassword(password: string) {
  return apiFetch<unknown>("/api/auth/verify-password", {
    method: "POST",
    body: { password },
  });
}

export function sendVerificationEmail(email: string, callbackURL?: string) {
  return apiFetch<unknown>("/api/auth/send-verification-email", {
    method: "POST",
    body: { email, ...(callbackURL ? { callbackURL } : {}) },
  });
}

export function requestPasswordResetLink(email: string, redirectTo?: string) {
  return apiFetch<unknown>("/api/auth/request-password-reset", {
    method: "POST",
    body: { email, ...(redirectTo ? { redirectTo } : {}) },
  });
}

export function resetPasswordWithToken(input: {
  newPassword: string;
  token: string;
}) {
  return apiFetch<unknown>("/api/auth/reset-password", {
    method: "POST",
    body: input,
  });
}

export function signInWithPhoneNumber(input: {
  phoneNumber: string;
  password?: string;
}) {
  return apiFetch<unknown>("/api/auth/sign-in/phone-number", {
    method: "POST",
    body: input,
  });
}

export function requestPhonePasswordReset(phoneNumber: string) {
  return apiFetch<unknown>("/api/auth/phone-number/request-password-reset", {
    method: "POST",
    body: { phoneNumber },
  });
}

export function resetPasswordWithPhone(input: {
  phoneNumber: string;
  otp: string;
  newPassword: string;
}) {
  return apiFetch<unknown>("/api/auth/phone-number/reset-password", {
    method: "POST",
    body: input,
  });
}

export function updateSession(body?: Record<string, unknown>) {
  return apiFetch<unknown>("/api/auth/update-session", {
    method: "POST",
    body: body ?? {},
  });
}
