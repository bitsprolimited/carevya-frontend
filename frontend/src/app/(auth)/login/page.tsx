import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Log In | CareVYA",
  description: "Sign in to continue finding care you can trust.",
};

export default function LoginPage() {
  return (
    <section className="flex flex-1 items-center justify-center bg-surface-soft px-4 py-12 md:py-16">
      <LoginForm />
    </section>
  );
}