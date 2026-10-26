import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaregiverProfileView } from "@/features/dashboard/components/caregiver-profile-view";
import {
  getCaregiverProfile,
  getCaregiverProfileIds,
} from "@/features/dashboard/data/caregiver-profiles";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getCaregiverProfileIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = getCaregiverProfile(id);
  if (!profile) {
    return { title: "Caregiver not found" };
  }
  return {
    title: profile.name,
    description: profile.headline,
  };
}

export default async function CaregiverProfilePage({ params }: PageProps) {
  const { id } = await params;
  if (!getCaregiverProfile(id)) {
    notFound();
  }

  return <CaregiverProfileView caregiverId={id} />;
}
