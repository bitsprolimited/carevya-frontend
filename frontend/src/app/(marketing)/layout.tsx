import { WaitlistModal } from "@/features/waitlist/components/waitlist-modal";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <WaitlistModal />
    </>
  );
}
