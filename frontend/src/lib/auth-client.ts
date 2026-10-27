import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

function getAuthBaseUrl(): string {
  // Prefer env on both server and client so the auth client base URL
  // matches during SSR hydration (avoid window-only origin).
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
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
        phone: {
          type: "string",
        },
      },
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
} = authClient;
