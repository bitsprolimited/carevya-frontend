import type { CareRecipient } from "@/features/dashboard/types";
import type { CaregiverProfile } from "@/features/dashboard/types/caregiver-profile";

export function buildCaregiverMessageDraft({
  caregiver,
  recipient,
  seekerName,
}: {
  caregiver: CaregiverProfile;
  recipient: CareRecipient;
  seekerName: string;
}): string {
  const relationship = recipient.relationship.toLowerCase();
  return [
    `Hello ${caregiver.firstName}, I'm looking for care for my ${relationship} and your profile looks like a great fit.`,
    "",
    `• Area: ${recipient.area}, ${recipient.city}`,
    `• Caring for: ${recipient.relationship}, ${recipient.age}`,
    `• Type of care: ${caregiver.categoryLabel.replace(/ · .*$/, "")}`,
    `• Arrangement: Live-in`,
    `• Starting: As soon as possible (Thu, 15 Oct)`,
    "",
    "Please let me know if you're available.",
    `Thank you, ${seekerName}`,
  ].join("\n");
}
