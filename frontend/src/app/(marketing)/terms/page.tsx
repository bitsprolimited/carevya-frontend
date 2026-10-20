import type { Metadata } from "next";
import { HomeHeader } from "@/components/shared/home-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { LegalDocument } from "@/features/legal/components/legal-document";
import {
  TERMS_INTRO,
  TERMS_LAST_UPDATED,
  TERMS_SECTIONS,
} from "@/features/legal/content/terms";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms & Conditions governing your use of the CareVYA elderly-care marketplace platform in Nigeria.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-col bg-[#F5F7FB]">
      <HomeHeader variant="solid" />
      <div className="flex-1">
        <LegalDocument
          title="Terms & Conditions"
          lastUpdated={TERMS_LAST_UPDATED}
          intro={TERMS_INTRO}
          sections={TERMS_SECTIONS}
        />
      </div>
      <SiteFooter />
    </div>
  );
}
