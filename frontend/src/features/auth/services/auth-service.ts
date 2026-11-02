import { authClient } from "@/lib/auth-client";

export type AuthFailure = {
  success: false;
  message: string;
  /** Better Auth error code, e.g. EMAIL_NOT_VERIFIED, INVALID_OTP. */
  code?: string;
  status?: number;
};

export type AuthResult = { success: true; message?: string } | AuthFailure;

export type VerifyEmailResult =
  | { success: true; signedIn: boolean }
  | AuthFailure;

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string" &&
    (error as { message: string }).message
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
}

function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: unknown }).code;
    if (typeof code === "string" && code) return code;
  }
  return undefined;
}

function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status: unknown }).status;
    if (typeof status === "number") return status;
  }
  return undefined;
}

function failure(error: unknown, fallback: string): AuthFailure {
  return {
    success: false,
    message: getErrorMessage(error, fallback),
    code: getErrorCode(error),
    status: getErrorStatus(error),
  };
}

/** True when sign-in was rejected because the email isn't verified yet. */
export function isEmailNotVerified(result: AuthFailure): boolean {
  if (result.code?.toUpperCase().includes("EMAIL_NOT_VERIFIED")) return true;
  return result.status === 403 && /verif/i.test(result.message);
}

export type OtpErrorKind =
  | "invalid"
  | "expired"
  | "too-many-attempts"
  | "rate-limited"
  | "other";

/** Classify an OTP failure so screens can show the right message. */
export function getOtpErrorKind(result: AuthFailure): OtpErrorKind {
  const code = result.code?.toUpperCase() ?? "";
  if (code.includes("TOO_MANY_ATTEMPTS")) return "too-many-attempts";
  if (code.includes("OTP_EXPIRED") || /expired/i.test(result.message)) {
    return "expired";
  }
  if (code.includes("INVALID_OTP") || /invalid|incorrect/i.test(result.message)) {
    return "invalid";
  }
  if (result.status === 429 || code.includes("TOO_MANY_REQUESTS")) {
    return "rate-limited";
  }
  if (result.status === 403 && /too many/i.test(result.message)) {
    return "too-many-attempts";
  }
  return "other";
}

/**
 * Normalise a Nigerian phone number to E.164 (+234XXXXXXXXXX).
 * Accepts "0803 123 4567", "803 123 4567", "234 803 123 4567" and "+234 803 123 4567".
 * Numbers that already start with "+" keep their own country code.
 */
export function toE164Ng(input: string): string {
  const raw = input.trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (raw.startsWith("+")) return `+${digits}`;
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}

/**
 * One password policy for signup AND reset, so a password accepted in one
 * flow is never rejected by the other. The backend remains the final judge.
 */
export function getPasswordChecks(password: string) {
  return [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /\d/.test(password) },
  ];
}

export async function signUpfamily(input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AuthResult> {
  const { error } = await authClient.signUp.email({
    name: input.fullName,
    email: input.email,
    password: input.password,
    // Backend field is `phoneNumber` (Better Auth phone-number plugin).
    phoneNumber: toE164Ng(input.phone),
    // Always send the role explicitly; the backend only defaults to care_seeker.
    role: "care_seeker",
  });

  if (error) {
    return failure(error, "We couldn't create your account.");
  }

  // Signup does not mean the email is verified; an OTP has been sent.
  return { success: true };
}

export async function signInWithEmail(input: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<AuthResult> {
  const { error } = await authClient.signIn.email({
    email: input.email,
    password: input.password,
    rememberMe: input.rememberMe ?? true,
  });

  if (error) {
    return failure(error, "Invalid email or password.");
  }

  return { success: true };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/family/profile",
  });

  if (error) {
    return failure(
      error,
      "Google sign-in is not configured yet. Add Google credentials to Better Auth.",
    );
  }

  return { success: true };
}

/* ---------- Email verification (OTP) ---------- */

/** Send or resend the signup / unverified-login email OTP. */
export async function sendEmailVerificationOtp(input: {
  email: string;
}): Promise<AuthResult> {
  const { error } = await authClient.emailOtp.sendVerificationOtp({
    email: input.email,
    type: "email-verification",
  });

  if (error) {
    return failure(error, "We couldn't send a verification code.");
  }

  return { success: true };
}

