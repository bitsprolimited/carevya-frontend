export type ProfileCredentialStatus =
  | "licence_checked"
  | "reference_checked"
  | "certificate_checked";

export type ProfileCredential = {
  id: string;
  title: string;
  detail: string;
  status: ProfileCredentialStatus;
};

export type ProfileVerificationItem = {
  id: string;
  label: string;
  done: boolean;
};

export type ProfileReview = {
  id: string;
  authorName: string;
  rating: number;
  dateLabel: string;
  body: string;
};

export type CaregiverPublicProfile = {
  fullName: string;
  photoUrl: string;
  verified: boolean;
  yearsLabel: string;
  rating: number;
  reviewCount: number;
  location: string;
  gender: string;
  bio: string;
  careType: string;
  specializations: string[];
  arrangements: string[];
  languages: string[];
  areas: string[];
  travelLabel: string;
  rates: {
    dayShift: number;
    nightShift: number;
    weekly: number;
    monthlyLiveIn: number;
  };
  availability: {
    modeLabel: string;
    openToLabel: string;
    startLabel: string;
  };
  credentials: ProfileCredential[];
  verification: ProfileVerificationItem[];
  reviews: ProfileReview[];
};
