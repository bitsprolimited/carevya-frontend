import { ApiError } from "@/lib/api";
import { backendFetch } from "@/lib/backend-api";

/** 1 = about … 6 = verification */
export type CaregiverApplicationStep = 1 | 2 | 3 | 4 | 5 | 6;

export type CaregiverApplicationStatusValue =
  | "draft"
  | "submitted"
  | "in_review"
  | "approved"
  | "rejected";

export type CaregiverApplicationProgress = {
  currentStep?: number;
  totalSteps?: number;
  completedSteps?: number[];
  steps?: Array<{
    step: number;
    key: string;
    title?: string;
    complete: boolean;
    missingFields?: string[];
  }>;
  missingFields?: string[];
};

export type CaregiverApplicationResult = {
  application: Record<string, unknown>;
  progress?: CaregiverApplicationProgress;
  pipeline?: Array<Record<string, unknown>>;
};

export type CaregiverApplicationStatus = {
  status: CaregiverApplicationStatusValue;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  canAccessDashboard?: boolean;
  missingFields?: string[];
  pipeline?: Array<Record<string, unknown>>;
};

export type CaregiverReferenceRecord = {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  relationship: string;
};

export type CaregiverReferenceInput = Omit<CaregiverReferenceRecord, "id">;

export type CaregiverReviewResult = {
  ok: boolean;
  missingFields: string[];
};

export type CaregiverApplicationOptions = {
  serviceFeePercent?: number;
  specializations?: Array<{ value: string; label: string }>;
};

const BASE = "/onboarding/caregiver/application";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Pulls `missingFields` out of a 4xx/422 error body (top-level or under `data`). */
export function extractMissingFields(body: unknown): string[] {
  if (!isRecord(body)) return [];
  const direct = body.missingFields;
  if (Array.isArray(direct)) return direct.map(String);
  const nested = body.data;
  if (isRecord(nested) && Array.isArray(nested.missingFields)) {
    return nested.missingFields.map(String);
  }
  return [];
}

/** Readable message for a failed save/submit, preferring per-field errors. */
export function getApplicationErrorMessage(
  err: unknown,
  fallback: string,
): string {
  if (err instanceof ApiError) {
    if (isRecord(err.body) && Array.isArray(err.body.errors)) {
      const messages = err.body.errors
        .map((item) =>
          isRecord(item) && typeof item.message === "string"
            ? item.message
            : null,
        )
        .filter((item): item is string => Boolean(item));
      if (messages.length > 0) return messages.join(". ");
    }
    return err.message || fallback;
  }
  return err instanceof Error && err.message ? err.message : fallback;
}

/** GET /onboarding/caregiver/application */
export function getCaregiverApplication() {
  return backendFetch<CaregiverApplicationResult>(BASE);
}

/** GET /onboarding/caregiver/application/status */
export function getCaregiverApplicationStatus() {
  return backendFetch<CaregiverApplicationStatus>(`${BASE}/status`);
}

/** GET /onboarding/caregiver/application/options */
export async function getCaregiverApplicationOptions(): Promise<CaregiverApplicationOptions> {
  const data = await backendFetch<Record<string, unknown> | null>(
    `${BASE}/options`,
  );
  const options: CaregiverApplicationOptions = {};
  if (!isRecord(data)) return options;

  if (typeof data.serviceFeePercent === "number") {
    options.serviceFeePercent = data.serviceFeePercent;
  }

  if (Array.isArray(data.specializations)) {
    const parsed = data.specializations
      .map((item) => {
        if (typeof item === "string") {
          return { value: item, label: item };
        }
        if (!isRecord(item)) return null;
        const value = [item.value, item.id, item.key, item.slug].find(
          (candidate): candidate is string =>
            typeof candidate === "string" && candidate.length > 0,
        );
        const label = [item.label, item.title, item.name].find(
          (candidate): candidate is string =>
            typeof candidate === "string" && candidate.length > 0,
        );
        if (!value) return null;
        return { value, label: label ?? value };
      })
      .filter((item): item is { value: string; label: string } =>
        Boolean(item),
      );
    if (parsed.length > 0) options.specializations = parsed;
  }

  return options;
}

/** PUT /onboarding/caregiver/application/{step} — replaces that section. */
export function saveCaregiverApplicationStep(
  step: CaregiverApplicationStep,
  body: unknown,
) {
  return backendFetch<Record<string, unknown>>(`${BASE}/${String(step)}`, {
    method: "PUT",
    body,
  });
}

function toReference(value: unknown): CaregiverReferenceRecord | null {
  if (!isRecord(value)) return null;
  const id = value.id;
  if (typeof id !== "string" && typeof id !== "number") return null;
  return {
    id: String(id),
    title: typeof value.title === "string" ? value.title : "",
    fullName: typeof value.fullName === "string" ? value.fullName : "",
    phone: typeof value.phone === "string" ? value.phone : "",
    relationship:
      typeof value.relationship === "string" ? value.relationship : "",
  };
}

export function parseReferences(value: unknown): CaregiverReferenceRecord[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(toReference)
    .filter((item): item is CaregiverReferenceRecord => Boolean(item));
}

/** GET /onboarding/caregiver/application/references */
export async function listCaregiverReferences() {
  const data = await backendFetch<{ references?: unknown }>(
    `${BASE}/references`,
  );
  return parseReferences(data?.references);
}

/** POST /onboarding/caregiver/application/references (max 3) */
export function addCaregiverReference(body: CaregiverReferenceInput) {
  return backendFetch<Record<string, unknown>>(`${BASE}/references`, {
    method: "POST",
    body,
  });
}

/** DELETE /onboarding/caregiver/application/references/{id} */
export async function deleteCaregiverReference(id: string) {
  const data = await backendFetch<{
    deleted?: boolean;
    references?: unknown;
  }>(`${BASE}/references/${encodeURIComponent(id)}`, { method: "DELETE" });
  return {
    deleted: Boolean(data?.deleted),
    references: parseReferences(data?.references),
  };
}

/**
 * GET /onboarding/caregiver/application/review
 * 200 → nothing missing, 422 → `missingFields` (returned, not thrown).
 */
export async function reviewCaregiverApplication(): Promise<CaregiverReviewResult> {
  try {
    const data = await backendFetch<{
      ok?: boolean;
      missingFields?: string[];
    } | null>(`${BASE}/review`);
    const missingFields = data?.missingFields ?? [];
    return { ok: data?.ok ?? missingFields.length === 0, missingFields };
  } catch (err) {
    if (err instanceof ApiError && err.status === 422) {
      return { ok: false, missingFields: extractMissingFields(err.body) };
    }
    throw err;
  }
}

export type SubmitCaregiverApplicationInput = {
  nin?: string;
  declarations?: { accurate?: boolean; termsAccepted?: boolean };
};

/** POST /onboarding/caregiver/application/submit */
export function submitCaregiverApplication(
  body: SubmitCaregiverApplicationInput,
) {
  return backendFetch<Record<string, unknown>>(`${BASE}/submit`, {
    method: "POST",
    body,
  });
}
