export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type LegalSection = {
  id: string;
  number: number;
  title: string;
  blocks: LegalBlock[];
};

export const TERMS_INTRO =
  "This document is a working legal/product draft prepared for CareVYA and should be reviewed, amended and approved by qualified legal counsel in Nigeria before publication or launch.";

export const TERMS_LAST_UPDATED = "October 2026";

export const TERMS_SECTIONS: LegalSection[] = 
[
  {
    "id": "section-1",
    "number": 1,
    "title": "About These Terms",
    "blocks": [
      {
        "type": "p",
        "text": "These Terms & Conditions (\"Terms\") govern your access to and use of the CareVYA website, web application, mobile application, marketplace, communication tools, booking services and related services (collectively, the \"Platform\")."
      },
      {
        "type": "p",
        "text": "The Platform is operated by CareVYA, a company registered in Nigeria."
      },
      {
        "type": "p",
        "text": "By creating an account, accessing the Platform, submitting an enquiry, making a booking, providing care services through the Platform, or otherwise using CareVYA, you agree to be bound by these Terms, our Privacy Policy and any other policies expressly incorporated into these Terms."
      },
      {
        "type": "p",
        "text": "If you do not agree to these Terms, you must not use the Platform."
      },
      {
        "type": "p",
        "text": "When you use CareVYA on behalf of another person, household, family, company or organisation, you confirm that you have the authority to do so and that you have the authority to accept these Terms on their behalf."
      }
    ]
  },
  {
    "id": "section-2",
    "number": 2,
    "title": "What CareVYA Does",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA is a technology-enabled elderly-care marketplace that helps families and other authorised users discover, evaluate and connect with independent carers and other care providers."
      },
      {
        "type": "p",
        "text": "Depending on the services available on the Platform, CareVYA may provide:"
      },
      {
        "type": "ul",
        "items": [
          "Caregiver discovery",
          "Caregiver profiles",
          "Verification information",
          "Search and filtering",
          "Care-needs matching",
          "Enquiries and communication",
          "Booking management",
          "Payment facilitation",
          "Reviews and ratings",
          "Support and complaints handling",
          "Care-related communication and updates"
        ]
      }
    ]
  },
  {
    "id": "section-3",
    "number": 3,
    "title": "CareVYA's Role as a Marketplace",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA operates primarily as a marketplace and technology platform."
      },
      {
        "type": "p",
        "text": "CareVYA may facilitate discovery, verification, communication, booking, payment, support and other marketplace functions."
      }
    ]
  },
  {
    "id": "section-4",
    "number": 4,
    "title": "Eligibility",
    "blocks": [
      {
        "type": "p",
        "text": "To create an account and use CareVYA, you must:"
      },
      {
        "type": "ul",
        "items": [
          "Be at least 18 years old; or"
        ]
      },
      {
        "type": "p",
        "text": "Meet any alternative legal requirements approved by CareVYA for a particular service."
      },
      {
        "type": "p",
        "text": "You must have the legal capacity to enter into a binding agreement."
      },
      {
        "type": "p",
        "text": "CareVYA may request additional information where reasonably necessary for identity verification, safety, payment, legal or regulatory requirements."
      },
      {
        "type": "p",
        "text": "CareVYA may refuse, suspend or restrict access where eligibility requirements are not satisfied."
      }
    ]
  },
  {
    "id": "section-5",
    "number": 5,
    "title": "Creating and Maintaining an Account",
    "blocks": [
      {
        "type": "p",
        "text": "You agree to provide accurate, current and complete information when creating and maintaining your account."
      },
      {
        "type": "p",
        "text": "You must not:"
      },
      {
        "type": "ul",
        "items": [
          "Create an account using another person's identity",
          "Provide false or misleading information",
          "Misrepresent your qualifications or experience",
          "Allow another person to use your account without permission",
          "Attempt to bypass verification requirements",
          "Maintain multiple accounts for deceptive purposes",
          "You are responsible for keeping your login credentials secure."
        ]
      },
      {
        "type": "p",
        "text": "You must notify CareVYA promptly if you suspect unauthorized access to your account."
      },
      {
        "type": "p",
        "text": "CareVYA may require additional verification before allowing certain activities, including booking, receiving payments or providing care services."
      }
    ]
  },
  {
    "id": "section-6",
    "number": 6,
    "title": "Information About the Care Recipient",
    "blocks": [
      {
        "type": "p",
        "text": "Where a Family uses CareVYA to arrange care for another person, the Family must provide information that is reasonably necessary to identify and understand the care recipient's needs."
      },
      {
        "type": "p",
        "text": "This may include:"
      },
      {
        "type": "ul",
        "items": [
          "Basic personal information",
          "Age",
          "Location",
          "Care needs",
          "Mobility requirements",
          "Relevant health or care information",
          "Preferences",
          "Behavioural considerations",
          "Emergency information",
          "Relevant allergies or medication information where necessary for the agreed care",
          "Users must only provide information they are authorised to provide."
        ]
      },
      {
        "type": "p",
        "text": "Users must not knowingly provide false, misleading or materially incomplete information where that information could affect the safety or suitability of care."
      },
      {
        "type": "p",
        "text": "Where health information or other sensitive personal information is required, it will be handled in accordance with CareVYA's Privacy Policy and applicable Nigerian data-protection requirements."
      }
    ]
  },
  {
    "id": "section-7",
    "number": 7,
    "title": "Carer Registration and Verification",
    "blocks": [
      {
        "type": "p",
        "text": "Carers may be required to provide information and documents necessary for registration, matching, safety and verification."
      },
      {
        "type": "p",
        "text": "This may include:"
      },
      {
        "type": "ul",
        "items": [
          "Full name",
          "Contact details",
          "Age",
          "Gender",
          "Location",
          "Experience",
          "Qualifications and training",
          "Areas of care expertise",
          "Specialties",
          "Languages",
          "Availability",
          "Pricing information",
          "Profile photograph",
          "Government-issued identification",
          "NIN or other appropriate identity information",
          "Certificates or professional documents",
          "References",
          "Guarantor information where applicable",
          "Emergency contact information",
          "Other information reasonably required for verification"
        ]
      },
      {
        "type": "p",
        "text": "CareVYA may conduct or arrange appropriate verification checks, which may include identity, qualification, reference, background or other checks where legally and operationally appropriate.A carer must provide truthful information and must not submit fraudulent, altered, expired or misleading documents.CareVYA may classify a verification status as, for example:"
      },
      {
        "type": "ul",
        "items": [
          "Pending",
          "Verified",
          "Further Review Required",
          "Rejected",
          "Suspended"
        ]
      }
    ]
  },
  {
    "id": "section-8",
    "number": 8,
    "title": "Carer Responsibilities",
    "blocks": [
      {
        "type": "p",
        "text": "Carers using CareVYA agree to:"
      },
      {
        "type": "ul",
        "items": [
          "Provide truthful information about their identity, qualifications and experience",
          "Only accept care work they are qualified and capable of performing",
          "Keep their profile information accurate",
          "Maintain required qualifications, registrations or licences where applicable",
          "Respect the dignity and privacy of care recipients",
          "Provide care professionally and responsibly",
          "Follow agreed care arrangements",
          "Communicate promptly with Families",
          "Report relevant incidents or safety concerns",
          "Follow applicable laws and professional requirements",
          "Avoid discrimination, abuse, harassment or exploitation",
          "Not delegate care to another person without appropriate authorisation",
          "Not misrepresent themselves as a medical professional where they are not one"
        ]
      },
      {
        "type": "p",
        "text": "Carers must not perform clinical procedures or regulated professional activities for which they are not legally qualified or authorised."
      }
    ]
  },
  {
    "id": "section-9",
    "number": 9,
    "title": "Family Responsibilities",
    "blocks": [
      {
        "type": "p",
        "text": "Families using CareVYA agree to:"
      },
      {
        "type": "ul",
        "items": [
          "Provide accurate information about the care recipient",
          "Clearly communicate care expectations",
          "Provide relevant information necessary for safe care",
          "Treat carers respectfully",
          "Provide a reasonably safe environment for care",
          "Disclose relevant risks that may affect the carer or care recipient",
          "Pay agreed booking charges promptly",
          "Communicate changes to care arrangements",
          "Report concerns through appropriate CareVYA channels",
          "Avoid discrimination, harassment, abuse or exploitation",
          "Not request carers to perform unlawful or unsafe activities"
        ]
      },
      {
        "type": "p",
        "text": "Families should not request a carer to perform duties outside their stated skills, qualifications or agreed scope of care."
      }
    ]
  },
  {
    "id": "section-10",
    "number": 10,
    "title": "Care Services and Bookings",
    "blocks": [
      {
        "type": "p",
        "text": "Care services are arranged between the Family and the relevant carer or provider, subject to CareVYA's Platform rules."
      },
      {
        "type": "p",
        "text": "Before a booking is confirmed, users may need to agree on:"
      },
      {
        "type": "ul",
        "items": [
          "Type of care",
          "Date and duration",
          "Location",
          "Care requirements",
          "Availability",
          "Price",
          "Communication arrangements",
          "Additional requirements",
          "Any relevant cancellation conditions"
        ]
      },
      {
        "type": "p",
        "text": "A booking is only considered confirmed when the required booking and payment process has been completed through the Platform or as otherwise expressly confirmed by CareVYA.  CareVYA may decline or restrict bookings where there are safety, verification, payment, legal or other legitimate concerns."
      }
    ]
  },
  {
    "id": "section-11",
    "number": 11,
    "title": "Communication",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA may provide communication channels including in-platform messaging, phone, email, WhatsApp, SMS or other channels depending on the features available."
      },
      {
        "type": "p",
        "text": "Users must use communication channels responsibly."
      },
      {
        "type": "p",
        "text": "Users must not use CareVYA's communication tools to:"
      },
      {
        "type": "ul",
        "items": [
          "Harass or threaten another person",
          "Send abusive or discriminatory content",
          "Share fraudulent information",
          "Request unlawful services",
          "Circumvent CareVYA's payment or booking process for the purpose of avoiding applicable fees",
          "Attempt to obtain another user's sensitive information without a legitimate reason"
        ]
      },
      {
        "type": "p",
        "text": "CareVYA may retain or review communications where reasonably necessary for safety, complaints, fraud prevention, dispute resolution, legal compliance or Platform operation, subject to applicable privacy requirements."
      }
    ]
  },
  {
    "id": "section-12",
    "number": 12,
    "title": "Payments",
    "blocks": [
      {
        "type": "p",
        "text": "Where payment is available through CareVYA, Families must pay through the payment method made available on the Platform."
      },
      {
        "type": "p",
        "text": "Payment may be processed by an authorised third-party payment provider."
      },
      {
        "type": "p",
        "text": "CareVYA does not normally store full card details where payment processing is handled by a third-party provider."
      },
      {
        "type": "p",
        "text": "Before payment, the Family should be shown the applicable amount, including any CareVYA fee or other applicable charge."
      },
      {
        "type": "p",
        "text": "Users must not use fraudulent payment methods or attempt to manipulate, reverse or circumvent legitimate payment obligations."
      }
    ]
  },
  {
    "id": "section-13",
    "number": 13,
    "title": "CareVYA Commission",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA may charge a commission or other applicable marketplace fee on successful care bookings."
      },
      {
        "type": "p",
        "text": "The applicable commission or fee will be disclosed before or at the relevant transaction stage."
      }
    ]
  },
  {
    "id": "section-14",
    "number": 14,
    "title": "Carer Payouts",
    "blocks": [
      {
        "type": "p",
        "text": "Where CareVYA facilitates payments to carers, the amount payable to the carer will generally be the applicable booking amount less any agreed CareVYA commission, applicable payment charges or other authorised deductions."
      },
      {
        "type": "p",
        "text": "Payout may be made after:"
      },
      {
        "type": "ul",
        "items": [
          "Completion of the booking",
          "Confirmation of completion",
          "Expiry of an applicable dispute period",
          "Resolution of an outstanding dispute",
          "Completion of required verification or payment checks"
        ]
      },
      {
        "type": "p",
        "text": "CareVYA may delay or restrict a payout where reasonably necessary to investigate:"
      },
      {
        "type": "ul",
        "items": [
          "Fraud",
          "Payment disputes",
          "Safety incidents",
          "Complaints",
          "Chargebacks",
          "Suspected policy violations",
          "Legal or regulatory issues",
          "."
        ]
      }
    ]
  },
  {
    "id": "section-15",
    "number": 15,
    "title": "Payment Provider",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA may use one or more third-party payment providers."
      },
      {
        "type": "p",
        "text": "The payment provider may have its own terms, privacy policy and processing requirements."
      },
      {
        "type": "p",
        "text": "Payment providers may conduct their own verification, fraud monitoring and compliance checks."
      },
      {
        "type": "p",
        "text": "CareVYA may change payment providers where reasonably necessary."
      }
    ]
  },
  {
    "id": "section-16",
    "number": 16,
    "title": "Cancellations",
    "blocks": [
      {
        "type": "p",
        "text": "A booking may be cancelled by a Family or carer subject to the applicable cancellation terms communicated at the time of booking."
      },
      {
        "type": "p",
        "text": "Cancellation rules may depend on:"
      },
      {
        "type": "ul",
        "items": [
          "How early the cancellation is made",
          "The reason for cancellation",
          "Whether care has already started",
          "Whether the carer has incurred reasonable costs",
          "Whether a replacement carer can be arranged",
          "Whether there is a safety or emergency concern",
          "CareVYA may establish different cancellation rules for different care services."
        ]
      },
      {
        "type": "p",
        "text": "Where a cancellation policy applies, the applicable policy displayed during booking will take precedence for that booking."
      }
    ]
  },
  {
    "id": "section-17",
    "number": 17,
    "title": "Refunds",
    "blocks": [
      {
        "type": "p",
        "text": "Refunds will be handled according to the applicable booking and cancellation policy."
      },
      {
        "type": "p",
        "text": "A refund may be available where:"
      },
      {
        "type": "ul",
        "items": [
          "A booking is cancelled within an eligible period",
          "Care was not provided",
          "A carer cancels and an alternative arrangement cannot be made",
          "A payment was processed incorrectly",
          "CareVYA determines that a refund is appropriate following an investigation",
          "A refund is required by applicable law"
        ]
      },
      {
        "type": "p",
        "text": "Refunds may be reduced by legitimate non-refundable charges where disclosed and legally permitted."
      },
      {
        "type": "p",
        "text": "Where payment has already been transferred or partially paid to a carer, CareVYA may need to investigate before processing a refund."
      }
    ]
  },
  {
    "id": "section-18",
    "number": 18,
    "title": "Disputes and Complaints",
    "blocks": [
      {
        "type": "p",
        "text": "Users should first report disputes or complaints to CareVYA through the available support channels."
      },
      {
        "type": "p",
        "text": "Complaints may relate to:"
      },
      {
        "type": "ul",
        "items": [
          "Booking issues",
          "Payment problems",
          "Service quality",
          "Misrepresentation",
          "Safety concerns",
          "Missing payments",
          "Inappropriate conduct",
          "Verification concerns",
          "Damage or loss",
          "Communication problems"
        ]
      },
      {
        "type": "p",
        "text": "CareVYA may request information from the relevant parties and review available records."
      },
      {
        "type": "p",
        "text": "Where appropriate, CareVYA may:"
      },
      {
        "type": "ul",
        "items": [
          "Contact the parties",
          "Request supporting evidence",
          "Review booking information",
          "Review relevant communications",
          "Temporarily restrict accounts",
          "Delay a payout",
          "Facilitate a resolution",
          "Refer serious matters to appropriate authorities"
        ]
      },
      {
        "type": "p",
        "text": "CareVYA does not guarantee that every dispute can be resolved in favour of either party."
      },
      {
        "type": "p",
        "text": "Nothing in this section prevents a user from exercising rights available under applicable Nigerian law."
      }
    ]
  },
  {
    "id": "section-19",
    "number": 19,
    "title": "Safety and Emergency Situations",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA is not an emergency response service."
      },
      {
        "type": "p",
        "text": "If a care recipient is experiencing a medical emergency, immediate danger, abuse or another situation requiring urgent intervention, users should contact the appropriate emergency service, medical facility, police or other competent authority."
      },
      {
        "type": "p",
        "text": "CareVYA should be notified where appropriate after immediate safety has been addressed."
      },
      {
        "type": "p",
        "text": "Users must report serious safety concerns to CareVYA as soon as reasonably possible."
      },
      {
        "type": "p",
        "text": "CareVYA may suspend accounts or restrict access where it reasonably believes there is a serious safety risk."
      },
      {
        "type": "p",
        "text": "Prohibited conduct includes:"
      },
      {
        "type": "ul",
        "items": [
          "Physical abuse",
          "Sexual abuse",
          "Financial exploitation",
          "Threats",
          "Neglect",
          "Deliberate harm",
          "Theft",
          "Harassment",
          "Unlawful confinement",
          "Exploitation of a vulnerable person"
        ]
      },
      {
        "type": "p",
        "text": "Serious incidents may be reported to relevant authorities where appropriate or legally required."
      }
    ]
  },
  {
    "id": "section-20",
    "number": 20,
    "title": "Medical and Health-Related Services",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA is primarily an elderly-care marketplace and does not automatically constitute a medical or clinical service."
      },
      {
        "type": "p",
        "text": "A carer's profile, experience or verification status must not be interpreted as authorisation to provide medical treatment beyond that person's qualifications and legal scope."
      },
      {
        "type": "p",
        "text": "Where clinical or regulated healthcare services are required, users should engage appropriately licensed healthcare professionals or appropriate healthcare facilities."
      },
      {
        "type": "p",
        "text": "CareVYA does not replace:"
      },
      {
        "type": "ul",
        "items": [
          "Emergency medical services",
          "Hospitals",
          "Doctors",
          "Nurses",
          "Pharmacists",
          "Other regulated healthcare professionals"
        ]
      },
      {
        "type": "p",
        "text": "Users are responsible for ensuring that the care arranged is appropriate to the care recipient's needs."
      }
    ]
  },
  {
    "id": "section-21",
    "number": 21,
    "title": "Reviews and Ratings",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA may allow Families and carers to submit ratings, reviews or feedback after a care experience."
      },
      {
        "type": "p",
        "text": "Reviews must be:"
      },
      {
        "type": "ul",
        "items": [
          "Honest",
          "Relevant",
          "Based on genuine experience",
          "Respectful",
          "Free from threats or harassment"
        ]
      },
      {
        "type": "p",
        "text": "Users must not:"
      },
      {
        "type": "ul",
        "items": [
          "Submit fake reviews",
          "Pay another person to create a review",
          "Manipulate ratings",
          "Submit multiple reviews for the same experience",
          "Use reviews to threaten another user",
          "Publish another person's private information"
        ]
      },
      {
        "type": "p",
        "text": "CareVYA may remove or restrict reviews that violate these Terms or applicable law."
      }
    ]
  },
  {
    "id": "section-22",
    "number": 22,
    "title": "Prohibited Conduct",
    "blocks": [
      {
        "type": "p",
        "text": "Users must not use CareVYA to:"
      },
      {
        "type": "ul",
        "items": [
          "Commit fraud",
          "Impersonate another person",
          "Submit false information",
          "Upload fraudulent documents",
          "Misrepresent qualifications",
          "Harass, threaten or abuse another user",
          "Discriminate unlawfully",
          "Exploit a vulnerable person",
          "Request unlawful services",
          "Facilitate criminal activity",
          "Circumvent payment fees",
          "Manipulate bookings",
          "Manipulate reviews",
          "Attempt to access another user's account",
          "Introduce malware",
          "Attack or disrupt the Platform",
          "Scrape or commercially extract Platform data without permission",
          "Circumvent verification systems",
          "Use another person's identity documents without lawful authority",
          "Collect sensitive information from another user without a legitimate reason",
          "CareVYA may take appropriate action where prohibited conduct is suspected."
        ]
      }
    ]
  },
  {
    "id": "section-23",
    "number": 23,
    "title": "Account Suspension and Termination",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA may suspend, restrict or terminate an account where:"
      },
      {
        "type": "ul",
        "items": [
          "These Terms are breached",
          "False or fraudulent information is provided",
          "Verification cannot be completed",
          "There is a credible safety concern",
          "A serious complaint is received",
          "Fraud is suspected",
          "Payment abuse is suspected",
          "The account creates a risk to other users or the Platform",
          "The user violates applicable law",
          "CareVYA is required to do so by law or a competent authority"
        ]
      },
      {
        "type": "p",
        "text": "Where reasonably possible, CareVYA may provide notice and an opportunity to respond."
      },
      {
        "type": "p",
        "text": "However, immediate restriction may occur where necessary to protect users, prevent fraud, preserve evidence or address an urgent safety concern."
      },
      {
        "type": "p",
        "text": "Users may request clarification or appeal a restriction where an appeal process is available."
      },
      {
        "type": "p",
        "text": "Termination does not remove obligations that arose before termination."
      }
    ]
  },
  {
    "id": "section-24",
    "number": 24,
    "title": "Privacy and Personal Data",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA collects and processes personal information in accordance with its Privacy Policy and applicable Nigerian data-protection requirements."
      },
      {
        "type": "p",
        "text": "Depending on how the Platform is used, information may include:"
      },
      {
        "type": "ul",
        "items": [
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
          "Technical and usage information"
        ]
      },
      {
        "type": "p",
        "text": "CareVYA will process personal data for legitimate purposes connected with operating, securing and improving the Platform, including where necessary:"
      },
      {
        "type": "ul",
        "items": [
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
          "Sensitive or health-related information will receive appropriate safeguards."
        ]
      },
      {
        "type": "p",
        "text": "Users should review the CareVYA Privacy Policy for detailed information about data collection, processing, sharing, retention, security and data-subject rights."
      }
    ]
  },
  {
    "id": "section-25",
    "number": 25,
    "title": "Third-Party Services",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA may integrate with third-party services including:"
      },
      {
        "type": "ul",
        "items": [
          "Payment providers",
          "Identity verification providers",
          "Communication services",
          "Analytics providers",
          "Cloud hosting providers",
          "Background-check or verification providers",
          "Customer support tools",
          "Third-party services may have separate terms and privacy policies."
        ]
      },
      {
        "type": "p",
        "text": "CareVYA will take reasonable steps to select and manage relevant third-party services, but cannot guarantee the availability or performance of every third-party service."
      }
    ]
  },
  {
    "id": "section-26",
    "number": 26,
    "title": "Intellectual Property",
    "blocks": [
      {
        "type": "p",
        "text": "The CareVYA name, logo, branding, website design, software, databases, graphics, text, interfaces and other original Platform materials belong to CareVYA or its licensors unless otherwise stated."
      },
      {
        "type": "p",
        "text": "Users may use the Platform only for its intended purpose."
      },
      {
        "type": "p",
        "text": "Users must not, without appropriate permission:"
      },
      {
        "type": "ul",
        "items": [
          "Copy CareVYA's branding",
          "Reproduce the Platform",
          "Reverse engineer the software",
          "Scrape Platform content",
          "Sell or redistribute Platform content",
          "Create a competing service using proprietary CareVYA materials",
          "Remove copyright or ownership notices"
        ]
      },
      {
        "type": "p",
        "text": "Nothing in these Terms transfers ownership of CareVYA's intellectual property to a user."
      }
    ]
  },
  {
    "id": "section-27",
    "number": 27,
    "title": "User Content",
    "blocks": [
      {
        "type": "p",
        "text": "Users may submit information, photographs, reviews, messages, documents and other content to CareVYA."
      },
      {
        "type": "p",
        "text": "Users remain responsible for the content they submit and must have the necessary rights and permissions to provide it."
      },
      {
        "type": "p",
        "text": "By submitting content, users grant CareVYA a limited, non-exclusive licence to store, process, display and use that content as reasonably necessary to operate the Platform and provide the requested services, subject to the Privacy Policy and applicable law."
      },
      {
        "type": "p",
        "text": "CareVYA may remove content that:"
      },
      {
        "type": "ul",
        "items": [
          "Violates these Terms",
          "Is unlawful",
          "Is fraudulent",
          "Creates a safety risk",
          "Infringes another person's rights",
          "Contains prohibited material"
        ]
      }
    ]
  },
  {
    "id": "section-28",
    "number": 28,
    "title": "Availability of the Platform",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA aims to provide a reliable Platform but does not guarantee that the Platform will always be:"
      },
      {
        "type": "ul",
        "items": [
          "Available",
          "Uninterrupted",
          "Error-free",
          "Free from security vulnerabilities",
          "Compatible with every device"
        ]
      },
      {
        "type": "p",
        "text": "The Platform may occasionally be unavailable due to:"
      },
      {
        "type": "ul",
        "items": [
          "Maintenance",
          "Technical problems",
          "Security incidents",
          "Network failures",
          "Third-party service failures",
          "Regulatory requirements",
          "Events outside CareVYA's reasonable control",
          "CareVYA may modify, suspend or discontinue features where reasonably necessary."
        ]
      }
    ]
  },
  {
    "id": "section-29",
    "number": 29,
    "title": "Limitation of CareVYA's Role and Liability",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA provides technology and marketplace services and does not guarantee the conduct, performance, suitability or future availability of any individual carer."
      },
      {
        "type": "p",
        "text": "To the extent permitted by applicable law, CareVYA is not responsible for losses arising solely from:"
      },
      {
        "type": "ul",
        "items": [
          "A user's independent actions",
          "A carer's conduct outside CareVYA's reasonable control",
          "Inaccurate information supplied by users",
          "A failure to follow agreed care instructions",
          "Events outside CareVYA's reasonable control",
          "Third-party payment or communication failures"
        ]
      },
      {
        "type": "p",
        "text": "However, nothing in these Terms is intended to exclude or limit liability that cannot lawfully be excluded or limited under Nigerian law, including liability that arises from fraud or other liability that applicable law does not permit CareVYA to exclude."
      },
      {
        "type": "p",
        "text": "CareVYA's verification process is a risk-management and trust mechanism and is not a guarantee that a user or carer will never cause harm."
      }
    ]
  },
  {
    "id": "section-30",
    "number": 30,
    "title": "Indemnity",
    "blocks": [
      {
        "type": "p",
        "text": "To the extent permitted by law, a user agrees to indemnify and hold harmless CareVYA, its directors, employees, officers, contractors and authorised representatives from claims, losses, liabilities, costs and reasonable expenses arising from:"
      },
      {
        "type": "ul",
        "items": [
          "The user's breach of these Terms",
          "Fraudulent or unlawful conduct",
          "Misuse of the Platform",
          "False information submitted by the user",
          "Infringement of another person's rights",
          "Unauthorised use of the user's account"
        ]
      },
      {
        "type": "p",
        "text": "This provision does not require a user to indemnify CareVYA for losses caused by CareVYA's own conduct to the extent such indemnification would be unlawful."
      }
    ]
  },
  {
    "id": "section-31",
    "number": 31,
    "title": "Changes to These Terms",
    "blocks": [
      {
        "type": "p",
        "text": "CareVYA may update these Terms from time to time for reasons including:"
      },
      {
        "type": "ul",
        "items": [
          "Legal or regulatory changes",
          "New Platform features",
          "Changes to payment arrangements",
          "Safety improvements",
          "Operational changes",
          "Changes to business practices",
          "Where changes are material, CareVYA will take reasonable steps to notify users."
        ]
      },
      {
        "type": "p",
        "text": "The updated version will be published on the Platform with an updated \"Last Updated\" date."
      },
      {
        "type": "p",
        "text": "Where required by law, users will be given an appropriate opportunity to review and accept material changes."
      }
    ]
  },
  {
    "id": "section-32",
    "number": 32,
    "title": "Governing Law",
    "blocks": [
      {
        "type": "p",
        "text": "These Terms are governed by and interpreted in accordance with the laws of the Federal Republic of Nigeria."
      },
      {
        "type": "p",
        "text": "Subject to any mandatory rights or dispute-resolution requirements applicable to a user, disputes arising from these Terms shall be handled in accordance with the dispute-resolution process set out by CareVYA and applicable Nigerian law."
      }
    ]
  },
  {
    "id": "section-33",
    "number": 33,
    "title": "Severability",
    "blocks": [
      {
        "type": "p",
        "text": "If any provision of these Terms is found to be invalid, unlawful or unenforceable by a competent authority, that provision will be modified or removed only to the extent necessary."
      },
      {
        "type": "p",
        "text": "The remaining provisions will continue to apply."
      }
    ]
  },
  {
    "id": "section-34",
    "number": 34,
    "title": "No Waiver",
    "blocks": [
      {
        "type": "p",
        "text": "If CareVYA does not immediately enforce a provision of these Terms, this does not mean that CareVYA has permanently waived its right to enforce that provision."
      },
      {
        "type": "p",
        "text": "Any waiver must be expressly made by an authorised representative of CareVYA."
      }
    ]
  },
  {
    "id": "section-35",
    "number": 35,
    "title": "Entire Agreement",
    "blocks": [
      {
        "type": "p",
        "text": "These Terms, together with the CareVYA Privacy Policy and any other policies or terms expressly incorporated into them, form the agreement governing the user's use of the Platform."
      },
      {
        "type": "p",
        "text": "Specific booking, payment, cancellation or service terms displayed and accepted during a transaction may also apply to that transaction."
      },
      {
        "type": "p",
        "text": "Where a specific transaction term conflicts with these general Terms, the specific transaction term will apply to that transaction to the extent of the conflict, unless applicable law requires otherwise."
      }
    ]
  },
  {
    "id": "section-36",
    "number": 36,
    "title": "Contact & Support",
    "blocks": [
      {
        "type": "p",
        "text": "If you have a question, complaint, safety concern, payment issue or other concern relating to CareVYA, you may contact us through the CareVYA Contact page or support channels published on the Platform."
      },
      {
        "type": "p",
        "text": "For privacy or personal-data requests, contact CareVYA through the same support channels and mark your request as a privacy or data-protection enquiry."
      },
      {
        "type": "p",
        "text": "For urgent medical or safety emergencies, do not rely on CareVYA support as an emergency response service. Contact the appropriate emergency service or healthcare facility immediately."
      }
    ]
  },
  {
    "id": "section-37",
    "number": 37,
    "title": "Acceptance",
    "blocks": [
      {
        "type": "p",
        "text": "By creating an account, accessing the Platform, submitting a booking, accepting a booking, providing care services through CareVYA, or otherwise using CareVYA, you confirm that:"
      },
      {
        "type": "ul",
        "items": [
          "You have read these Terms;",
          "You understand these Terms;",
          "You agree to be legally bound by these Terms;",
          "You will provide accurate information;",
          "You will comply with applicable laws;"
        ]
      },
      {
        "type": "p",
        "text": "You will respect the safety, dignity and privacy of other users and care recipients."
      },
      {
        "type": "p",
        "text": "Where required, CareVYA may require you to actively confirm acceptance by selecting an acceptance checkbox or completing another electronic acceptance process."
      }
    ]
  }
];
