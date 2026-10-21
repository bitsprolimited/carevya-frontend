import { authClient } from "@/lib/auth-client";

export type AuthResult =
  | { success: true; message?: string }
  | { success: false; message: string };

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
    phone: input.phone,
  });

  if (error) {
    return {
      success: false,
      message: getErrorMessage(error, "We couldn't create your account."),
    };
  }

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
    return {
      success: false,
      message: getErrorMessage(error, "Invalid email or password."),
    };
  }

  return { success: true };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/family/profile",
  });

  if (error) {
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Google sign-in is not configured yet. Add Google credentials to Better Auth.",
      ),
    };
  }

  return { success: true };
}

export async function requestPasswordResetEmail(input: {
  email: string;
}): Promise<AuthResult> {
  const { error } = await authClient.requestPasswordReset({
    email: input.email,
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reset-password`,
  });

  if (error) {
    return {
      success: false,
      message: getErrorMessage(
        error,
        "We couldn't send a recovery email. Please try again.",
      ),
    };
  }

  return {
    success: true,
    message: "If an account exists for that email, a recovery link was sent.",
  };
}

export async function resetPasswordWithToken(input: {
  token: string;
  newPassword: string;
}): Promise<AuthResult> {
  const { error } = await authClient.resetPassword({
    token: input.token,
    newPassword: input.newPassword,
  });

  if (error) {
    return {
      success: false,
      message: getErrorMessage(
        error,
        "We couldn't reset your password. The link may be invalid or expired.",
      ),
    };
  }

  return { success: true, message: "Password updated." };
}
