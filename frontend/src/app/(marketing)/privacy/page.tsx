import type { Metadata } from "next";
import { HomeHeader } from "@/components/shared/home-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { LegalDocument } from "@/features/legal/components/legal-document";
import {
  PRIVACY_INTRO,
  PRIVACY_LAST_UPDATED,
  PRIVACY_SECTIONS,
} from "@/features/legal/content/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "CareVYA Privacy Policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col bg-[#F5F7FB]">
      <HomeHeader variant="solid" />
      <div className="flex-1">
        <LegalDocument
          title="Privacy Policy"
          lastUpdated={PRIVACY_LAST_UPDATED}
          intro={PRIVACY_INTRO}
          sections={PRIVACY_SECTIONS}
        />
      </div>
      <SiteFooter />
    </div>
  );
}
