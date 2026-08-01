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
  pending: "bg-amber-500/15 text-amber-200",
  approved: "bg-emerald-500/15 text-emerald-300",
  rejected: "bg-rose-500/15 text-rose-300",
  contacted: "bg-sky-500/15 text-sky-300",
  joined: "bg-violet-500/15 text-violet-300",
  inactive: "bg-zinc-500/15 text-zinc-400",
};

function StatusPill({ status }: { status: SeatRequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em]",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}

function applicantLabel(value: SeatRequestRow["applicant_status"]) {
  if (!value) return "—";
  if (value === "working_professional") return "Working Professional";
  if (value === "career_switcher") return "Career Switcher";
  return "Student";
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
  const [filter, setFilter] = useState<"all" | SeatRequestStatus>("all");
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
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-6 py-12 text-center text-sm text-white/45">
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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              filter === f.id
                ? "bg-white/10 text-white"
                : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
            )}
          >
            {f.label}
            {f.id !== "all" ? (
              <span className="ml-1.5 text-zinc-600">
                {items.filter((r) => r.status === f.id).length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/8 bg-white/[0.03] text-[11px] uppercase tracking-[0.12em] text-white/40">
              <tr>
                <th className="px-4 py-3 font-semibold">Applicant</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Requested</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e56b68]/40 to-[#5f3435]/60 text-[11px] font-semibold text-white">
                        {initials(row.name) || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white/90">
                          {row.name}
                        </p>
                        <p className="truncate text-xs text-white/40">
                          {applicantLabel(row.applicant_status)}
                          {row.country ? ` · ${row.country}` : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-white/70">{row.email}</p>
                    <p className="text-xs text-white/40">{row.phone || "—"}</p>
                  </td>
                  <td className="px-4 py-3.5 text-white/50">
                    {formatDate(row.created_at)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-4 py-3.5 text-xs capitalize text-white/45">
                    {(row.source ?? "reserve_access").replaceAll("_", " ")}
                  </td>
                  <td className="max-w-[160px] truncate px-4 py-3.5 text-xs text-white/40">
                    {row.notes || row.message || "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {row.status === "pending" || row.status === "contacted" ? (
                        <>
                          <Button
                            size="sm"
                            disabled={isPending}
                            className="h-8 rounded-full bg-emerald-500/90 px-3 text-xs text-black hover:bg-emerald-400"
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
                            className="h-8 rounded-full border-white/15 bg-transparent px-3 text-xs text-white/75"
                            onClick={() =>
                              run(() => rejectSeatRequestAction(row.id))
                            }
                          >
                            Reject
                          </Button>
                        </>
                      ) : null}
                      {row.status === "pending" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          className="h-8 rounded-full border-white/15 bg-transparent px-3 text-xs text-sky-200"
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
                        className="h-8 w-8 rounded-full p-0 text-white/50"
                        title="Copy email"
                        onClick={() => copyText("Email", row.email)}
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 rounded-full p-0 text-white/50"
                        title="Copy phone"
                        onClick={() => copyText("Phone", row.phone)}
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 rounded-full p-0 text-white/50"
                        title="View details"
                        onClick={() => openDetails(row)}
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isPending}
                        className="h-8 w-8 rounded-full p-0 text-rose-300/80 hover:bg-rose-500/10 hover:text-rose-200"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detail ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setDetailId(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#e56b68]/40 to-[#5f3435]/60 text-sm font-semibold text-white">
                  {initials(detail.name)}
                </div>
                <div>
                  <h3 className="font-display text-lg text-white">
                    {detail.name}
                  </h3>
                  <p className="text-sm text-white/50">{detail.email}</p>
                </div>
              </div>
              <StatusPill status={detail.status} />
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-white/40">Phone</dt>
                <dd className="mt-0.5 text-white/80">{detail.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-white/40">Country</dt>
                <dd className="mt-0.5 text-white/80">{detail.country || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-white/40">Current status</dt>
                <dd className="mt-0.5 text-white/80">
                  {applicantLabel(detail.applicant_status)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-white/40">College</dt>
                <dd className="mt-0.5 text-white/80">
                  {detail.college_name || "—"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-white/40">Message</dt>
                <dd className="mt-0.5 text-white/70">
                  {detail.message || "—"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-white/40">Requested</dt>
                <dd className="mt-0.5 text-white/70">
                  {formatDate(detail.created_at)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 space-y-2">
              <label className="text-xs text-white/40" htmlFor="admin-notes">
                Internal notes
              </label>
              <textarea
                id="admin-notes"
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none focus:border-white/20"
                placeholder="Add CRM notes…"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  disabled={isPending}
                  className="rounded-full"
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
                  className="rounded-full border-white/15 bg-transparent"
                  onClick={() => copyText("Email", detail.email)}
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Copy email
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full"
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
