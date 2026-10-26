import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LovedOneProfileView } from "@/features/dashboard/components/loved-one-profile-view";
import {
  getLovedOneProfile,
  getLovedOneProfileIds,
} from "@/features/dashboard/data/loved-one-profiles";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getLovedOneProfileIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = getLovedOneProfile(id);
  if (!profile) {
    return { title: "Loved one not found" };
  }
  return {
    title: profile.fullName,
    description: `Care profile for ${profile.fullName}`,
  };
}

export default async function LovedOneProfilePage({ params }: PageProps) {
  const { id } = await params;
  const profile = getLovedOneProfile(id);
  if (!profile) {
    notFound();
  }

  return <LovedOneProfileView profile={profile} />;
}
