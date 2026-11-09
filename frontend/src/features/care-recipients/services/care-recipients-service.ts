import { backendFetch } from "@/lib/backend-api";

export type CareRecipientRelationship =
  | "mother"
  | "father"
  | "grandparent"
  | "sibling"
  | "other";

export type CreateCareRecipientInput = {
  fullName: string;
  relationship: CareRecipientRelationship;
  gender: "male" | "female";
  dateOfBirth: string;
  languages: Array<"English" | "Pidgin" | "Yoruba" | "Hausa" | "Igbo" | "Other">;
  photoUrl?: string;
  addressState?: string;
  addressLga?: string;
  addressStreet?: string;
};

export type UpdateCareRecipientInput = Partial<CreateCareRecipientInput>;

export type CareRecipientListItem = {
  id: string;
  fullName: string;
  relationship?: string;
  gender?: string;
  dateOfBirth?: string;
  photoUrl?: string | null;
  addressState?: string | null;
  addressLga?: string | null;
  addressStreet?: string | null;
  languages?: string[];
  profileCompleteness?: {
    completed?: number;
    total?: number;
    percent?: number;
  };
};

export type CareRecipientsListResult = {
  recipients: CareRecipientListItem[];
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
};

export type SaveHealthInput = {
  conditions?: string[];
  medications?: string[];
  allergies?: string[];
  diet?: string;
  mobility?:
    | "walks_on_own"
    | "walks_with_some_help"
    | "uses_wheelchair"
    | "mostly_in_bed";
  dailyLiving?: {
    walking?: string;
    dressing?: string;
    eating?: string;
    toileting?: string;
  };
  doctorName?: string;
  doctorPhone?: string;
  clinicName?: string;
  notesForCaregivers?: string;
};

export type SaveCarePlanInput = {
  careTypes?: string[];
  arrangement?:
    | "live_in"
    | "full_day"
    | "part_time"
    | "overnight"
    | "weekends_only";
  scheduleNote?: string;
  dailyRoutine?: Array<{ hour: string; note: string }>;
  caregiverPreferences?: string[];
  enjoys?: string[];
  home?: Record<string, unknown>;
};

export type EmergencyContactInput = {
  name: string;
  relationship: string;
  phone: string;
  preferredChannel?: "whatsapp" | "phone_call" | "sms" | "email";
};

/** GET /care-recipients */
export function listCareRecipients(query?: {
  page?: number;
  pageSize?: number;
}) {
  return backendFetch<CareRecipientsListResult>("/care-recipients", { query });
}

/** POST /care-recipients */
export function createCareRecipient(body: CreateCareRecipientInput) {
  return backendFetch<CareRecipientListItem>("/care-recipients", {
    method: "POST",
    body,
  });
}

/** PATCH /care-recipients/{id} */
export function updateCareRecipient(
  id: string,
  body: UpdateCareRecipientInput,
) {
  return backendFetch<CareRecipientListItem>(`/care-recipients/${id}`, {
    method: "PATCH",
    body,
  });
}

/** DELETE /care-recipients/{id} */
export function deleteCareRecipient(id: string) {
  return backendFetch<{ deleted?: boolean }>(`/care-recipients/${id}`, {
    method: "DELETE",
  });
}

/** GET /care-recipients/{id}/overview */
export function getCareRecipientOverview(id: string) {
  return backendFetch<Record<string, unknown>>(
    `/care-recipients/${id}/overview`,
  );
}

/** GET /care-recipients/{id}/health */
export function getCareRecipientHealth(id: string) {
  return backendFetch<{ health: Record<string, unknown> | null }>(
    `/care-recipients/${id}/health`,
  );
}

/** PUT /care-recipients/{id}/health */
export function saveCareRecipientHealth(id: string, body: SaveHealthInput) {
  return backendFetch<{ health: Record<string, unknown> }>(
    `/care-recipients/${id}/health`,
    { method: "PUT", body },
  );
}

/** GET /care-recipients/{id}/care-plan */
export function getCareRecipientCarePlan(id: string) {
  return backendFetch<{ carePlan: Record<string, unknown> | null }>(
    `/care-recipients/${id}/care-plan`,
  );
}

/** PUT /care-recipients/{id}/care-plan */
export function saveCareRecipientCarePlan(id: string, body: SaveCarePlanInput) {
  return backendFetch<{ carePlan: Record<string, unknown> }>(
    `/care-recipients/${id}/care-plan`,
    { method: "PUT", body },
  );
}

/** GET /care-recipients/{id}/emergency-contacts */
export function getEmergencyContacts(id: string) {
  return backendFetch<{
    emergencyContacts: Array<Record<string, unknown>>;
  }>(`/care-recipients/${id}/emergency-contacts`);
}

/** PUT /care-recipients/{id}/emergency-contacts */
export function replaceEmergencyContacts(
  id: string,
  contacts: EmergencyContactInput[],
) {
  return backendFetch<{
    emergencyContacts: Array<Record<string, unknown>>;
  }>(`/care-recipients/${id}/emergency-contacts`, {
    method: "PUT",
    body: { contacts },
  });
}

/** DELETE /care-recipients/{id}/emergency-contacts/{contactId} */
export function deleteEmergencyContact(id: string, contactId: string) {
  return backendFetch<{ deleted: boolean }>(
    `/care-recipients/${id}/emergency-contacts/${contactId}`,
    { method: "DELETE" },
  );
}

/** GET /care-recipients/{id}/history */
export function getCareRecipientHistory(
  id: string,
  query?: { filter?: string },
) {
  return backendFetch<Record<string, unknown>>(
    `/care-recipients/${id}/history`,
    { query },
  );
}
