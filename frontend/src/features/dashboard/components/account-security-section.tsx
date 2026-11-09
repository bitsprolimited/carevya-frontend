"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  linkSocialAccount,
  listLinkedAccounts,
  listSessions,
  revokeOtherSessions,
  revokeSession,
  unlinkAccount,
} from "@/features/auth/services/auth-service";
import { useHydrated } from "@/hooks/use-hydrated";

type SessionRow = {
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

type AccountRow = {
  id: string;
  providerId?: string;
  accountId?: string;
};

export function AccountSecuritySection({
  onToast,
}: {
  onToast?: (message: string) => void;
}) {
  const hydrated = useHydrated();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyToken, setBusyToken] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    const [sessionsResult, accountsResult] = await Promise.all([
      listSessions(),
      listLinkedAccounts(),
    ]);
    setLoading(false);

    if (!sessionsResult.success) {
      setError(sessionsResult.message);
      return;
    }
    if (!accountsResult.success) {
      setError(accountsResult.message);
      return;
    }

    const sessionData = sessionsResult.data;
    const list = Array.isArray(sessionData)
      ? sessionData
      : Array.isArray((sessionData as { sessions?: unknown })?.sessions)
        ? ((sessionData as { sessions: SessionRow[] }).sessions)
        : [];
    setSessions(list as SessionRow[]);

    const accountData = accountsResult.data;
    const accountList = Array.isArray(accountData)
      ? accountData
      : Array.isArray((accountData as { accounts?: unknown })?.accounts)
        ? ((accountData as { accounts: AccountRow[] }).accounts)
        : [];
    setAccounts(accountList as AccountRow[]);
  }

  useEffect(() => {
    if (!hydrated) return;
    void refresh();
  }, [hydrated]);

  return (
    <section className="mt-5 rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-navy">Account security</h2>
          <p className="mt-1 text-sm text-navy/55">
            Manage signed-in devices and linked social accounts.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="h-9 rounded-full px-4 text-xs"
          disabled={loading}
          onClick={() => void refresh()}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-navy">Active sessions</h3>
        {sessions.length === 0 ? (
          <p className="mt-2 text-sm text-navy/50">
            {loading ? "Loading sessions…" : "No other sessions listed."}
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {sessions.map((session) => (
              <li
                key={session.token}
                className="flex flex-col gap-2 rounded-xl border border-[#E8EEF5] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-navy">
                    {session.userAgent || "Unknown device"}
                  </p>
                  <p className="text-xs text-navy/50">
                    {[session.ipAddress, formatDate(session.updatedAt)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-9 shrink-0 rounded-full px-4 text-xs"
                  disabled={busyToken === session.token}
                  onClick={() => {
                    void (async () => {
                      setBusyToken(session.token);
                      const result = await revokeSession(session.token);
                      setBusyToken(null);
                      if (!result.success) {
                        setError(result.message);
                        return;
                      }
                      onToast?.("Session revoked");
                      await refresh();
                    })();
                  }}
                >
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        )}
        {sessions.length > 1 ? (
          <Button
            type="button"
            variant="secondary"
            className="mt-3 h-9 rounded-full px-4 text-xs"
            onClick={() => {
              void (async () => {
                const result = await revokeOtherSessions();
                if (!result.success) {
                  setError(result.message);
                  return;
                }
                onToast?.("Other sessions revoked");
                await refresh();
              })();
            }}
          >
            Revoke other sessions
          </Button>
        ) : null}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-navy">Linked accounts</h3>
        {accounts.length === 0 ? (
          <p className="mt-2 text-sm text-navy/50">
            {loading ? "Loading accounts…" : "No linked social accounts."}
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="flex flex-col gap-2 rounded-xl border border-[#E8EEF5] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium capitalize text-navy">
                    {account.providerId || "Account"}
                  </p>
                  <p className="text-xs text-navy/50">
                    {account.accountId || account.id}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-9 shrink-0 rounded-full px-4 text-xs"
                  onClick={() => {
                    void (async () => {
                      const result = await unlinkAccount({
                        accountId: account.accountId || account.id,
                      });
                      if (!result.success) {
                        setError(result.message);
                        return;
                      }
                      onToast?.("Account unlinked");
                      await refresh();
                    })();
                  }}
                >
                  Unlink
                </Button>
              </li>
            ))}
          </ul>
        )}
        <Button
          type="button"
          className="mt-3 h-9 rounded-full px-4 text-xs"
          onClick={() => {
            void (async () => {
              const result = await linkSocialAccount({ provider: "google" });
              if (!result.success) {
                setError(result.message);
                onToast?.(result.message);
              }
            })();
          }}
        >
          Link Google
        </Button>
      </div>
    </section>
  );
}

function formatDate(value?: string | Date) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
