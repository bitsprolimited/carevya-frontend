/**
 * Temporary auth placeholders until the Carevya auth API is ready.
 * Replace these with real API calls (e.g. via apiFetch) when backend lands.
 */

/** Fixed OTP accepted by the placeholder verifier. */
export const PLACEHOLDER_OTP = "123456";

export type RegisterCareseekerInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

export type RegisterCareseekerResult = {
  success: true;
  message: string;
};

export type VerifyOtpInput = {
  email: string;
  phone: string;
  code: string;
};

export type VerifyOtpResult =
  | { success: true; message: string }
  | { success: false; message: string };

export type ResendOtpInput = {
  email: string;
  phone: string;
};

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Placeholder: pretend we registered the careseeker and sent an OTP. */
export async function registerCareseekerPlaceholder(
  input: RegisterCareseekerInput,
): Promise<RegisterCareseekerResult> {
  await delay();
  void input;
  return {
    success: true,
    message: `Verification code sent. Use ${PLACEHOLDER_OTP} for now.`,
  };
}

/** Placeholder: accept PLACEHOLDER_OTP only. */
export async function verifyOtpPlaceholder(
  input: VerifyOtpInput,
): Promise<VerifyOtpResult> {
  await delay();

  if (input.code !== PLACEHOLDER_OTP) {
    return {
      success: false,
      message: `Invalid code. For now, use ${PLACEHOLDER_OTP}.`,
    };
  }

  return {
    success: true,
    message: "Account verified.",
  };
}

/** Placeholder: pretend we resent the OTP. */
export async function resendOtpPlaceholder(
  input: ResendOtpInput,
): Promise<{ success: true; message: string }> {
  await delay(300);
  void input;
  return {
    success: true,
    message: `Code resent. Use ${PLACEHOLDER_OTP} for now.`,
  };
}

export type SendRecoveryCodeInput = {
  identifier: string;
};

export type ResetPasswordInput = {
  identifier: string;
  code: string;
  password: string;
};

/** Placeholder: pretend we sent a password-recovery code. */
export async function sendRecoveryCodePlaceholder(
  input: SendRecoveryCodeInput,
): Promise<{ success: true; message: string }> {
  await delay();
  void input;
  return {
    success: true,
    message: `Recovery code sent. Use ${PLACEHOLDER_OTP} for now.`,
  };
}

/** Placeholder: accept PLACEHOLDER_OTP for password recovery. */
export async function verifyRecoveryCodePlaceholder(input: {
  identifier: string;
  code: string;
}): Promise<VerifyOtpResult> {
  await delay();
  void input.identifier;

  if (input.code !== PLACEHOLDER_OTP) {
    return {
      success: false,
      message: `Invalid code. For now, use ${PLACEHOLDER_OTP}.`,
    };
  }

  return {
    success: true,
    message: "Recovery code verified.",
  };
}

/** Placeholder: pretend we updated the password. */
export async function resetPasswordPlaceholder(
  input: ResetPasswordInput,
): Promise<{ success: true; message: string }> {
  await delay();
  void input;
  return {
    success: true,
    message: "Password updated.",
  };
}
