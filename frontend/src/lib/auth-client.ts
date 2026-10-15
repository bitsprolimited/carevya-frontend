import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { getBackendBaseUrl } from "@/lib/backend";

/**
 * Better Auth React client — talks to the Carevya backend
 * (`NEXT_PUBLIC_BACKEND_API_URL`), not this Next.js app.
 * @see https://better-auth.com/docs/concepts/client
 */
export const authClient = createAuthClient({
  baseURL: getBackendBaseUrl(),
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

export const { signIn, signUp, signOut, useSession, requestPasswordReset, resetPassword } =
  authClient;
