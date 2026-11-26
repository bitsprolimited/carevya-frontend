import type { Metadata } from "next";
import { CaregiverEarningsView } from "@/features/caregiver-dashboard/components/caregiver-earnings-view";

export const metadata: Metadata = {
  title: "Earnings",
  description: "Track payouts, held funds, and withdrawals on CareVYA.",
};

type PageProps = {
  searchParams: Promise<{ emptyAccount?: string }>;
};

export default async function CaregiverEarningsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <CaregiverEarningsView
      initialEmptyAccount={params.emptyAccount === "1"}
    />
  );
}
