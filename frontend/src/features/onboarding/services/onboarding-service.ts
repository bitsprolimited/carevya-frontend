import { backendFetch } from "@/lib/backend-api";

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export type OnboardingProfile = Record<string, unknown> & {
  id?: string;
  userId?: string;
  status?: string;
  careRecipientType?: string | null;
  relationshipToRecipient?: string | null;
  recipientFullName?: string | null;
  recipientDateOfBirth?: string | null;
  recipientGender?: string | null;
  recipientState?: string | null;
  recipientLga?: string | null;
  recipientPhotoUrl?: string | null;
  recipientNinUrl?: string | null;
  recipientLanguages?: string[] | null;
  recipientPhone?: string | null;
  careTypes?: string[] | null;
  careFrequency?: string | null;
  startDateFlexType?: string | null;
  specificStartDate?: string | null;
  careStartDate?: string | null;
  caregiverGenderPreference?: string | null;
  healthConditions?: string[] | null;
  mobility?: string | null;
  medicationsOrAllergies?: string | null;
  notesForCaregiver?: string | null;
  emergencyContactName?: string | null;
  emergencyRelationshipToYou?: string | null;
  emergencyRelationshipToRecipient?: string | null;
  emergencyPhone?: string | null;
  preferredContactMethod?: string | null;
  consentDataSharing?: boolean | null;
  consentAccuracy?: boolean | null;
  consentTerms?: boolean | null;
};

export type OnboardingGetResponse = {
  profile: OnboardingProfile;
};

export type OnboardingSummary = {
  status: "draft" | "in_review" | "completed";
  progress: {
    completedSteps: number[];
    totalSteps: number;
    percentComplete?: number;
  };
};

export type OnboardingReviewResult = {
  ok: boolean;
  missingFields: string[];
};

/** GET /onboarding/careseeker */
export async function getOnboardingProfile(): Promise<OnboardingGetResponse> {
  const data = await backendFetch<OnboardingGetResponse | OnboardingProfile>(
    "/onboarding/careseeker",
  );
  // Nest may return `{ profile }` or the profile object directly in `data`.
  if (
    data &&
    typeof data === "object" &&
    "profile" in data &&
    data.profile &&
    typeof data.profile === "object"
  ) {
    return { profile: data.profile as OnboardingProfile };
  }
  return { profile: (data ?? {}) as OnboardingProfile };
}

/** PUT /onboarding/careseeker/steps/{step} */
export function saveOnboardingStep(step: OnboardingStep, body: unknown) {
  return backendFetch<OnboardingProfile>(
    `/onboarding/careseeker/steps/${step}`,
    { method: "PUT", body },
  );
}

/** POST /onboarding/careseeker/review */
export function reviewOnboarding() {
  return backendFetch<OnboardingReviewResult>("/onboarding/careseeker/review", {
    method: "POST",
  });
}

/** POST /onboarding/careseeker/complete */
export function completeOnboarding() {
  return backendFetch<OnboardingProfile>("/onboarding/careseeker/complete", {
    method: "POST",
  });
}

/** GET /onboarding/careseeker/summary */
export function getOnboardingSummary() {
  return backendFetch<OnboardingSummary>("/onboarding/careseeker/summary");
}
