import type { LegalSection } from "@/features/legal/content/terms";

export const PRIVACY_INTRO =
  "This Privacy Policy explains how CareVYA collects and processes personal information in connection with the Platform. It should be reviewed, amended and approved by qualified legal counsel in Nigeria before publication or launch.";

export const PRIVACY_LAST_UPDATED = "October 2026";

/** Sourced from Terms §24 — Privacy and Personal Data. */
export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "section-1",
    number: 1,
    title: "Overview",
    blocks: [
      {
        type: "p",
        text: "CareVYA collects and processes personal information in accordance with this Privacy Policy and applicable Nigerian data-protection requirements.",
      },
    ],
  },
  {
    id: "section-2",
    number: 2,
    title: "Information We Collect",
    blocks: [
      {
        type: "p",
        text: "Depending on how the Platform is used, information may include:",
      },
      {
        type: "ul",
        items: [
          "Identity information",
          "Contact information",
          "Location",
          "Profile information",
          "Identity documents",
          "Qualifications",
          "References",
          "Payment-related information",
          "Care-recipient information",
          "Health or care-related information",
          "Communications",
          "Reviews and ratings",
          "Technical and usage information",
        ],
      },
    ],
  },
  {
    id: "section-3",
    number: 3,
    title: "How We Use Personal Data",
    blocks: [
      {
        type: "p",
        text: "CareVYA will process personal data for legitimate purposes connected with operating, securing and improving the Platform, including where necessary:",
      },
      {
        type: "ul",
        items: [
          "Account management",
          "Verification",
          "Care matching",
          "Booking",
          "Payment",
          "Customer support",
          "Safety",
          "Fraud prevention",
          "Dispute resolution",
          "Legal compliance",
        ],
      },
    ],
  },
  {
    id: "section-4",
    number: 4,
    title: "Sensitive and Health-Related Information",
    blocks: [
      {
        type: "p",
        text: "Sensitive or health-related information will receive appropriate safeguards.",
      },
    ],
  },
  {
    id: "section-5",
    number: 5,
    title: "Further Details and Data-Subject Rights",
    blocks: [
      {
        type: "p",
        text: "This Privacy Policy provides information about data collection, processing, sharing, retention, security and data-subject rights. For questions or privacy requests, contact CareVYA through the Contact page and mark your request as a privacy or data-protection enquiry.",
      },
    ],
  },
];
