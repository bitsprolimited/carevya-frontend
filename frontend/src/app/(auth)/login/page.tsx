import { redirect } from "next/navigation";

/** Old route — login now opens as a modal on get-started. */
export default function LoginRedirectPage() {
  redirect("/get-started?auth=login");
}
