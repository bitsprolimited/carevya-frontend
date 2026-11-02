import {
  emailOTPClient,
  inferAdditionalFields,
  phoneNumberClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

function getAuthBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ??
    "http://localhost:3000"
  );
}

/**
 * Better Auth client talks to this Next.js app (`/api/auth/*`),
 * which proxies to `NEXT_PUBLIC_BACKEND_API_URL` (avoids CORS).
 * @see https://better-auth.com/docs/concepts/client
 */
export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
  plugins: [
    inferAdditionalFields({
      user: {
        // Better Auth's phone-number plugin names this field `phoneNumber`.
        phoneNumber: {
          type: "string",
        },
        role: {
          type: "string",
        },
      },
    }),
    // OTP-based email verification, password reset and email change.
    emailOTPClient(),
    // Phone number OTP verification.
    phoneNumberClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
  emailOtp,
  phoneNumber,
} = authClient;