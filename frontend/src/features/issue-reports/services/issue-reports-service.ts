import { backendFetch } from "@/lib/backend-api";

export type IssueReportCategory =
  | "caregiver_late"
  | "caregiver_no_show"
  | "safety_concern"
  | "price_disagreement"
  | "unprofessional_behaviour"
  | "other";

export type IssueBookingOption = {
  id: string;
  reference: string;
  caregiverName: string;
  caregiverPhotoUrl?: string | null;
  serviceLabel: string;
  scheduledFor: string;
};

export type CreateIssueReportInput = {
  category: IssueReportCategory;
  bookingId?: string | null;
  details?: string;
  isSafetyConcern?: boolean;
  attachmentUrls?: string[];
};

export type IssueReport = {
  id: string;
  category: IssueReportCategory;
  bookingId?: string | null;
  details?: string | null;
  isSafetyConcern: boolean;
  attachmentUrls: string[];
  status: "open" | "in_review" | "resolved";
  createdAt: string;
};

/** GET /issue-reports/booking-options */
export function getIssueBookingOptions() {
  return backendFetch<IssueBookingOption[]>(
    "/issue-reports/booking-options",
  );
}

/** POST /issue-reports */
export function createIssueReport(body: CreateIssueReportInput) {
  return backendFetch<IssueReport>("/issue-reports", {
    method: "POST",
    body,
  });
}
