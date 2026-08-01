"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Check,
  Copy,
  Mail,
  MoreHorizontal,
  Phone,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  approveSeatRequestAction,
  contactSeatRequestAction,
  deleteSeatRequestAction,
  rejectSeatRequestAction,
  resendSeatInviteAction,
  updateSeatRequestNotesAction,
} from "@/features/auth/actions/seat-actions";
import type { SeatRequestRow, SeatRequestStatus } from "@/types/database";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const STATUS_STYLES: Record<SeatRequestStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-200",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  rejected: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  contacted: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  joined: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  inactive: "bg-zinc-500/15 text-zinc-400",
};

function StatusPill({ status }: { status: SeatRequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em]",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}

async function copyText(label: string, value: string | null | undefined) {
  if (!value) {
    toast.error(`No ${label.toLowerCase()} on file.`);
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied.`);
  } catch {
    toast.error(`Could not copy ${label.toLowerCase()}.`);
  }
}

export function AccessRequestsTable({ items }: { items: SeatRequestRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | SeatRequestStatus>("pending");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((r) => r.status === filter);
  }, [filter, items]);

  const detail = items.find((r) => r.id === detailId) ?? null;

  function run(
    action: () => Promise<{ success: boolean; error?: string; message?: string }>
  ) {
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        toast.error(result.error ?? "Action failed.");
        return;
      }
      toast.success(result.message ?? "Done.");
    });
  }

  function openDetails(row: SeatRequestRow) {
    setDetailId(row.id);
    setNotesDraft(row.notes ?? "");
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-12 text-center text-sm font-medium text-zinc-400">
        No access requests yet.
      </div>
    );
  }

  const filters: Array<{ id: "all" | SeatRequestStatus; label: string }> = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "contacted", label: "Contacted" },
    { id: "approved", label: "Approved" },
    { id: "joined", label: "Joined" },
    { id: "rejected", label: "Rejected" },
    { id: "inactive", label: "Inactive" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count =
            f.id === "all"
              ? items.length
              : items.filter((r) => r.status === f.id).length;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition",
                active
                  ? "bg-zinc-50 text-zinc-950 shadow-sm"
                  : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "tabular-nums text-[12px] font-semibold",
                  active ? "text-zinc-700" : "text-zinc-500"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-zinc-800 bg-zinc-900/80">
              <tr className="text-[12px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
                <th className="px-4 py-3.5 sm:px-5">Applicant</th>
                <th className="px-4 py-3.5 sm:px-5">Contact</th>
                <th className="hidden px-4 py-3.5 sm:table-cell sm:px-5">
                  Requested
                </th>
                <th className="px-4 py-3.5 sm:px-5">Status</th>
                <th className="px-4 py-3.5 text-right sm:px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm font-medium text-zinc-400"
                  >
                    No requests in this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-800/80 last:border-0"
                  >
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e56b68]/50 to-[#5f3435] text-[12px] font-semibold text-white">
                          {initials(row.name) || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-semibold text-zinc-50">
                            {row.name}
                          </p>
                          <p className="mt-0.5 truncate text-[12.5px] font-medium text-zinc-400">
                            {row.country || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <p className="truncate text-[13.5px] font-medium text-zinc-100">
                        {row.email}
                      </p>
                      <p className="mt-0.5 truncate text-[12.5px] font-medium tabular-nums text-zinc-400">
                        {row.phone || "—"}
                      </p>
                    </td>
                    <td className="hidden px-4 py-4 text-[13px] font-medium text-zinc-300 sm:table-cell sm:px-5">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex flex-nowrap items-center justify-end gap-1.5">
                        {row.status === "pending" ||
                        row.status === "contacted" ? (
                          <>
                            <Button
                              size="sm"
                              disabled={isPending}
                              className="h-8 rounded-full bg-emerald-600 px-3 text-[12px] font-semibold text-white hover:bg-emerald-500"
                              onClick={() =>
                                run(() => approveSeatRequestAction(row.id))
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isPending}
                              className="h-8 rounded-full border-zinc-700 bg-transparent px-3 text-[12px] font-semibold text-zinc-200 hover:bg-zinc-900"
                              onClick={() =>
                                run(() => rejectSeatRequestAction(row.id))
                              }
                            >
                              Reject
                            </Button>
                          </>
                        ) : null}
                        {row.status === "approved" ? (
                          <Button
                            size="sm"
                            disabled={isPending}
                            className="h-8 rounded-full bg-zinc-50 px-3 text-[12px] font-semibold text-zinc-950 hover:bg-zinc-100"
                            onClick={() =>
                              run(() => resendSeatInviteAction(row.id))
                            }
                          >
                            Resend
                          </Button>
                        ) : null}
                        {row.status === "pending" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isPending}
                            className="h-8 rounded-full border-sky-500/40 bg-transparent px-3 text-[12px] font-semibold text-sky-700 hover:bg-sky-500/10 dark:text-sky-200"
                            onClick={() =>
                              run(() => contactSeatRequestAction(row.id))
                            }
                          >
                            Contact
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 rounded-full p-0 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                          title="Copy email"
                          onClick={() => copyText("Email", row.email)}
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 rounded-full p-0 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                          title="Copy phone"
                          onClick={() => copyText("Phone", row.phone)}
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 rounded-full p-0 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                          title="View details"
                          onClick={() => openDetails(row)}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isPending}
                          className="h-8 w-8 rounded-full p-0 text-rose-600 hover:bg-rose-500/10 hover:text-rose-500 dark:text-rose-300"
                          title="Delete"
                          onClick={() => {
                            if (
                              !confirm(
                                `Delete access request for ${row.email}? This cannot be undone.`
                              )
                            ) {
                              return;
                            }
                            run(() => deleteSeatRequestAction(row.id));
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setDetailId(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#e56b68]/50 to-[#5f3435] text-sm font-semibold text-white">
                  {initials(detail.name)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-50">
                    {detail.name}
                  </h3>
                  <p className="text-sm font-medium text-zinc-400">
                    {detail.email}
                  </p>
                </div>
              </div>
              <StatusPill status={detail.status} />
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  Phone
                </dt>
                <dd className="mt-1 font-medium text-zinc-100">
                  {detail.phone || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  Country
                </dt>
                <dd className="mt-1 font-medium text-zinc-100">
                  {detail.country || "—"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  Requested
                </dt>
                <dd className="mt-1 font-medium text-zinc-200">
                  {formatDate(detail.created_at)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 space-y-2">
              <label
                className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500"
                htmlFor="admin-notes"
              >
                Internal notes
              </label>
              <textarea
                id="admin-notes"
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-600"
                placeholder="Add CRM notes…"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  disabled={isPending}
                  className="rounded-full font-semibold"
                  onClick={() =>
                    run(async () => {
                      const result = await updateSeatRequestNotesAction(
                        detail.id,
                        notesDraft
                      );
                      return result;
                    })
                  }
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  Save notes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-zinc-700 bg-transparent font-semibold"
                  onClick={() => copyText("Email", detail.email)}
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Copy email
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full font-semibold"
                  onClick={() => setDetailId(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
