"use client";

import { CaregiverShell } from "@/features/caregiver-dashboard/components/caregiver-shell";
import { CaregiverTopbar } from "@/features/caregiver-dashboard/components/caregiver-topbar";

export function CaregiverPlaceholderView({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <CaregiverShell>
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <CaregiverTopbar title={title} subtitle={subtitle} showSearch={false} />
        <div className="rounded-2xl border border-dashed border-[#D7DEE8] bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-sm text-navy/55">
            This section is next — overview data is available on your Dashboard.
          </p>
        </div>
      </div>
    </CaregiverShell>
  );
}
