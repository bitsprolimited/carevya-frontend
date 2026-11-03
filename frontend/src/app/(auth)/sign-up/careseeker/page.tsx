import { redirect } from "next/navigation";

/** Old route — signup now opens as a modal on get-started. */
export default function familySignupRedirectPage() {
  redirect("/get-started?auth=signup");
}
