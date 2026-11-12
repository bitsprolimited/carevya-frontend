import type { Metadata } from "next";
import { CaregiverProfileView } from "@/features/dashboard/components/caregiver-profile-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Caregiver",
    description: `Caregiver profile ${id}`,
  };
}

export default async function CaregiverProfilePage({ params }: PageProps) {
  const { id } = await params;
  return <CaregiverProfileView caregiverId={id} />;
}
