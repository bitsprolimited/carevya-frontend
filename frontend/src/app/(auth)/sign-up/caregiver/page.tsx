import { redirect } from "next/navigation";

/** Deep link into caregiver signup on get-started. */
export default function CaregiverSignupRedirectPage() {
  redirect("/get-started?auth=signup&role=caregiver");
}
