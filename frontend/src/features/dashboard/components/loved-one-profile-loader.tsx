"use client";

import { useEffect, useState } from "react";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { LovedOneProfileView } from "@/features/dashboard/components/loved-one-profile-view";
import { fetchLovedOneProfile } from "@/features/dashboard/lib/map-loved-one-from-api";
import type { LovedOneProfile } from "@/features/dashboard/types/loved-one";
import { ApiError } from "@/lib/api";

export function LovedOneProfileLoader({ id }: { id: string }) {
  const [profile, setProfile] = useState<LovedOneProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const result = await fetchLovedOneProfile(id);
        if (cancelled) return;
        if (result) setProfile(result);
        else setError("Profile not found");
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("Profile not found");
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load this care profile.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <CareseekerShell>
        <div className="flex flex-1 items-center justify-center px-4 py-16 text-sm text-navy/55">
          Loading care profile…
        </div>
      </CareseekerShell>
    );
  }

  if (error || !profile) {
    return (
      <CareseekerShell>
        <div className="flex flex-1 items-center justify-center px-4 py-16 text-sm text-red-600">
          {error ?? "Profile not found"}
        </div>
      </CareseekerShell>
    );
  }

  return <LovedOneProfileView profile={profile} recipientId={id} />;
}
