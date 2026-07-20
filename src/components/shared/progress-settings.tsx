"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle2, Download, Upload } from "lucide-react";
import { useProgressStore } from "@/store/use-progress-store";
import { useTotalWeeks } from "@/hooks/use-curriculum";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/shared/filter-pills";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  RESET_SECTIONS,
  resetScopeLabel,
  type ResetScope,
  type ResetSectionId,
} from "@/lib/reset-sections";

type PendingReset = { section: ResetSectionId; scope: ResetScope } | null;

export function ProgressSettings() {
  const totalWeeks = useTotalWeeks();
  const resetSectionProgress = useProgressStore((s) => s.resetSectionProgress);
  const exportProgress = useProgressStore((s) => s.exportProgress);
  const importProgress = useProgressStore((s) => s.importProgress);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sectionScopes, setSectionScopes] = useState<Record<ResetSectionId, ResetScope>>(() =>
    Object.fromEntries(RESET_SECTIONS.map((s) => [s.id, "all"])) as Record<
      ResetSectionId,
      ResetScope
    >
  );
  const [pending, setPending] = useState<PendingReset>(null);
  const [message, setMessage] = useState<string | null>(null);

  const weekOptions = useMemo(
    () =>
      Array.from({ length: totalWeeks }, (_, i) => ({
        value: i + 1,
        label: `Week ${i + 1}`,
      })),
    [totalWeeks]
  );

  const scopeOptions = useMemo(
    () => [{ value: "all" as const, label: "All weeks" }, ...weekOptions],
    [weekOptions]
  );

  const showSuccess = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleConfirm = () => {
    if (!pending) return;
    resetSectionProgress(pending.section, pending.scope);
    const meta = RESET_SECTIONS.find((s) => s.id === pending.section);
    const scopeText = meta?.supportsWeekScope ? resetScopeLabel(pending.scope) : "";
    showSuccess(`${meta?.label ?? "Section"} reset${scopeText ? ` (${scopeText})` : ""}.`);
    setPending(null);
  };

  const confirmCopy = useMemo(() => {
    if (!pending) return null;
    const meta = RESET_SECTIONS.find((s) => s.id === pending.section);
    const scope = meta?.supportsWeekScope ? resetScopeLabel(pending.scope) : "";
    return {
      title: `${meta?.label ?? "Reset"}?`,
      description: `${meta?.description ?? ""}${scope ? ` (${scope})` : ""} This cannot be undone.`,
      confirmLabel: "Reset",
      variant: "warning" as const,
    };
  }, [pending]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-zinc-200">Backup &amp; restore</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Export all progress to a JSON file or import on another browser. No account needed — everything stays client-side.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 border-zinc-700"
            onClick={() => exportProgress()}
          >
            <Download className="h-3.5 w-3.5" />
            Export progress
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 border-zinc-700"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
            Import progress
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  importProgress(String(reader.result ?? ""));
                  showSuccess("Progress imported successfully.");
                } catch {
                  showSuccess("Import failed — invalid backup file.");
                }
              };
              reader.readAsText(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-200">Reset progress</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Choose exactly what to clear — by section — without affecting the rest.
          </p>
        </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {message}
        </motion.div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {RESET_SECTIONS.map((section) => (
          <div
            key={section.id}
            className="flex min-h-[60px] items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4"
          >
            <p className="w-[100px] shrink-0 text-sm font-medium leading-snug text-zinc-300 sm:w-[118px]">
              {section.label.replace("Reset ", "")}
            </p>
            <p className="min-w-0 flex-1 truncate text-xs text-zinc-500">{section.description}</p>
            {section.supportsWeekScope ? (
              <FilterSelect
                label="Scope"
                value={sectionScopes[section.id]}
                onChange={(scope) =>
                  setSectionScopes((prev) => ({ ...prev, [section.id]: scope }))
                }
                options={scopeOptions}
                className="w-[96px] shrink-0 sm:w-[108px]"
              />
            ) : null}
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 border-zinc-700 px-2.5 text-zinc-300 hover:bg-zinc-800/60 sm:px-3"
              onClick={() =>
                setPending({
                  section: section.id,
                  scope: sectionScopes[section.id],
                })
              }
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        ))}
      </div>

      {confirmCopy && (
        <ConfirmDialog
          open={pending !== null}
          title={confirmCopy.title}
          description={confirmCopy.description}
          confirmLabel={confirmCopy.confirmLabel}
          variant={confirmCopy.variant}
          onConfirm={handleConfirm}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
    </div>
  );
}
