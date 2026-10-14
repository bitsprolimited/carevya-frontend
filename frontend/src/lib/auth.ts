import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "better-auth.sqlite");

export const auth = betterAuth({
  database: new Database(dbPath),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // Placeholder until a real email provider is connected.
      console.info("[better-auth] Password reset link for", user.email, "→", url);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // Placeholder until a real email provider is connected.
      console.info("[better-auth] Verify email for", user.email, "→", url);
    },
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  plugins: [nextCookies()],
});
