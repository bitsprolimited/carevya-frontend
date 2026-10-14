import { redirect } from "next/navigation";

/** Caregiver signup is not ready yet — send users back to get-started. */
export default function CaregiverSignupRedirectPage() {
  redirect("/get-started");
}
