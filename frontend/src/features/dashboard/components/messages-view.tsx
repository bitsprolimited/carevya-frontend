"use client";

import {
  BadgeCheck,
  CheckCheck,
  Paperclip,
  Phone,
  Search,
  SendHorizontal,
  Smile,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookCaregiverModal } from "@/features/dashboard/components/book-caregiver-modal";
import { CareseekerShell } from "@/features/dashboard/components/careseeker-shell";
import { CareseekerTopbar } from "@/features/dashboard/components/careseeker-topbar";
import { ChatThreadMenu } from "@/features/dashboard/components/chat-thread-menu";
import { MessageCaregiverModal } from "@/features/dashboard/components/message-caregiver-modal";
import { MessagesEmptyState } from "@/features/dashboard/components/messages-empty-state";
import { getCaregiverProfile } from "@/features/dashboard/data/caregiver-profiles";
import { mockMessageThreads } from "@/features/dashboard/data/mock-messages";
import type { MessageThread } from "@/features/dashboard/types/messages";
import { cn } from "@/lib/utils";

export function MessagesView({
  initialEmpty = false,
}: {
  initialEmpty?: boolean;
}) {
  const [threads, setThreads] = useState<MessageThread[]>(
    initialEmpty ? [] : mockMessageThreads,
  );
  const [activeId, setActiveId] = useState<string | null>(
    initialEmpty ? null : (mockMessageThreads[0]?.id ?? null),
  );
  const [listFilter, setListFilter] = useState<"all" | "unread">("all");
  const [listQuery, setListQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [bookOpen, setBookOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const unreadTotal = threads.reduce(
    (sum, thread) => sum + thread.unreadCount,
    0,
  );

  const visibleThreads = useMemo(() => {
    const query = listQuery.trim().toLowerCase();
    return threads
      .filter((thread) =>
        listFilter === "unread" ? thread.unreadCount > 0 : true,
      )
      .filter((thread) =>
        query
          ? thread.caregiverName.toLowerCase().includes(query) ||
            thread.preview.toLowerCase().includes(query)
          : true,
      )
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  }, [threads, listFilter, listQuery]);

  const activeThread =
    threads.find((thread) => thread.id === activeId) ?? visibleThreads[0] ?? null;

  const bookingProfile = activeThread
    ? getCaregiverProfile(activeThread.caregiverId)
    : null;

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function selectThread(id: string) {
    setActiveId(id);
    setThreads((current) =>
      current.map((thread) =>
        thread.id === id ? { ...thread, unreadCount: 0 } : thread,
      ),
    );
  }

  function markAllRead() {
    setThreads((current) =>
      current.map((thread) => ({ ...thread, unreadCount: 0 })),
    );
  }

  function sendMessage() {
    const body = draft.trim();
    if (!body || !activeThread) return;
    const nextMessage = {
      id: `local-${Date.now()}`,
      from: "seeker" as const,
      body,
      timeLabel: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    setThreads((current) =>
      current.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              preview: body,
              timeLabel: "Just now",
              messages: [...thread.messages, nextMessage],
            }
          : thread,
      ),
    );
    setDraft("");
  }

  function deleteThread(id: string) {
    setThreads((current) => {
      const next = current.filter((thread) => thread.id !== id);
      if (activeId === id) {
        setActiveId(next[0]?.id ?? null);
      }
      return next;
    });
    showToast("Chat deleted");
  }

  return (
    <CareseekerShell>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
        <CareseekerTopbar
          title="Messages"
          subtitle="Stay connected with caregivers"
          showSearch={false}
        />

        {threads.length === 0 ? (
          <div className="mt-6 flex min-h-[28rem] flex-1 rounded-2xl border border-[#E8EEF5] bg-white shadow-sm">
            <MessagesEmptyState />
          </div>
        ) : (
          <div className="mt-6 grid min-h-0 flex-1 gap-4 lg:grid-cols-[22rem_minmax(0,1fr)] xl:grid-cols-[24rem_minmax(0,1fr)]">
            <section className="flex min-h-[28rem] flex-col rounded-2xl border border-[#E8EEF5] bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-[#E8EEF5] px-4 py-3.5">
                <h2 className="text-base font-bold text-navy">My messages</h2>
                <button
                  type="button"
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-blue-hover"
                >
                  <CheckCheck className="size-3.5" aria-hidden />
                  Mark all as read
                </button>
              </div>

              <div className="space-y-3 px-4 py-3">
                <label className="flex h-10 items-center gap-2 rounded-full bg-[#F3F6FB] px-3">
                  <Search className="size-4 shrink-0 text-navy/40" aria-hidden />
                  <input
                    type="search"
                    value={listQuery}
                    onChange={(event) => setListQuery(event.target.value)}
                    placeholder="Search for your messages here"
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm text-navy outline-none placeholder:text-navy/40"
                  />
                </label>

                <div
                  role="tablist"
                  aria-label="Message filters"
                  className="inline-flex rounded-full bg-[#F3F6FB] p-1"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={listFilter === "all"}
                    onClick={() => setListFilter("all")}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                      listFilter === "all"
                        ? "bg-white text-navy shadow-sm"
                        : "text-navy/55 hover:text-navy",
                    )}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={listFilter === "unread"}
                    onClick={() => setListFilter("unread")}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                      listFilter === "unread"
                        ? "bg-white text-navy shadow-sm"
                        : "text-navy/55 hover:text-navy",
                    )}
                  >
                    Unread ({unreadTotal})
                  </button>
                </div>
              </div>

              <ul className="flex-1 overflow-y-auto px-2 pb-3">
                {visibleThreads.length === 0 ? (
                  <li className="px-3 py-8 text-center text-sm text-navy/50">
                    No conversations match your filters.
                  </li>
                ) : (
                  visibleThreads.map((thread) => {
                    const active = thread.id === activeThread?.id;
                    return (
                      <li key={thread.id}>
                        <button
                          type="button"
                          onClick={() => selectThread(thread.id)}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                            active
                              ? "bg-[#EAF2FF]"
                              : "hover:bg-[#F8FAFC]",
                          )}
                        >
                          <span className="relative mt-0.5 size-11 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                            <Image
                              src={thread.avatarUrl}
                              alt=""
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-1.5">
                              <span className="truncate text-sm font-bold text-navy">
                                {thread.caregiverName}
                              </span>
                              {thread.verified ? (
                                <BadgeCheck
                                  className="size-3.5 shrink-0 fill-emerald text-white"
                                  aria-label="Verified"
                                />
                              ) : null}
                              {thread.pinned ? (
                                <span className="text-[0.625rem] font-semibold text-brand-blue">
                                  Pinned
                                </span>
                              ) : null}
                            </span>
                            <span className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-navy/55">
                              {thread.preview}
                            </span>
                            <span className="mt-1 block text-[0.6875rem] text-navy/40">
                              {thread.timeLabel}
                            </span>
                          </span>
                          {thread.unreadCount > 0 ? (
                            <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald text-[0.625rem] font-bold text-white">
                              {thread.unreadCount}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </section>

            <section className="flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-sm">
              {activeThread ? (
                <>
                  <div className="flex flex-wrap items-center gap-3 border-b border-[#E8EEF5] px-4 py-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-surface-soft">
                        <Image
                          src={activeThread.avatarUrl}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-navy">
                          {activeThread.caregiverName}
                        </p>
                        <p
                          className={cn(
                            "text-xs font-medium",
                            activeThread.online
                              ? "text-emerald"
                              : "text-navy/45",
                          )}
                        >
                          {activeThread.online ? "Online now" : "Offline"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Search conversation"
                        className="inline-flex size-9 items-center justify-center rounded-full text-navy/55 hover:bg-surface-soft hover:text-navy"
                      >
                        <Search className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label="Call"
                        className="inline-flex size-9 items-center justify-center rounded-full text-navy/55 hover:bg-surface-soft hover:text-navy"
                      >
                        <Phone className="size-4" aria-hidden />
                      </button>
                      <ChatThreadMenu
                        caregiverId={activeThread.caregiverId}
                        pinned={activeThread.pinned}
                        onPin={() => {
                          setThreads((current) =>
                            current.map((thread) =>
                              thread.id === activeThread.id
                                ? { ...thread, pinned: !thread.pinned }
                                : thread,
                            ),
                          );
                          showToast(
                            activeThread.pinned ? "Chat unpinned" : "Chat pinned",
                          );
                        }}
                        onBlock={() =>
                          showToast(`${activeThread.caregiverFirstName} blocked`)
                        }
                        onReport={() =>
                          showToast(
                            `Report submitted for ${activeThread.caregiverFirstName}`,
                          )
                        }
                        onDelete={() => deleteThread(activeThread.id)}
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="ml-1 rounded-full px-4"
                        onClick={() => setBookOpen(true)}
                        disabled={!bookingProfile}
                      >
                        Book {activeThread.caregiverFirstName}
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto bg-[#F8FAFC] px-4 py-5 sm:px-6">
                    <div className="flex justify-center">
                      <span className="rounded-full bg-white px-3 py-1 text-[0.6875rem] font-semibold text-navy/45 shadow-sm">
                        Today
                      </span>
                    </div>
                    {activeThread.messages.map((message) => {
                      const outgoing = message.from === "seeker";
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            outgoing ? "justify-end" : "justify-start",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[min(100%,24rem)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                              outgoing
                                ? "rounded-br-md bg-brand-blue text-white"
                                : "rounded-bl-md bg-navy text-white",
                            )}
                          >
                            <p>{message.body}</p>
                            <p
                              className={cn(
                                "mt-1.5 text-[0.625rem]",
                                outgoing ? "text-white/75" : "text-white/60",
                              )}
                            >
                              {message.timeLabel}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-[#E8EEF5] bg-white px-4 py-3">
                    <div className="flex items-center gap-2 rounded-full border border-[#D7E0EA] bg-[#F8FAFC] px-2 py-1.5">
                      <button
                        type="button"
                        aria-label="Emoji"
                        className="inline-flex size-9 items-center justify-center rounded-full text-navy/45 hover:bg-white hover:text-navy"
                      >
                        <Smile className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label="Attach file"
                        className="inline-flex size-9 items-center justify-center rounded-full text-navy/45 hover:bg-white hover:text-navy"
                      >
                        <Paperclip className="size-4" aria-hidden />
                      </button>
                      <input
                        type="text"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Type your message here"
                        className="min-w-0 flex-1 border-0 bg-transparent px-1 text-sm text-navy outline-none placeholder:text-navy/40"
                      />
                      <button
                        type="button"
                        aria-label="Send message"
                        onClick={sendMessage}
                        disabled={!draft.trim()}
                        className="inline-flex size-10 items-center justify-center rounded-full bg-brand-blue text-white transition-colors hover:bg-brand-blue-hover disabled:opacity-40"
                      >
                        <SendHorizontal className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-navy/50">
                  Select a conversation to start chatting.
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {bookingProfile ? (
        <>
          <BookCaregiverModal
            open={bookOpen}
            onClose={() => setBookOpen(false)}
            caregiver={bookingProfile}
            onMessage={() => setMessageOpen(true)}
          />
          <MessageCaregiverModal
            open={messageOpen}
            onClose={() => setMessageOpen(false)}
            caregiver={bookingProfile}
          />
        </>
      ) : null}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-navy px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </CareseekerShell>
  );
}
