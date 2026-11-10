import { backendFetch } from "@/lib/backend-api";

export type DeletionEligibility = {
  canDelete: boolean;
  activeBookings: number;
};

/** GET /account/deletion-eligibility */
export function getDeletionEligibility() {
  return backendFetch<DeletionEligibility>("/account/deletion-eligibility");
}

/** DELETE /account — 204 on success */
export function deleteAccount() {
  return backendFetch<null>("/account", { method: "DELETE" });
}
