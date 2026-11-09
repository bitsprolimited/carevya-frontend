import type { Metadata } from "next";
import { LovedOneProfileLoader } from "@/features/dashboard/components/loved-one-profile-loader";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Care profile",
    description: `Care profile ${id}`,
  };
}

export default async function LovedOneProfilePage({ params }: PageProps) {
  const { id } = await params;
  return <LovedOneProfileLoader id={id} />;
}
