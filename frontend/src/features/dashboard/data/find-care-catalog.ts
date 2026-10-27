import { assets } from "@/lib/assets";
import { mockCaregivers } from "@/features/dashboard/data/mock";
import type { Caregiver } from "@/features/dashboard/types";

const EXTRA_NAMES = [
  "Ifeoma Nwosu",
  "Segun Bakare",
  "Fatima Yusuf",
  "Chioma Okeke",
  "Daniel Okoro",
  "Zainab Lawal",
  "Oluwaseun Adebayo",
  "Maryam Suleiman",
  "Ibrahim Musa",
  "Funke Adeleke",
  "Chiamaka Eze",
  "Yusuf Abdullahi",
  "Bola Ogunleye",
  "Aisha Mohammed",
  "Kelvin Nwankwo",
  "Rukayat Bello",
  "Peter Okonkwo",
  "Grace Nnamdi",
  "Sade Ojo",
  "Uchechi Nnaji",
  "Hassan Aliyu",
  "Nneka Ibe",
  "Kunle Fashola",
  "Blessing Okoro",
  "Adaobi Emeka",
  "Tunde Balogun",
  "Mariam Danjuma",
  "Efe Okoro",
  "Yetunde Ajayi",
  "Chuka Obi",
  "Halima Garba",
  "Ireti Ogundipe",
  "Sani Abdullahi",
  "Omolara Bello",
  "Emeka Nwosu",
  "Ngozi Chukwu",
  "Ahmed Bello",
  "Funmilayo Oke",
  "Jide Okonkwo",
  "Patience Eze",
];

const AREAS = [
  "Yaba",
  "Surulere",
  "Ikeja",
  "Gbagada",
  "Lekki",
  "Ajah",
  "Maryland",
  "VI",
  "Ikoyi",
  "Oshodi",
  "Mushin",
  "Akoka",
];

const IMAGES = [
  assets.aboutMemberDevG,
  assets.aboutMemberDesD,
  assets.aboutMemberDevO,
  assets.homeCommitmentPortraitA,
  assets.homeCommitmentPortraitB,
  assets.aboutCoreValuesPhotoA,
  assets.aboutMemberDevE,
  assets.aboutCoreValuesPhotoB,
  assets.homeTestimonialAvatarB,
  assets.homeTestimonialAvatarD,
];

const CATEGORIES: Caregiver["category"][] = [
  "non_clinical",
  "personal_specialized",
  "clinical",
];

const CATEGORY_LABELS: Record<Caregiver["category"], string> = {
  non_clinical: "Non-clinical care",
  personal_specialized: "Personal & specialized care",
  clinical: "Clinical care",
};

function priceFor(category: Caregiver["category"], index: number) {
  if (category === "clinical") {
    const amount = 280_000 + (index % 5) * 20_000;
    return { amount, label: `From ₦${amount.toLocaleString("en-NG")} / month` };
  }
  if (category === "personal_specialized") {
    const amount = 160_000 + (index % 4) * 15_000;
    return { amount, label: `From ₦${amount.toLocaleString("en-NG")} / month` };
  }
  if (index % 7 === 0) {
    const amount = 8_000 + (index % 3) * 2_000;
    return { amount, label: `From ₦${amount.toLocaleString("en-NG")} / day` };
  }
  const amount = 150_000 + (index % 6) * 12_000;
  return { amount, label: `From ₦${amount.toLocaleString("en-NG")} / month` };
}

/** Expanded catalog for Find Care browse (≈48 profiles). */
export function buildFindCareCatalog(): Caregiver[] {
  const base = mockCaregivers.map((item, index) => ({
    ...item,
    booked: index === 0 || index === 3,
    contacted: index === 1 || index === 6,
  }));

  const extras: Caregiver[] = EXTRA_NAMES.map((name, index) => {
    const category = CATEGORIES[index % CATEGORIES.length]!;
    const price = priceFor(category, index);
    const gender: Caregiver["gender"] =
      index % 3 === 0 ? "male" : "female";
    return {
      id: `fc-${index + 1}`,
      name,
      verified: index % 5 !== 0,
      category,
      categoryLabel: CATEGORY_LABELS[category],
      rating: Number((4.4 + (index % 6) * 0.1).toFixed(1)),
      area: AREAS[index % AREAS.length]!,
      city: "Lagos",
      priceLabel: price.label,
      priceAmount: price.amount,
      arrangement:
        index % 4 === 0
          ? "live_in"
          : index % 4 === 1
            ? "full_day"
            : index % 4 === 2
              ? "part_time"
              : "overnight",
      gender,
      languages:
        index % 2 === 0
          ? ["English", "Yoruba"]
          : ["English", "Igbo", "Pidgin"],
      imageUrl: IMAGES[index % IMAGES.length]!,
      saved: index % 8 === 0,
      booked: index === 2,
      contacted: index === 4 || index === 9,
      recipientIds: ["folake", "musa"],
    };
  });

  return [...base, ...extras].slice(0, 48);
}

export const FIND_CARE_PAGE_SIZE = 12;
