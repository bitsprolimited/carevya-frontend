import type { CareProfileDraft, Relationship } from "@/features/care-profile/types";

type PronounSet = {
  subject: string;
  object: string;
  possessive: string;
  possessiveNoun: string;
  label: string;
};

const femaleRelationships: Relationship[] = [
  "Grandmother",
  "Mother",
  "Wife",
  "Sister",
  "Aunt",
];

const maleRelationships: Relationship[] = [
  "Grandfather",
  "Father",
  "Husband",
  "Brother",
  "Uncle",
];

export function getCarePronouns(draft: CareProfileDraft): PronounSet {
  if (draft.recipient === "myself") {
    return {
      subject: "you",
      object: "you",
      possessive: "your",
      possessiveNoun: "yours",
      label: "you",
    };
  }

  const relationship = draft.relationship;
  if (relationship && femaleRelationships.includes(relationship)) {
    return {
      subject: "she",
      object: "her",
      possessive: "her",
      possessiveNoun: "hers",
      label: relationship.toLowerCase(),
    };
  }

  if (relationship && maleRelationships.includes(relationship)) {
    return {
      subject: "he",
      object: "him",
      possessive: "his",
      possessiveNoun: "his",
      label: relationship.toLowerCase(),
    };
  }

  return {
    subject: "they",
    object: "them",
    possessive: "their",
    possessiveNoun: "theirs",
    label: "them",
  };
}

export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
