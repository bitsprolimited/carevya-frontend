import type { LegalSection } from "@/features/legal/content/terms";

export const PRIVACY_INTRO =
  "Placeholder Privacy Policy copy. Replace this lorem ipsum with the approved CareVYA privacy policy before launch.";

export const PRIVACY_LAST_UPDATED = "October 2026";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "section-1",
    number: 1,
    title: "Introduction",
    blocks: [
      {
        type: "p",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
      {
        type: "p",
        text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.",
      },
      {
        type: "p",
        text: "This may include:",
      },
      {
        type: "ul",
        items: [
          "Lorem ipsum dolor sit amet",
          "Consectetur adipiscing elit",
          "Sed do eiusmod tempor incididunt",
          "Ut labore et dolore magna aliqua",
          "Quis nostrud exercitation ullamco",
        ],
      },
    ],
  },
  {
    id: "section-3",
    number: 3,
    title: "How We Use Your Information",
    blocks: [
      {
        type: "p",
        text: "Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis.",
      },
      {
        type: "p",
        text: "Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.",
      },
    ],
  },
  {
    id: "section-4",
    number: 4,
    title: "Sharing and Disclosure",
    blocks: [
      {
        type: "p",
        text: "Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit.",
      },
      {
        type: "ul",
        items: [
          "Class aptent taciti sociosqu ad litora",
          "Torquent per conubia nostra",
          "Inceptos himenaeos",
          "Nam nec ante",
        ],
      },
    ],
  },
  {
    id: "section-5",
    number: 5,
    title: "Data Security",
    blocks: [
      {
        type: "p",
        text: "Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet.",
      },
    ],
  },
  {
    id: "section-6",
    number: 6,
    title: "Your Rights",
    blocks: [
      {
        type: "p",
        text: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum.",
      },
      {
        type: "ul",
        items: [
          "Access your personal information",
          "Request correction of inaccurate data",
          "Request deletion where applicable",
          "Object to certain processing activities",
        ],
      },
    ],
  },
  {
    id: "section-7",
    number: 7,
    title: "Contact",
    blocks: [
      {
        type: "p",
        text: "Mauris tincidunt sem sed arcu. Nunc posuere. Nullam malesuada pellentesque erat. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.",
      },
      {
        type: "p",
        text: "For privacy questions, contact CareVYA through the Contact page and mark your request as a privacy enquiry.",
      },
    ],
  },
];
