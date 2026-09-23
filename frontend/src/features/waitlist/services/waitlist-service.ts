import { apiFetch } from "@/lib/api";
import type {
  WaitlistJoinInput,
  WaitlistJoinResponse,
} from "@/features/waitlist/types";

export async function joinWaitlist(
  input: WaitlistJoinInput,
): Promise<WaitlistJoinResponse> {
  return apiFetch<WaitlistJoinResponse>("/api/waitlist", {
    method: "POST",
    body: input,
  });
}
