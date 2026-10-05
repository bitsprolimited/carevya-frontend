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
  return apiFetch<WaitlistJoinResponse>("/api/waitlist", {
    method: "POST",
    body: {
      role: input.role,
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      state: input.state,
      lga: input.lga,
    },
  });
}

export async function getWaitlistStats(): Promise<WaitlistStatsResponse> {
  return apiFetch<WaitlistStatsResponse>("/api/waitlist/stats");
}

export async function getHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/api/health");
}