export async function verifyEmailOtp(input: {
  email: string;
  otp: string;
}): Promise<VerifyEmailResult> {
  const { data, error } = await authClient.emailOtp.verifyEmail({
    email: input.email,
    otp: input.otp,
  });

  if (error) {
    return failure(error, "We couldn't verify that code.");
  }

  // If the backend auto-signs the user in after verification, a token is returned.
  const token = (data as { token?: string | null } | null)?.token;
  return { success: true, signedIn: Boolean(token) };
}

/* ---------- Password reset (OTP) ---------- */

export async function sendPasswordResetOtp(input: {
  email: string;
}): Promise<AuthResult> {
  // POST /api/auth/email-otp/request-password-reset (the older
  // /forget-password/email-otp route is deprecated).
  const { error } = await authClient.emailOtp.requestPasswordReset({
    email: input.email,
  });

  if (error) {
    return failure(error, "We couldn't send a recovery code. Please try again.");
  }

  return { success: true };
}

/** Validates the OTP without consuming it, so the user can then set a password. */
export async function checkPasswordResetOtp(input: {
  email: string;
  otp: string;
}): Promise<AuthResult> {
  const { error } = await authClient.emailOtp.checkVerificationOtp({
    email: input.email,
    type: "forget-password",
    otp: input.otp,
  });

  if (error) {
    return failure(error, "We couldn't verify that code.");
  }

  return { success: true };
}

export async function resetPasswordWithOtp(input: {
  email: string;
  otp: string;
  password: string;
}): Promise<AuthResult> {
  const { error } = await authClient.emailOtp.resetPassword({
    email: input.email,
    otp: input.otp,
    password: input.password,
  });

  if (error) {
    return failure(error, "We couldn't reset your password. Please try again.");
  }

  return { success: true, message: "Password updated." };
}

/* ---------- Phone verification (OTP) ---------- */

/** POST /api/auth/phone-number/send-otp */
export async function sendPhoneOtp(input: {
  phone: string;
}): Promise<AuthResult> {
  const { error } = await authClient.phoneNumber.sendOtp({
    phoneNumber: toE164Ng(input.phone),
  });

  if (error) {
    return failure(error, "We couldn't send a code to that number.");
  }

  return { success: true };
}

/**
 * POST /api/auth/phone-number/verify
 * `updatePhoneNumber: true` replaces the number on the signed-in account and
 * needs a session. Wrong codes count toward the backend's 3-attempt limit.
 */
export async function verifyPhoneOtp(input: {
  phone: string;
  code: string;
  updatePhoneNumber?: boolean;
}): Promise<AuthResult> {
  const { error } = await authClient.phoneNumber.verify({
    phoneNumber: toE164Ng(input.phone),
    code: input.code,
    // The user is already signed in; don't let verification swap the session.
    disableSession: true,
    updatePhoneNumber: input.updatePhoneNumber ?? false,
  });

  if (error) {
    return failure(error, "We couldn't verify that code.");
  }

  return { success: true };
}

/* ---------- Change email (OTP) ---------- */

/**
 * POST /api/auth/email-otp/request-email-change (needs a session).
 * Sends a code to the NEW email. When the backend has verifyCurrentEmail on,
 * pass the code from the CURRENT email as `currentEmailOtp`.
 */
export async function requestEmailChange(input: {
  newEmail: string;
  currentEmailOtp?: string;
}): Promise<AuthResult> {
  const { error } = await authClient.emailOtp.requestEmailChange({
    newEmail: input.newEmail,
    ...(input.currentEmailOtp ? { otp: input.currentEmailOtp } : {}),
  });

  if (error) {
    return failure(error, "We couldn't start the email change.");
  }

  return { success: true };
}

/** POST /api/auth/email-otp/change-email (needs a session). `otp` is the code sent to the NEW email. */
export async function confirmEmailChange(input: {
  newEmail: string;
  otp: string;
}): Promise<AuthResult> {
  const { error } = await authClient.emailOtp.changeEmail({
    newEmail: input.newEmail,
    otp: input.otp,
  });

  if (error) {
    return failure(error, "We couldn't change your email.");
  }

  return { success: true, message: "Email updated." };
}