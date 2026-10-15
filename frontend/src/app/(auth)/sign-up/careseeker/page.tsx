import { redirect } from "next/navigation";

/** Old route — signup now opens as a modal on get-started. */
export default function CareseekerSignupRedirectPage() {
  redirect("/get-started?auth=signup");
}
