import { apiFetch } from "@/lib/api";
import type {
  HealthResponse,
  WaitlistJoinInput,
  WaitlistJoinResponse,
  WaitlistStatsResponse,
} from "@/features/waitlist/types";

export async function joinWaitlist(
  input: WaitlistJoinInput,
): Promise<WaitlistJoinResponse> {
  const { email, role } = input;

  return apiFetch<WaitlistJoinResponse>("/api/waitlist", {
    method: "POST",
    body: {
      email: email.trim().toLowerCase(),
      role, // backend accepts "family" | "caregiver" | "agency" as-is
      // location: input.location, // add only if the backend accepts it
    },
  });
}

// NOTE: paths below are assumptions; replace with the real routes.
export async function getWaitlistStats(): Promise<WaitlistStatsResponse> {
  return apiFetch<WaitlistStatsResponse>("/api/waitlist/stats");
}

export async function getHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/api/health");
}